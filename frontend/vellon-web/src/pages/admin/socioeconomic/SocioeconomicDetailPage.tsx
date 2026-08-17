import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { socioeconomicService, type SocioeconomicDetail } from '../../../services/socioeconomicService';

const fmt = (n?: number | null) =>
  n != null ? new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(n) : '—';

export default function SocioeconomicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [study, setStudy] = useState<SocioeconomicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    socioeconomicService.getById(Number(id))
      .then(setStudy)
      .catch(() => navigate('/admin/socioeconomic'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await socioeconomicService.delete(Number(id));
      navigate('/admin/socioeconomic');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="loading-text">Cargando...</div>;
  if (!study) return null;

  const Field = ({ label, value }: { label: string; value?: string | number | boolean | null }) => (
    <div className="detail-field">
      <label>{label}</label>
      <p>{value === true ? 'Sí' : value === false ? 'No' : (value ?? '—')}</p>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1>Estudio Socioeconómico #{study.id}</h1>
        <div className="action-row">
          <button className="btn-secondary" onClick={() => navigate(`/admin/socioeconomic/${study.id}/edit`)}>Editar</button>
          <button className="btn-danger" onClick={() => setShowConfirm(true)}>Eliminar</button>
          <button className="btn-secondary" onClick={() => navigate('/admin/socioeconomic')}>← Volver</button>
        </div>
      </div>

      <div className="detail-card">
        <div className="form-section-title">Ingresos</div>
        <div className="detail-grid">
          <Field label="Pensión alimentaria" value={fmt(study.alimonyAmount)} />
          <Field label="Detalles pensión" value={study.alimonyDetails} />
          <Field label="¿Pensión voluntaria?" value={study.isAlimonyVoluntary} />
          <Field label="Subsidio IMAS" value={fmt(study.imasSubsidy)} />
          <Field label="Programa IMAS" value={study.imasSubsidyProgram} />
          <Field label="Ayuda otra institución" value={fmt(study.otherInstitutionAid)} />
          <Field label="Otros ingresos" value={fmt(study.otherIncome)} />
          <Field label="Detalle otros ingresos" value={study.otherIncomeDetails} />
        </div>

        <div className="form-section-title">Gastos</div>
        <div className="detail-grid">
          <Field label="Alimentación" value={fmt(study.foodExpense)} />
          <Field label="Educación" value={fmt(study.educationExpense)} />
          <Field label="Servicios" value={fmt(study.servicesExpense)} />
          <Field label="Medicamentos" value={fmt(study.medicineExpense)} />
          <Field label="Alquiler" value={fmt(study.rentExpense)} />
          <Field label="Cable/Internet" value={fmt(study.cableExpense)} />
          <Field label="Deudas" value={fmt(study.debtExpense)} />
          <Field label="Otros gastos" value={fmt(study.otherExpenses)} />
        </div>

        <div className="form-section-title">Finanzas</div>
        <div className="detail-grid">
          <Field label="Tiene tarjeta de crédito" value={study.hasCreditCard} />
          {study.hasCreditCard && <Field label="Banco TC" value={study.creditCardBank} />}
          {study.hasCreditCard && <Field label="Deuda TC" value={fmt(study.creditCardDebt)} />}
          <Field label="Tiene ahorros" value={study.hasSavings} />
          {study.hasSavings && <Field label="Banco ahorros" value={study.savingsBank} />}
          {study.hasSavings && <Field label="Monto ahorros" value={fmt(study.savingsAmount)} />}
        </div>

        <div className="form-section-title">Vivienda</div>
        <div className="detail-grid">
          <Field label="Tipo de vivienda" value={study.housingType} />
          <Field label="Propietario" value={study.housingOwnerName} />
          <Field label="Cédula propietario" value={study.housingOwnerIdNumber} />
          <Field label="Alquiler al día" value={study.rentIsUpToDate} />
          <Field label="Estado deuda vivienda" value={study.housingDebtStatus} />
        </div>
      </div>

      {study.familyMembers.length > 0 && (
        <div className="detail-card">
          <div className="form-section-title">Miembros de la familia</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th><th>Edad</th><th>Ocupación</th><th>Ingreso mensual</th><th>Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {study.familyMembers.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.age}</td>
                    <td>{m.occupation || '—'}</td>
                    <td>{fmt(m.monthlyIncome)}</td>
                    <td>{m.phone || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {study.householdItems.length > 0 && (
        <div className="detail-card">
          <div className="form-section-title">Enseres del hogar</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Artículo</th><th>Cantidad</th><th>Estado</th><th>Adquisición</th><th>Deuda pendiente</th>
                </tr>
              </thead>
              <tbody>
                {study.householdItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.itemName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.condition || '—'}</td>
                    <td>{item.acquisitionType || '—'}</td>
                    <td>{item.hasPendingPayments ? 'Sí' : 'No'}</td>
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
