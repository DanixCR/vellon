import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import StatusBadge from '../../../components/admin/StatusBadge';
import { projectService, type ProjectDetail } from '../../../services/projectService';
import { formatDate } from '../../../utils/dateUtils';

const fmt = (n?: number | null) =>
  n != null ? new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(n) : '—';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    projectService.getById(Number(id))
      .then(setProject)
      .catch(() => navigate('/admin/projects'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await projectService.delete(Number(id));
      navigate('/admin/projects');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!project) return;
    const updated = await projectService.updateStatus(project.id, status);
    setProject(updated);
  };

  const completeActivity = async (actId: number) => {
    if (!project) return;
    const updated = await projectService.completeActivity(project.id, actId);
    setProject(updated);
  };

  if (loading) return <div className="loading-text">Cargando...</div>;
  if (!project) return null;

  const Field = ({ label, value }: { label: string; value?: string | number | boolean | null }) => (
    <div className="detail-field">
      <label>{label}</label>
      <p>{value === true ? 'Sí' : value === false ? 'No' : (value ?? '—')}</p>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1>{project.name}</h1>
        <div className="action-row">
          {project.status === 'Planificado' && (
            <button className="btn-secondary" onClick={() => handleStatusChange('EnCurso')}>▶ Iniciar</button>
          )}
          {project.status === 'EnCurso' && (
            <button className="btn-secondary" onClick={() => handleStatusChange('Completado')}>✅ Completar</button>
          )}
          <button className="btn-secondary" onClick={() => navigate(`/admin/projects/${project.id}/edit`)}>Editar</button>
          <button className="btn-danger" onClick={() => setShowConfirm(true)}>Eliminar</button>
          <button className="btn-secondary" onClick={() => navigate('/admin/projects')}>← Volver</button>
        </div>
      </div>

      <div className="detail-card">
        <div style={{ marginBottom: 12 }}>
          <StatusBadge value={project.status} />
        </div>
        <div className="detail-grid">
          <Field label="Tipo" value={project.projectType} />
          <Field label="Responsable" value={project.responsibleName} />
          <Field label="Rol responsable" value={project.responsibleRole} />
          <Field label="Teléfono responsable" value={project.responsiblePhone} />
          <Field label="Email responsable" value={project.responsibleEmail} />
          <Field label="Fecha de inicio" value={formatDate(project.startDate)} />
          {project.estimatedEndDate && (
            <Field label="Fecha estimada fin" value={formatDate(project.estimatedEndDate)} />
          )}
          <Field label="Duración" value={project.duration} />
          <Field label="Beneficiarios estimados" value={project.estimatedBeneficiaries} />
          <Field label="Ubicación geográfica" value={project.geographicLocation} />
          <Field label="Presupuesto total" value={fmt(project.totalBudget)} />
          <Field label="Tiene financiamiento" value={project.hasFunding} />
          {project.hasFunding && <Field label="Fuente de financiamiento" value={project.fundingSource} />}
        </div>
        <div style={{ marginTop: 16 }}>
          <Field label="Objetivo principal" value={project.mainObjective} />
          {project.specificObjectives && <Field label="Objetivos específicos" value={project.specificObjectives} />}
          {project.targetPopulation && <Field label="Población meta" value={project.targetPopulation} />}
          {project.teamMembers && <Field label="Equipo" value={project.teamMembers} />}
          {project.adminNotes && <Field label="Notas administrativas" value={project.adminNotes} />}
        </div>
      </div>

      {project.activities.length > 0 && (
        <div className="detail-card">
          <div className="form-section-title" style={{ marginTop: 0 }}>Actividades del proyecto</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Actividad</th><th>Fecha estimada</th><th>Responsable</th><th>Estado</th><th></th></tr>
              </thead>
              <tbody>
                {project.activities.map((a) => (
                  <tr key={a.id}>
                    <td>{a.activityName}</td>
                    <td>{a.estimatedDate ? formatDate(a.estimatedDate) : '—'}</td>
                    <td>{a.responsible || '—'}</td>
                    <td><StatusBadge value={a.isCompleted} trueLabel="Completada" falseLabel="Pendiente" /></td>
                    <td>
                      {!a.isCompleted && (
                        <button className="btn-secondary btn-sm" onClick={() => completeActivity(a.id)}>
                          ✅ Completar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {project.budgetItems.length > 0 && (
        <div className="detail-card">
          <div className="form-section-title" style={{ marginTop: 0 }}>Presupuesto</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Concepto</th><th>Monto estimado</th><th>Fuente</th></tr>
              </thead>
              <tbody>
                {project.budgetItems.map((b) => (
                  <tr key={b.id}>
                    <td>{b.concept}</td>
                    <td>{fmt(b.estimatedAmount)}</td>
                    <td>{b.fundingSource || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmDialog onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} loading={deleting} />
      )}
    </div>
  );
}
