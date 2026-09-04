import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  projectService,
  type CreateProjectInput,
  type ProjectActivityInput,
  type ProjectBudgetItemInput,
} from '../../../services/projectService';
import { formatDateTime } from '../../../utils/dateUtils';
import { formatPhoneCR } from '../../../utils/maskUtils';

const emptyActivity = (): ProjectActivityInput => ({ activityName: '', estimatedDate: '', responsible: '' });
const emptyBudget = (): ProjectBudgetItemInput => ({ concept: '', estimatedAmount: 0, fundingSource: '' });

const defaultForm = (): CreateProjectInput => ({
  name: '', description: '', projectType: '', startDate: '', estimatedEndDate: '',
  duration: '', activityFrequency: '', mainObjective: '', specificObjectives: '',
  targetPopulation: '', estimatedBeneficiaries: undefined, geographicLocation: '',
  selectionCriteria: '', priorityPopulation: '', totalBudget: undefined,
  hasFunding: false, fundingSource: '', additionalResources: '',
  responsibleName: '', responsibleRole: '', responsiblePhone: '', responsibleEmail: '',
  teamMembers: '', adminNotes: '', activities: [], budgetItems: [],
});

export default function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateProjectInput>(defaultForm());
  const [activities, setActivities] = useState<ProjectActivityInput[]>([]);
  const [budgetItems, setBudgetItems] = useState<ProjectBudgetItemInput[]>([]);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [status, setStatus] = useState('Planificado');
  const [originalStatus, setOriginalStatus] = useState('Planificado');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    projectService.getById(Number(id)).then((p) => {
      setForm({
        name: p.name, description: p.description, projectType: p.projectType,
        startDate: p.startDate.split('T')[0],
        estimatedEndDate: p.estimatedEndDate ? p.estimatedEndDate.split('T')[0] : '',
        duration: p.duration ?? '', activityFrequency: '', mainObjective: p.mainObjective,
        specificObjectives: p.specificObjectives ?? '', targetPopulation: p.targetPopulation ?? '',
        estimatedBeneficiaries: p.estimatedBeneficiaries ?? undefined,
        geographicLocation: p.geographicLocation ?? '', selectionCriteria: '', priorityPopulation: '',
        totalBudget: p.totalBudget ?? undefined, hasFunding: p.hasFunding,
        fundingSource: p.fundingSource ?? '', additionalResources: '',
        responsibleName: p.responsibleName, responsibleRole: p.responsibleRole ?? '',
        responsiblePhone: p.responsiblePhone ?? '', responsibleEmail: p.responsibleEmail ?? '',
        teamMembers: p.teamMembers ?? '', adminNotes: p.adminNotes ?? '',
        activities: [], budgetItems: [],
      });
      setActivities(p.activities.map((a) => ({
        activityName: a.activityName,
        estimatedDate: a.estimatedDate ? a.estimatedDate.split('T')[0] : '',
        responsible: a.responsible ?? '',
      })));
      setBudgetItems(p.budgetItems.map((b) => ({
        concept: b.concept, estimatedAmount: b.estimatedAmount, fundingSource: b.fundingSource ?? '',
      })));
      setCreatedAt(p.createdAt);
      setStatus(p.status);
      setOriginalStatus(p.status);
    });
  }, [id, isEdit]);

  const set = (field: keyof CreateProjectInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateActivity = (i: number, f: keyof ProjectActivityInput, v: string) =>
    setActivities((prev) => prev.map((a, idx) => idx === i ? { ...a, [f]: v } : a));

  const updateBudget = (i: number, f: keyof ProjectBudgetItemInput, v: string | number) =>
    setBudgetItems((prev) => prev.map((b, idx) => idx === i ? { ...b, [f]: v } : b));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, activities, budgetItems };
      if (isEdit) {
        await projectService.update(Number(id), payload);
        if (status !== originalStatus) {
          await projectService.updateStatus(Number(id), status);
        }
      } else {
        await projectService.create(payload);
      }
      navigate('/admin/projects');
    } catch {
      setError('Error al guardar el proyecto. Revisá los campos requeridos.');
    } finally {
      setSaving(false);
    }
  };

  const txt = (label: string, field: keyof CreateProjectInput, required = false) => (
    <div className="form-group">
      <label>{label}{required ? ' *' : ''}</label>
      <input
        value={(form[field] as string | undefined) ?? ''}
        onChange={(e) => set(field, e.target.value)}
        required={required}
      />
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Editar proyecto' : 'Nuevo proyecto'}</h1>
        <button className="btn-secondary" onClick={() => navigate('/admin/projects')}>← Volver</button>
      </div>

      {error && <div className="error-text">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="form-section-title" style={{ marginTop: 0 }}>Información general</div>
          {txt('Nombre del proyecto', 'name', true)}
          <div className="form-group">
            <label>Descripción *</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} required rows={3} />
          </div>
          <div className="form-row">
            {txt('Tipo de proyecto', 'projectType', true)}
            <div className="form-group">
              <label>Fecha de inicio *</label>
              <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fecha estimada de fin</label>
              <input type="date" value={form.estimatedEndDate ?? ''} onChange={(e) => set('estimatedEndDate', e.target.value)} />
            </div>
            {txt('Duración', 'duration')}
          </div>
          {txt('Frecuencia de actividades', 'activityFrequency')}
          <div className="form-row">
            <div className="form-group">
              <label>Fecha de registro</label>
              <p style={{ marginTop: 8 }}>
                {createdAt ? formatDateTime(createdAt) : 'Se genera al guardar'}
              </p>
            </div>
            <div className="form-group">
              <label>Estado del proyecto</label>
              {isEdit ? (
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Planificado">Planificado</option>
                  <option value="EnCurso">En curso</option>
                  <option value="Completado">Completado</option>
                  <option value="Suspendido">Suspendido</option>
                </select>
              ) : (
                <p style={{ marginTop: 8 }}>Planificado</p>
              )}
            </div>
          </div>

          <div className="form-section-title">Objetivos y población</div>
          <div className="form-group">
            <label>Objetivo principal *</label>
            <textarea value={form.mainObjective} onChange={(e) => set('mainObjective', e.target.value)} required rows={3} />
          </div>
          <div className="form-group">
            <label>Objetivos específicos</label>
            <textarea value={form.specificObjectives ?? ''} onChange={(e) => set('specificObjectives', e.target.value)} rows={3} />
          </div>
          {txt('Población meta', 'targetPopulation')}
          <div className="form-row">
            <div className="form-group">
              <label>Beneficiarios estimados</label>
              <input type="number" min={0} value={form.estimatedBeneficiaries ?? ''}
                onChange={(e) => set('estimatedBeneficiaries', e.target.value ? parseInt(e.target.value) : undefined)} />
            </div>
            {txt('Ubicación geográfica', 'geographicLocation')}
          </div>
          {txt('Criterios de selección', 'selectionCriteria')}
          {txt('Población prioritaria', 'priorityPopulation')}

          <div className="form-section-title">Presupuesto y financiamiento</div>
          <div className="form-row">
            <div className="form-group">
              <label>Presupuesto total</label>
              <input type="number" step="0.01" min={0} value={form.totalBudget ?? ''}
                onChange={(e) => set('totalBudget', e.target.value ? parseFloat(e.target.value) : undefined)} />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
                <input type="checkbox" checked={form.hasFunding} onChange={(e) => set('hasFunding', e.target.checked)} />
                ¿Tiene financiamiento?
              </label>
            </div>
          </div>
          {form.hasFunding && txt('Fuente de financiamiento', 'fundingSource')}
          {txt('Recursos adicionales', 'additionalResources')}

          <div className="form-section-title">Responsable</div>
          <div className="form-row">
            {txt('Nombre responsable', 'responsibleName', true)}
            {txt('Rol', 'responsibleRole')}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Teléfono responsable</label>
              <input
                value={form.responsiblePhone ?? ''}
                maxLength={9}
                onChange={(e) => set('responsiblePhone', formatPhoneCR(e.target.value))}
              />
            </div>
            {txt('Email responsable', 'responsibleEmail')}
          </div>
          {txt('Equipo de trabajo', 'teamMembers')}
          <div className="form-group">
            <label>Notas administrativas</label>
            <textarea value={form.adminNotes ?? ''} onChange={(e) => set('adminNotes', e.target.value)} rows={3} />
          </div>
        </div>

        {/* Actividades del proyecto */}
        <div className="form-card" style={{ marginTop: 20 }}>
          <div className="form-section-title" style={{ marginTop: 0 }}>Actividades del proyecto</div>
          {activities.map((a, i) => (
            <div key={i} className="dynamic-list-row">
              <div className="form-group"><label>Nombre de actividad</label>
                <input value={a.activityName} onChange={(e) => updateActivity(i, 'activityName', e.target.value)} required />
              </div>
              <div className="form-group"><label>Fecha estimada</label>
                <input type="date" value={a.estimatedDate ?? ''} onChange={(e) => updateActivity(i, 'estimatedDate', e.target.value)} />
              </div>
              <div className="form-group"><label>Responsable</label>
                <input value={a.responsible ?? ''} onChange={(e) => updateActivity(i, 'responsible', e.target.value)} />
              </div>
              <button type="button" className="btn-remove-row"
                onClick={() => setActivities((prev) => prev.filter((_, idx) => idx !== i))}>✕</button>
            </div>
          ))}
          <button type="button" className="btn-add-row"
            onClick={() => setActivities((prev) => [...prev, emptyActivity()])}>
            + Agregar actividad
          </button>
        </div>

        {/* Ítems de presupuesto */}
        <div className="form-card" style={{ marginTop: 20 }}>
          <div className="form-section-title" style={{ marginTop: 0 }}>Ítems de presupuesto</div>
          {budgetItems.map((b, i) => (
            <div key={i} className="dynamic-list-row">
              <div className="form-group"><label>Concepto</label>
                <input value={b.concept} onChange={(e) => updateBudget(i, 'concept', e.target.value)} required />
              </div>
              <div className="form-group"><label>Monto estimado</label>
                <input type="number" step="0.01" min={0} value={b.estimatedAmount}
                  onChange={(e) => updateBudget(i, 'estimatedAmount', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="form-group"><label>Fuente</label>
                <input value={b.fundingSource ?? ''} onChange={(e) => updateBudget(i, 'fundingSource', e.target.value)} />
              </div>
              <button type="button" className="btn-remove-row"
                onClick={() => setBudgetItems((prev) => prev.filter((_, idx) => idx !== i))}>✕</button>
            </div>
          ))}
          <button type="button" className="btn-add-row"
            onClick={() => setBudgetItems((prev) => [...prev, emptyBudget()])}>
            + Agregar ítem
          </button>
        </div>

        <div className="form-actions" style={{ marginTop: 20 }}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear proyecto'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/admin/projects')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
