import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityToggle from '../../../components/admin/ActivityToggle';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import Pagination from '../../../components/admin/Pagination';
import { activityService, type ActivityAdmin } from '../../../services/activityService';
import { formatDate } from '../../../utils/dateUtils';

const PAGE_SIZE = 10;

export default function ActivityListPage() {
  const [data, setData] = useState<ActivityAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const load = () => {
    activityService.getAll().then(setData).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paged = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await activityService.delete(deleteId);
      setData((prev) => prev.filter((a) => a.id !== deleteId));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Actividades</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/activities/new')}>
          + Nueva actividad
        </button>
      </div>

      {loading && <div className="loading-text">Cargando...</div>}

      {!loading && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Fecha</th>
                <th>Visible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={4} className="empty-text">Sin actividades registradas.</td></tr>
              )}
              {paged.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{formatDate(a.activityDate)}</td>
                  <td>
                    <ActivityToggle
                      id={a.id}
                      isActive={a.isActive}
                      onChange={(id, val) =>
                        setData((prev) => prev.map((x) => x.id === id ? { ...x, isActive: val } : x))
                      }
                    />
                  </td>
                  <td>
                    <div className="action-row">
                      <button className="btn-secondary btn-sm" onClick={() => navigate(`/admin/activities/${a.id}/edit`)}>
                        Editar
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteId(a.id)}>
                        Eliminar
                      </button>
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
        <ConfirmDialog
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
