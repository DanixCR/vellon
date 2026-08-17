import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../../../components/admin/StatusBadge';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { contactService, type ContactRecord } from '../../../services/contactService';

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<ContactRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    contactService.getById(Number(id))
      .then(setContact)
      .catch(() => navigate('/admin/contacts'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const markRead = async () => {
    if (!contact || contact.isRead) return;
    await contactService.markAsRead(contact.id);
    setContact((prev) => prev ? { ...prev, isRead: true } : prev);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await contactService.delete(Number(id));
      navigate('/admin/contacts');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="loading-text">Cargando...</div>;
  if (!contact) return null;

  return (
    <div>
      <div className="page-header">
        <h1>Detalle de contacto</h1>
        <div className="action-row">
          {!contact.isRead && (
            <button className="btn-secondary" onClick={markRead}>✅ Marcar como leído</button>
          )}
          <button className="btn-danger" onClick={() => setShowConfirm(true)}>Eliminar</button>
          <button className="btn-secondary" onClick={() => navigate('/admin/contacts')}>← Volver</button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-grid">
          <div className="detail-field"><label>Nombre</label><p>{contact.fullName}</p></div>
          <div className="detail-field"><label>Email</label><p>{contact.email}</p></div>
          <div className="detail-field"><label>Teléfono</label><p>{contact.phone || '—'}</p></div>
          <div className="detail-field"><label>Tipo</label><p>{contact.type}</p></div>
          <div className="detail-field">
            <label>Estado</label>
            <p><StatusBadge value={contact.isRead} trueLabel="Leído" falseLabel="No leído" /></p>
          </div>
          <div className="detail-field">
            <label>Fecha</label>
            <p>{new Date(contact.createdAt).toLocaleString('es-CR')}</p>
          </div>
        </div>
        {contact.message && (
          <div style={{ marginTop: 20 }}>
            <div className="detail-field">
              <label>Mensaje</label>
              <p style={{ marginTop: 6, lineHeight: 1.6 }}>{contact.message}</p>
            </div>
          </div>
        )}
      </div>

      {showConfirm && (
        <ConfirmDialog
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          loading={deleting}
        />
      )}
    </div>
  );
}
