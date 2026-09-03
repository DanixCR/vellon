import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  socioeconomicService,
  type CreateSocioeconomicInput,
  type FamilyMemberInput,
  type HouseholdItemInput,
} from '../../../services/socioeconomicService';

const emptyMember = (): FamilyMemberInput => ({
  name: '', age: 0, occupation: '', employmentType: '', monthlyIncome: undefined, workplace: '', phone: '',
});

const emptyItem = (): HouseholdItemInput => ({
  itemName: '', quantity: 1, condition: '', acquisitionType: '', hasPendingPayments: false,
});

const HOUSEHOLD_ITEMS = [
  'Cocina', 'Refrigeradora', 'Televisores', 'Microondas', 'Equipo de sonido', 'DVD',
  'Consola de videojuegos', 'Camas', 'Muebles', 'Computador', 'Teléfono fijo', 'Teléfono celular', 'Otros',
];

const defaultForm = (): CreateSocioeconomicInput => ({
  isAlimonyVoluntary: false,
  hasCreditCard: false,
  hasSavings: false,
  housingType: 'Propia',
  familyMembers: [],
  householdItems: [],
});

export default function SocioeconomicFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateSocioeconomicInput>(defaultForm());
  const [members, setMembers] = useState<FamilyMemberInput[]>([]);
  const [items, setItems] = useState<HouseholdItemInput[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    socioeconomicService.getById(Number(id)).then((s) => {
      setForm({
        alimonyAmount: s.alimonyAmount ?? undefined,
        alimonyDetails: s.alimonyDetails ?? '',
        isAlimonyVoluntary: s.isAlimonyVoluntary,
        imasSubsidy: s.imasSubsidy ?? undefined,
        imasSubsidyProgram: s.imasSubsidyProgram ?? '',
        otherInstitutionAid: s.otherInstitutionAid ?? undefined,
        otherInstitutionAidDetails: s.otherInstitutionAidDetails ?? '',
        otherIncome: s.otherIncome ?? undefined,
        otherIncomeDetails: s.otherIncomeDetails ?? '',
        foodExpense: s.foodExpense ?? undefined,
        educationExpense: s.educationExpense ?? undefined,
        servicesExpense: s.servicesExpense ?? undefined,
        medicineExpense: s.medicineExpense ?? undefined,
        rentExpense: s.rentExpense ?? undefined,
        cableExpense: s.cableExpense ?? undefined,
        debtExpense: s.debtExpense ?? undefined,
        otherExpenses: s.otherExpenses ?? undefined,
        otherExpensesDetails: s.otherExpensesDetails ?? '',
        hasCreditCard: s.hasCreditCard,
        creditCardBank: s.creditCardBank ?? '',
        creditCardDebt: s.creditCardDebt ?? undefined,
        hasSavings: s.hasSavings,
        savingsBank: s.savingsBank ?? '',
        savingsAmount: s.savingsAmount ?? undefined,
        housingType: s.housingType,
        housingOwnerName: s.housingOwnerName ?? '',
        housingOwnerIdNumber: s.housingOwnerIdNumber ?? '',
        rentIsUpToDate: s.rentIsUpToDate ?? undefined,
        housingDebtStatus: s.housingDebtStatus ?? '',
        familyMembers: [],
        householdItems: [],
      });
      setMembers(s.familyMembers.map((m) => ({
        name: m.name, age: m.age, occupation: m.occupation ?? '', employmentType: m.employmentType ?? '',
        monthlyIncome: m.monthlyIncome ?? undefined, workplace: m.workplace ?? '', phone: m.phone ?? '',
      })));
      setItems(s.householdItems.map((i) => ({
        itemName: i.itemName, quantity: i.quantity, condition: i.condition ?? '',
        acquisitionType: i.acquisitionType ?? '', hasPendingPayments: i.hasPendingPayments,
      })));
    });
  }, [id, isEdit]);

  const set = (field: keyof CreateSocioeconomicInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateMember = (i: number, field: keyof FamilyMemberInput, value: unknown) =>
    setMembers((prev) => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m));

  const updateItem = (i: number, field: keyof HouseholdItemInput, value: unknown) =>
    setItems((prev) => prev.map((it, idx) => idx === i ? { ...it, [field]: value } : it));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, familyMembers: members, householdItems: items };
      if (isEdit) {
        await socioeconomicService.update(Number(id), payload);
      } else {
        await socioeconomicService.create(payload);
      }
      navigate('/admin/socioeconomic');
    } catch {
      setError('Ocurrió un error al guardar el estudio. Revisá los campos e intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const numField = (label: string, field: keyof CreateSocioeconomicInput) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="number" step="0.01" min="0"
        value={(form[field] as number | undefined) ?? ''}
        onChange={(e) => set(field, e.target.value ? parseFloat(e.target.value) : undefined)}
      />
    </div>
  );

  const txtField = (label: string, field: keyof CreateSocioeconomicInput) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="text"
        value={(form[field] as string | undefined) ?? ''}
        onChange={(e) => set(field, e.target.value)}
      />
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Editar estudio socioeconómico' : 'Nuevo estudio socioeconómico'}</h1>
        <button className="btn-secondary" onClick={() => navigate('/admin/socioeconomic')}>← Volver</button>
      </div>

      {error && <div className="error-text">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="form-section-title">Ingresos</div>
          <div className="form-row">
            {numField('Pensión alimentaria', 'alimonyAmount')}
            {txtField('Detalles pensión', 'alimonyDetails')}
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.isAlimonyVoluntary}
                onChange={(e) => set('isAlimonyVoluntary', e.target.checked)} />
              ¿Pensión voluntaria?
            </label>
          </div>
          <div className="form-row">
            {numField('Subsidio IMAS', 'imasSubsidy')}
            {txtField('Programa IMAS', 'imasSubsidyProgram')}
          </div>
          <div className="form-row">
            {numField('Ayuda otra institución', 'otherInstitutionAid')}
            {txtField('Detalles', 'otherInstitutionAidDetails')}
          </div>
          <div className="form-row">
            {numField('Otros ingresos', 'otherIncome')}
            {txtField('Detalle otros ingresos', 'otherIncomeDetails')}
          </div>

          <div className="form-section-title">Gastos</div>
          <div className="form-row">
            {numField('Alimentación', 'foodExpense')}
            {numField('Educación', 'educationExpense')}
          </div>
          <div className="form-row">
            {numField('Servicios', 'servicesExpense')}
            {numField('Medicamentos', 'medicineExpense')}
          </div>
          <div className="form-row">
            {numField('Alquiler', 'rentExpense')}
            {numField('Cable/Internet', 'cableExpense')}
          </div>
          <div className="form-row">
            {numField('Deudas', 'debtExpense')}
            {numField('Otros gastos', 'otherExpenses')}
          </div>
          {txtField('Detalle otros gastos', 'otherExpensesDetails')}
          <div className="form-group">
            <label>Total de gastos</label>
            <p style={{ marginTop: 8, fontWeight: 700 }}>
              {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(
                (form.foodExpense ?? 0) + (form.educationExpense ?? 0) + (form.servicesExpense ?? 0) +
                (form.medicineExpense ?? 0) + (form.rentExpense ?? 0) + (form.cableExpense ?? 0) +
                (form.debtExpense ?? 0) + (form.otherExpenses ?? 0)
              )}
            </p>
          </div>

          <div className="form-section-title">Finanzas</div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.hasCreditCard}
                onChange={(e) => set('hasCreditCard', e.target.checked)} />
              ¿Tiene tarjeta de crédito?
            </label>
          </div>
          {form.hasCreditCard && (
            <div className="form-row">
              {txtField('Banco TC', 'creditCardBank')}
              {numField('Deuda TC', 'creditCardDebt')}
            </div>
          )}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.hasSavings}
                onChange={(e) => set('hasSavings', e.target.checked)} />
              ¿Tiene ahorros?
            </label>
          </div>
          {form.hasSavings && (
            <div className="form-row">
              {txtField('Banco ahorros', 'savingsBank')}
              {numField('Monto ahorros', 'savingsAmount')}
            </div>
          )}

          <div className="form-section-title">Vivienda</div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo de vivienda *</label>
              <select value={form.housingType} onChange={(e) => set('housingType', e.target.value)} required>
                <option value="Propia">Propia</option>
                <option value="Alquilada">Alquilada</option>
                <option value="Prestada">Prestada</option>
                <option value="PropiaEnLotePrestado">Propia en lote prestado</option>
              </select>
            </div>
            {txtField('Nombre del propietario', 'housingOwnerName')}
          </div>
          <div className="form-row">
            {txtField('Cédula del propietario', 'housingOwnerIdNumber')}
            <div className="form-group">
              <label>Estado deuda vivienda</label>
              <select value={form.housingDebtStatus ?? ''}
                onChange={(e) => set('housingDebtStatus', e.target.value || undefined)}>
                <option value="">— Sin deuda —</option>
                <option value="TotalmentePagada">Totalmente pagada</option>
                <option value="ConDeudaAlDia">Con deuda al día</option>
                <option value="ConDeudaAtrasada">Con deuda atrasada</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.rentIsUpToDate ?? false}
                onChange={(e) => set('rentIsUpToDate', e.target.checked)} />
              ¿Alquiler/cuota al día?
            </label>
          </div>
        </div>

        {/* Miembros de la familia */}
        <div className="form-card" style={{ marginTop: 20 }}>
          <div className="form-section-title" style={{ marginTop: 0 }}>Miembros de la familia</div>
          {members.map((m, i) => (
            <div key={i} className="dynamic-list-row">
              <div className="form-group"><label>Nombre</label>
                <input value={m.name} onChange={(e) => updateMember(i, 'name', e.target.value)} required />
              </div>
              <div className="form-group"><label>Edad</label>
                <input type="number" min={0} value={m.age}
                  onChange={(e) => updateMember(i, 'age', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group"><label>Ocupación</label>
                <input value={m.occupation ?? ''} onChange={(e) => updateMember(i, 'occupation', e.target.value)} />
              </div>
              <div className="form-group"><label>Ingreso mensual</label>
                <input type="number" step="0.01" min={0} value={m.monthlyIncome ?? ''}
                  onChange={(e) => updateMember(i, 'monthlyIncome', e.target.value ? parseFloat(e.target.value) : undefined)} />
              </div>
              <div className="form-group"><label>Teléfono</label>
                <input value={m.phone ?? ''} onChange={(e) => updateMember(i, 'phone', e.target.value)} />
              </div>
              <button type="button" className="btn-remove-row"
                onClick={() => setMembers((prev) => prev.filter((_, idx) => idx !== i))}>✕</button>
            </div>
          ))}
          <button type="button" className="btn-add-row"
            onClick={() => setMembers((prev) => [...prev, emptyMember()])}>
            + Agregar miembro
          </button>
        </div>

        {/* Enseres del hogar */}
        <div className="form-card" style={{ marginTop: 20 }}>
          <div className="form-section-title" style={{ marginTop: 0 }}>Enseres del hogar</div>
          {items.map((item, i) => (
            <div key={i} className="dynamic-list-row">
              <div className="form-group"><label>Artículo</label>
                <select value={item.itemName} onChange={(e) => updateItem(i, 'itemName', e.target.value)} required>
                  <option value="" disabled>Seleccioná un artículo</option>
                  {HOUSEHOLD_ITEMS.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group"><label>Cantidad</label>
                <input type="number" min={1} value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value) || 1)} />
              </div>
              <div className="form-group"><label>Estado</label>
                <input value={item.condition ?? ''} onChange={(e) => updateItem(i, 'condition', e.target.value)} />
              </div>
              <div className="form-group"><label>Adquisición</label>
                <input value={item.acquisitionType ?? ''} onChange={(e) => updateItem(i, 'acquisitionType', e.target.value)} />
              </div>
              <div className="form-group"><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={item.hasPendingPayments}
                  onChange={(e) => updateItem(i, 'hasPendingPayments', e.target.checked)} />
                Con deuda
              </label></div>
              <button type="button" className="btn-remove-row"
                onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}>✕</button>
            </div>
          ))}
          <button type="button" className="btn-add-row"
            onClick={() => setItems((prev) => [...prev, emptyItem()])}>
            + Agregar enser
          </button>
        </div>

        <div className="form-actions" style={{ marginTop: 20 }}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear estudio'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/admin/socioeconomic')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
