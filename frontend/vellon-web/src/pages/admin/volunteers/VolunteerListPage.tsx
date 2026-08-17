import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import Pagination from '../../../components/admin/Pagination';
import StatusBadge from '../../../components/admin/StatusBadge';
import { volunteerService, type Volunteer } from '../../../services/volunteerService';

const PAGE_SIZE = 10;

export default function VolunteerListPage() {
  const [data, setData] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    volunteerService.getAll().then(setData).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = filter ? data.filter((v) => v.status === filter) : data;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusChange = async (id: number, status: string) => {
    const updated = await volunteerService.updateStatus(id, status);
    setData((prev) => prev.map((v) => v.id === id ? updated : v));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await volunteerService.delete(deleteId);
      setData((prev) => prev.filter((v) => v.id !== deleteId));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Voluntarios</h1>
      </div>

      <div className="filters-bar">
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      {loading && <div className="loading-text">Cargando...</div>}

      {!loading && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={5} className="empty-text">Sin voluntarios.</td></tr>
              )}
              {paged.map((v) => (
                <tr key={v.id}>
                  <td>{v.fullName}</td>
                  <td>{v.email}</td>
                  <td>{v.phone}</td>
                  <td><StatusBadge value={v.status} /></td>
                  <td>
                    <div className="action-row">
                      <button className="btn-primary btn-sm" onClick={() => navigate(`/admin/volunteers/${v.id}`)}>Ver</button>
                      {v.status === 'Pendiente' && (
                        <button className="btn-secondary btn-sm" onClick={() => handleStatusChange(v.id, 'Activo')}>✅ Activar</button>
                      )}
                      {v.status === 'Activo' && (
                        <button className="btn-secondary btn-sm" onClick={() => handleStatusChange(v.id, 'Inactivo')}>⏸ Desactivar</button>
                      )}
                      <button className="btn-danger btn-sm" onClick={() => setDeleteId(v.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {deleteId && (
        <ConfirmDialog onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
      )}
    </div>
  );
}
