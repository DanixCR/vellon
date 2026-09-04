import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../../../components/admin/StatusBadge';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { volunteerService, type VolunteerDetail } from '../../../services/volunteerService';
import { formatDate, formatDateTime } from '../../../utils/dateUtils';

function parseList(json?: string): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [json];
  } catch {
    return [json];
  }
}

export default function VolunteerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState<VolunteerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusError, setStatusError] = useState('');

  useEffect(() => {
    volunteerService.getById(Number(id))
      .then(setVolunteer)
      .catch(() => navigate('/admin/volunteers'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleStatusChange = async (status: string) => {
    if (!volunteer) return;
    setStatusError('');
    try {
      const updated = await volunteerService.updateStatus(volunteer.id, status, null);
      setVolunteer(updated);
    } catch {
      setStatusError('No se pudo actualizar el estado. Por favor intentá de nuevo.');
    }
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

      {statusError && <div className="error-text">{statusError}</div>}

      <div className="detail-card">
        <div className="detail-grid">
          <div className="detail-field"><label>Nombre completo</label><p>{volunteer.fullName}</p></div>
          <div className="detail-field"><label>Cédula</label><p>{volunteer.idNumber}</p></div>
          <div className="detail-field"><label>Fecha de nacimiento</label><p>{formatDate(volunteer.birthDate)}</p></div>
          <div className="detail-field"><label>Edad</label><p>{volunteer.age ?? '—'}</p></div>
          <div className="detail-field"><label>Email</label><p>{volunteer.email}</p></div>
          <div className="detail-field"><label>Teléfono</label><p>{volunteer.phone}</p></div>
          <div className="detail-field"><label>Dirección</label><p>{volunteer.address || '—'}</p></div>
          <div className="detail-field"><label>Ocupación actual</label><p>{volunteer.currentOccupation || '—'}</p></div>
          <div className="detail-field">
            <label>Estado</label>
            <p><StatusBadge value={volunteer.status} /></p>
          </div>
          <div className="detail-field">
            <label>Fecha de registro</label>
            <p>{formatDateTime(volunteer.createdAt)}</p>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 className="form-section-title">Disponibilidad</h3>
          <div className="detail-grid">
            <div className="detail-field"><label>Días disponibles</label><p>{parseList(volunteer.availableDays).join(', ') || '—'}</p></div>
            <div className="detail-field"><label>Horario</label><p>{volunteer.availableSchedule || '—'}</p></div>
            <div className="detail-field"><label>Horas semanales</label><p>{volunteer.weeklyHours ?? '—'}</p></div>
            <div className="detail-field"><label>Disponibilidad especial</label><p>{volunteer.specialAvailability || '—'}</p></div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 className="form-section-title">Habilidades</h3>
          <div className="detail-grid">
            <div className="detail-field"><label>Habilidades</label><p>{parseList(volunteer.skills).join(', ') || '—'}</p></div>
            <div className="detail-field"><label>Otras habilidades</label><p>{volunteer.otherSkills || '—'}</p></div>
            <div className="detail-field"><label>Experiencia previa en voluntariado</label><p>{volunteer.previousVolunteerExperience || '—'}</p></div>
            <div className="detail-field"><label>Estudios o formación</label><p>{volunteer.educationLevel || '—'}</p></div>
            <div className="detail-field"><label>Idiomas</label><p>{volunteer.languages || '—'}</p></div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 className="form-section-title">Área de interés</h3>
          <div className="detail-grid">
            <div className="detail-field"><label>Áreas de interés</label><p>{parseList(volunteer.interestAreas).join(', ') || '—'}</p></div>
            <div className="detail-field"><label>Otra área de interés</label><p>{volunteer.otherInterestArea || '—'}</p></div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 className="form-section-title">Referencias personales</h3>
          <div className="detail-grid">
            <div className="detail-field"><label>Referencia 1</label><p>{volunteer.reference1Name || '—'} {volunteer.reference1Relation ? `(${volunteer.reference1Relation})` : ''}</p></div>
            <div className="detail-field"><label>Teléfono / correo</label><p>{[volunteer.reference1Phone, volunteer.reference1Email].filter(Boolean).join(' · ') || '—'}</p></div>
            <div className="detail-field"><label>Referencia 2</label><p>{volunteer.reference2Name || '—'} {volunteer.reference2Relation ? `(${volunteer.reference2Relation})` : ''}</p></div>
            <div className="detail-field"><label>Teléfono / correo</label><p>{[volunteer.reference2Phone, volunteer.reference2Email].filter(Boolean).join(' · ') || '—'}</p></div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 className="form-section-title">Motivación</h3>
          <div className="detail-grid">
            <div className="detail-field"><label>¿Por qué quiere unirse?</label><p>{volunteer.motivation || '—'}</p></div>
            <div className="detail-field"><label>¿Qué espera aprender o aportar?</label><p>{volunteer.expectedContribution || '—'}</p></div>
          </div>
        </div>

        {volunteer.adminNotes && (
          <div style={{ marginTop: 20 }}>
            <h3 className="form-section-title">Notas del admin</h3>
            <div className="detail-field"><p>{volunteer.adminNotes}</p></div>
          </div>
        )}
      </div>

      {showConfirm && (
        <ConfirmDialog onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} loading={deleting} />
      )}
    </div>
  );
}
