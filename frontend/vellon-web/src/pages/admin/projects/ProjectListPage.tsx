import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import Pagination from '../../../components/admin/Pagination';
import StatusBadge from '../../../components/admin/StatusBadge';
import { projectService, type ProjectList } from '../../../services/projectService';

const PAGE_SIZE = 10;

export default function ProjectListPage() {
  const [data, setData] = useState<ProjectList[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    projectService.getAll().then(setData).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = filter ? data.filter((p) => p.status === filter) : data;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await projectService.delete(deleteId);
      setData((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Proyectos</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/projects/new')}>+ Nuevo proyecto</button>
      </div>

      <div className="filters-bar">
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
          <option value="">Todos los estados</option>
          <option value="Planificado">Planificado</option>
          <option value="EnCurso">En curso</option>
          <option value="Completado">Completado</option>
          <option value="Suspendido">Suspendido</option>
        </select>
      </div>

      {loading && <div className="loading-text">Cargando...</div>}

      {!loading && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th>Inicio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={6} className="empty-text">Sin proyectos registrados.</td></tr>
              )}
              {paged.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.projectType}</td>
                  <td><StatusBadge value={p.status} /></td>
                  <td>{p.responsibleName}</td>
                  <td>{new Date(p.startDate).toLocaleDateString('es-CR')}</td>
                  <td>
                    <div className="action-row">
                      <button className="btn-primary btn-sm" onClick={() => navigate(`/admin/projects/${p.id}`)}>Ver</button>
                      <button className="btn-secondary btn-sm" onClick={() => navigate(`/admin/projects/${p.id}/edit`)}>Editar</button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteId(p.id)}>Eliminar</button>
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
