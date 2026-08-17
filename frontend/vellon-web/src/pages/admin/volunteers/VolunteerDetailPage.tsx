import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../../../components/admin/StatusBadge';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { volunteerService, type Volunteer } from '../../../services/volunteerService';

export default function VolunteerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    volunteerService.getById(Number(id))
      .then(setVolunteer)
      .catch(() => navigate('/admin/volunteers'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleStatusChange = async (status: string) => {
    if (!volunteer) return;
    const updated = await volunteerService.updateStatus(volunteer.id, status);
    setVolunteer(updated);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await volunteerService.delete(Number(id));
      navigate('/admin/volunteers');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="loading-text">Cargando...</div>;
  if (!volunteer) return null;

  return (
    <div>
      <div className="page-header">
        <h1>Detalle del voluntario</h1>
        <div className="action-row">
          {volunteer.status === 'Pendiente' && (
            <button className="btn-secondary" onClick={() => handleStatusChange('Activo')}>✅ Activar</button>
          )}
          {volunteer.status === 'Activo' && (
            <button className="btn-secondary" onClick={() => handleStatusChange('Inactivo')}>⏸ Desactivar</button>
          )}
          {volunteer.status === 'Inactivo' && (
            <button className="btn-secondary" onClick={() => handleStatusChange('Activo')}>▶ Reactivar</button>
          )}
          <button className="btn-danger" onClick={() => setShowConfirm(true)}>Eliminar</button>
          <button className="btn-secondary" onClick={() => navigate('/admin/volunteers')}>← Volver</button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-grid">
          <div className="detail-field"><label>Nombre completo</label><p>{volunteer.fullName}</p></div>
          <div className="detail-field"><label>Cédula</label><p>{volunteer.idNumber}</p></div>
          <div className="detail-field"><label>Email</label><p>{volunteer.email}</p></div>
          <div className="detail-field"><label>Teléfono</label><p>{volunteer.phone}</p></div>
          <div className="detail-field">
            <label>Estado</label>
            <p><StatusBadge value={volunteer.status} /></p>
          </div>
          <div className="detail-field">
            <label>Fecha de registro</label>
            <p>{new Date(volunteer.createdAt).toLocaleDateString('es-CR')}</p>
          </div>
        </div>
        {volunteer.availableSchedule && (
          <div style={{ marginTop: 20 }}>
            <div className="detail-field">
              <label>Horario disponible</label>
              <p style={{ marginTop: 6 }}>{volunteer.availableSchedule}</p>
            </div>
          </div>
        )}
      </div>

      {showConfirm && (
        <ConfirmDialog onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} loading={deleting} />
      )}
    </div>
  );
}
