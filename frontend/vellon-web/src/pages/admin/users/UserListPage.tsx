import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import Pagination from '../../../components/admin/Pagination';
import StatusBadge from '../../../components/admin/StatusBadge';
import { adminService, type AdminRecord, type CreateAdminInput } from '../../../services/adminService';
import { useAuth } from '../../../context/AuthContext';

const PAGE_SIZE = 10;

export default function UserListPage() {
  const [data, setData] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { admin: currentAdmin } = useAuth();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateAdminInput>();

  const load = () => {
    adminService.getAll().then(setData).catch(() => setError('Error al cargar los usuarios.')).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paged = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminService.delete(deleteId);
      setData((prev) => prev.filter((a) => a.id !== deleteId));
      setDeleteId(null);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message ?? 'No se pudo eliminar el administrador.');
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await adminService.toggleActive(id);
      setData((prev) => prev.map((a) => a.id === id ? { ...a, isActive: !a.isActive } : a));
    } catch {
      setError('No se pudo cambiar el estado del administrador.');
    }
  };

  const onSubmit = async (data: CreateAdminInput) => {
    try {
      const created = await adminService.create(data);
      setData((prev) => [...prev, created]);
      reset();
      setShowForm(false);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message ?? 'No se pudo crear el administrador.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Usuarios Administrativos</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Nuevo administrador'}
        </button>
      </div>

      {error && <div className="error-text" style={{ marginBottom: 16 }}>{error}</div>}

      {showForm && (
        <div className="form-card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20, fontFamily: 'var(--font-heading)' }}>Nuevo administrador</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group">
                <label>Usuario *</label>
                <input {...register('username', { required: 'Requerido.' })} />
                {errors.username && <p className="form-error">{errors.username.message}</p>}
              </div>
              <div className="form-group">
                <label>Nombre completo *</label>
                <input {...register('fullName', { required: 'Requerido.' })} />
                {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Correo electrónico *</label>
                <input type="email" {...register('email', { required: 'Requerido.' })} />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>
              <div className="form-group">
                <label>Contraseña *</label>
                <input type="password" {...register('password', { required: 'Requerido.', minLength: { value: 8, message: 'Mínimo 8 caracteres.' } })} />
                {errors.password && <p className="form-error">{errors.password.message}</p>}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear administrador'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className="loading-text">Cargando...</div>}

      {!loading && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={6} className="empty-text">Sin administradores.</td></tr>
              )}
              {paged.map((a) => (
                <tr key={a.id}>
                  <td>{a.username}</td>
                  <td>{a.fullName}</td>
                  <td>{a.email}</td>
                  <td>
                    <StatusBadge value={a.isSuperAdmin ? 'SuperAdmin' : 'Admin'} />
                  </td>
                  <td><StatusBadge value={a.isActive} /></td>
                  <td>
                    <div className="action-row">
                      <button className="btn-secondary btn-sm" onClick={() => handleToggle(a.id)}>
                        {a.isActive ? '⏸ Desactivar' : '▶ Activar'}
                      </button>
                      {a.id !== currentAdmin?.id && a.id !== 1 && (
                        <button className="btn-danger btn-sm" onClick={() => setDeleteId(a.id)}>Eliminar</button>
                      )}
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
