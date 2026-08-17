import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/admin/Pagination';
import StatusBadge from '../../../components/admin/StatusBadge';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { contactService, type ContactRecord } from '../../../services/contactService';

const PAGE_SIZE = 10;

export default function ContactListPage() {
  const [data, setData] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [readFilter, setReadFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    contactService.getAll()
      .then(setData)
      .catch(() => setError('Error al cargar los contactos.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = data
    .filter((c) => !typeFilter || c.type === typeFilter)
    .filter((c) => readFilter === '' ? true : readFilter === 'true' ? c.isRead : !c.isRead);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await contactService.delete(deleteId);
      setData((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError('No se pudo eliminar el registro.');
    } finally {
      setDeleting(false);
    }
  };

  const types = [...new Set(data.map((c) => c.type))];

  return (
    <div>
      <div className="page-header">
        <h1>Contactos y Donantes</h1>
      </div>

      <div className="filters-bar">
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
          <option value="">Todos los tipos</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={readFilter} onChange={(e) => { setReadFilter(e.target.value); setPage(1); }}>
          <option value="">Todos</option>
          <option value="false">No leídos</option>
          <option value="true">Leídos</option>
        </select>
      </div>

      {loading && <div className="loading-text">Cargando...</div>}
      {error && <div className="error-text">{error}</div>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={6} className="empty-text">Sin registros.</td></tr>
              )}
              {paged.map((c) => (
                <tr key={c.id}>
                  <td>{c.fullName}</td>
                  <td>{c.email}</td>
                  <td>{c.type}</td>
                  <td><StatusBadge value={c.isRead} trueLabel="Leído" falseLabel="No leído" /></td>
                  <td>{new Date(c.createdAt).toLocaleDateString('es-CR')}</td>
                  <td>
                    <div className="action-row">
                      <button className="btn-primary btn-sm" onClick={() => navigate(`/admin/contacts/${c.id}`)}>
                        Ver
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteId(c.id)}>
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
