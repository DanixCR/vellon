import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import Pagination from '../../../components/admin/Pagination';
import { socioeconomicService, type SocioeconomicSummary } from '../../../services/socioeconomicService';

const PAGE_SIZE = 10;

export default function SocioeconomicListPage() {
  const [data, setData] = useState<SocioeconomicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    socioeconomicService.getAll().then(setData).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paged = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await socioeconomicService.delete(deleteId);
      setData((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(n);

  return (
    <div>
      <div className="page-header">
        <h1>Estudios Socioeconómicos</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/socioeconomic/new')}>
          + Nuevo estudio
        </button>
      </div>

      {loading && <div className="loading-text">Cargando...</div>}

      {!loading && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Miembros</th>
                <th>Ingreso total</th>
                <th>Gasto total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={6} className="empty-text">Sin estudios registrados.</td></tr>
              )}
              {paged.map((s) => (
                <tr key={s.id}>
                  <td>#{s.id}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString('es-CR')}</td>
                  <td>{s.familyMemberCount}</td>
                  <td>{fmt(s.totalIncome)}</td>
                  <td>{fmt(s.totalExpenses)}</td>
                  <td>
                    <div className="action-row">
                      <button className="btn-primary btn-sm" onClick={() => navigate(`/admin/socioeconomic/${s.id}`)}>Ver</button>
                      <button className="btn-secondary btn-sm" onClick={() => navigate(`/admin/socioeconomic/${s.id}/edit`)}>Editar</button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteId(s.id)}>Eliminar</button>
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
