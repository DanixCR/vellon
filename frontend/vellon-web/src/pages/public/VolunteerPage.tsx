import { useState } from 'react';
import { useForm } from 'react-hook-form';
import poster from '../../assets/ovejitas/volunteer-poster.jpg';
import { volunteerService } from '../../services/volunteerService';
import '../../styles/public.css';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const SKILLS = [
  'Educación', 'Salud', 'Logística', 'Apoyo en Eventos',
  'Arte/Música', 'Deportes/Recreación', 'Cocina/Nutrición', 'Carpintería/Manualidades',
  'Comunicación/Redes sociales', 'Informática/Tecnología', 'Psicología/Trabajo social', 'Idiomas',
  'Otro',
];
const INTEREST_AREAS = [
  'Atención directa', 'Educación y Talleres', 'Logística y Operaciones', 'Apoyo en Eventos', 'Acompañamiento en Salud',
  'Recolección de donaciones', 'Apoyo psicosocial', 'Logística y transporte', 'Redes sociales/comunicación',
];

function calculateAge(birthDate: string): number | undefined {
  if (!birthDate) return undefined;
  const hoy = new Date();
  const nacimiento = new Date(birthDate);
  if (Number.isNaN(nacimiento.getTime())) return undefined;

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumpleEsteAno =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (aunNoCumpleEsteAno) edad--;

  return edad >= 0 ? edad : undefined;
}

interface FormValues {
  fullName: string;
  idNumber: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  currentOccupation: string;
  availableDays: string[];
  availableSchedule: string;
  weeklyHours: string;
  specialAvailability: string;
  skills: string[];
  otherSkills: string;
  previousVolunteerExperience: string;
  educationLevel: string;
  languages: string;
  interestAreas: string[];
  otherInterestArea: string;
  reference1Name: string;
  reference1Relation: string;
  reference1Phone: string;
  reference1Email: string;
  reference2Name: string;
  reference2Relation: string;
  reference2Phone: string;
  reference2Email: string;
  motivation: string;
  expectedContribution: string;
}

export default function VolunteerPage() {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const calculatedAge = calculateAge(watch('birthDate'));

  const onSubmit = async (data: FormValues) => {
    setStatus('idle');
    try {
      await volunteerService.create({
        fullName: data.fullName,
        idNumber: data.idNumber,
        birthDate: data.birthDate,
        age: calculateAge(data.birthDate),
        phone: data.phone,
        email: data.email,
        address: data.address || undefined,
        currentOccupation: data.currentOccupation || undefined,
        availableDays: data.availableDays?.length ? JSON.stringify(data.availableDays) : undefined,
        availableSchedule: data.availableSchedule || undefined,
        weeklyHours: data.weeklyHours ? Number(data.weeklyHours) : undefined,
        specialAvailability: data.specialAvailability || undefined,
        skills: data.skills?.length ? JSON.stringify(data.skills) : undefined,
        otherSkills: data.otherSkills || undefined,
        previousVolunteerExperience: data.previousVolunteerExperience || undefined,
        educationLevel: data.educationLevel || undefined,
        languages: data.languages || undefined,
        interestAreas: data.interestAreas?.length ? JSON.stringify(data.interestAreas) : undefined,
        otherInterestArea: data.otherInterestArea || undefined,
        reference1Name: data.reference1Name || undefined,
        reference1Relation: data.reference1Relation || undefined,
        reference1Phone: data.reference1Phone || undefined,
        reference1Email: data.reference1Email || undefined,
        reference2Name: data.reference2Name || undefined,
        reference2Relation: data.reference2Relation || undefined,
        reference2Phone: data.reference2Phone || undefined,
        reference2Email: data.reference2Email || undefined,
        motivation: data.motivation || undefined,
        expectedContribution: data.expectedContribution || undefined,
      });
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="public-main container">
      <section className="hero">
        <div className="hero-content">
          <h1 className="section-title">Únete a nuestra familia.</h1>
          <p className="section-subtitle">
            Cada granito de arena cuenta. En Fundación Ovejitas, creemos en el poder de la comunidad para brindar
            esperanza y sonrisas a los niños y familias de Costa Rica. Ser voluntario es regalar un poco de tu
            tiempo para transformar una vida.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-tertiary)' }}>favorite</span>
            <span className="fieldset-title" style={{ color: 'var(--color-tertiary)', fontSize: 14 }}>Comunidad y Esperanza</span>
          </div>
        </div>
        <div className="hero-image-frame">
          <img src={poster} alt="Voluntariado Fundación Ovejitas" />
        </div>
      </section>

      <section className="card card--border-primary volunteer-form-grid">
        <div className="volunteer-info-col">
          <div>
            <h2 className="fieldset-title" style={{ fontSize: 32, color: 'var(--color-primary)' }}>Formulario de Inscripción</h2>
            <p className="section-subtitle" style={{ fontSize: 16, marginTop: 'var(--space-xs)' }}>
              Déjanos tus datos y nos pondremos en contacto contigo pronto. Apreciamos enormemente tu interés en
              ayudarnos.
            </p>
          </div>

          <div className="info-item" style={{ background: 'var(--color-surface-container-low)', boxShadow: 'none' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)' }}>volunteer_activism</span>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-secondary)' }}>Proceso guiado</h3>
              <p className="section-subtitle" style={{ fontSize: 15, marginTop: 4 }}>
                Nuestro equipo te acompañará en cada paso, desde la inscripción hasta tu primer día de voluntariado.
              </p>
            </div>
          </div>

          <div className="info-item" style={{ background: 'var(--color-surface-container-low)', boxShadow: 'none' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)' }}>school</span>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-tertiary)' }}>Capacitación</h3>
              <p className="section-subtitle" style={{ fontSize: 15, marginTop: 4 }}>
                Te brindaremos todas las herramientas necesarias para que puedas desempeñarte con confianza y empatía.
              </p>
            </div>
          </div>
        </div>

        <div className="volunteer-form-col">
          {status === 'success' && (
            <div className="form-message success">
              ¡Gracias por tu interés en ser voluntario! Nos pondremos en contacto contigo pronto.
            </div>
          )}
          {status === 'error' && (
            <div className="form-message error">
              Ocurrió un error al enviar tu información. Por favor intentá de nuevo.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="fieldset" style={{ borderTop: 'none', paddingTop: 0 }}>
              <h3 className="fieldset-title">Datos personales</h3>
              <div className="form-row form-row--2">
                <div className="form-field">
                  <label htmlFor="fullName">Nombre Completo</label>
                  <input id="fullName" className="pill-input" placeholder="Ej. María Pérez" {...register('fullName', { required: 'El nombre es requerido.' })} />
                  {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="idNumber">Cédula</label>
                  <input id="idNumber" className="pill-input" placeholder="Ej. 1-2345-6789" {...register('idNumber', { required: 'La cédula es requerida.' })} />
                  {errors.idNumber && <p className="form-error">{errors.idNumber.message}</p>}
                </div>
              </div>
              <div className="form-row form-row--2">
                <div className="form-field">
                  <label htmlFor="birthDate">Fecha de nacimiento</label>
                  <input id="birthDate" type="date" className="pill-input" {...register('birthDate', { required: 'La fecha de nacimiento es requerida.' })} />
                  {errors.birthDate && <p className="form-error">{errors.birthDate.message}</p>}
                </div>
                <div className="form-field">
                  <label>Edad</label>
                  <p className="pill-input" style={{ display: 'flex', alignItems: 'center', background: 'var(--color-surface-container-low)' }}>
                    {calculatedAge !== undefined ? `Edad: ${calculatedAge} años` : 'Ingresá la fecha de nacimiento'}
                  </p>
                </div>
              </div>
              <div className="form-row form-row--2">
                <div className="form-field">
                  <label htmlFor="phone">Teléfono</label>
                  <input id="phone" type="tel" className="pill-input" placeholder="Ej. 8888-8888" {...register('phone', { required: 'El teléfono es requerido.' })} />
                  {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input id="email" type="email" className="pill-input" placeholder="ejemplo@correo.com" {...register('email', {
                    required: 'El correo es requerido.',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Correo no válido.' },
                  })} />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>
              </div>
              <div className="form-row form-row--2">
                <div className="form-field">
                  <label htmlFor="currentOccupation">Ocupación actual</label>
                  <input id="currentOccupation" className="pill-input" placeholder="Opcional" {...register('currentOccupation')} />
                </div>
                <div className="form-field">
                  <label htmlFor="address">Dirección (provincia, cantón, distrito)</label>
                  <input id="address" className="pill-input" placeholder="Opcional" {...register('address')} />
                </div>
              </div>
            </div>

            <div className="fieldset">
              <h3 className="fieldset-title">Disponibilidad</h3>
              <div className="form-field">
                <label>Días disponibles</label>
                <div className="checkbox-group">
                  {DAYS.map((day) => (
                    <label key={day} className="checkbox-pill">
                      <input type="checkbox" value={day} {...register('availableDays')} />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-row form-row--2">
                <div className="form-field">
                  <label htmlFor="availableSchedule">Horario</label>
                  <select id="availableSchedule" className="pill-select" defaultValue="" {...register('availableSchedule', { required: 'Seleccioná un horario.' })}>
                    <option value="" disabled>Selecciona un horario</option>
                    <option value="Manana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                  </select>
                  {errors.availableSchedule && <p className="form-error">{errors.availableSchedule.message}</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="weeklyHours">Horas semanales disponibles</label>
                  <input id="weeklyHours" type="number" min={0} className="pill-input" placeholder="Ej. 4" {...register('weeklyHours')} />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="specialAvailability">Disponibilidad especial</label>
                <input id="specialAvailability" className="pill-input" placeholder="Ej. solo fines de semana, feriados..." {...register('specialAvailability')} />
              </div>
            </div>

            <div className="fieldset">
              <h3 className="fieldset-title">Habilidades</h3>
              <div className="checkbox-group">
                {SKILLS.map((skill) => (
                  <label key={skill} className="checkbox-pill">
                    <input type="checkbox" value={skill} {...register('skills')} />
                    {skill}
                  </label>
                ))}
              </div>
              <div className="form-field">
                <label htmlFor="otherSkills">Otras habilidades</label>
                <input id="otherSkills" className="pill-input" placeholder="Opcional" {...register('otherSkills')} />
              </div>
              <div className="form-row form-row--2">
                <div className="form-field">
                  <label htmlFor="previousVolunteerExperience">Experiencia previa en voluntariado</label>
                  <input id="previousVolunteerExperience" className="pill-input" placeholder="Opcional" {...register('previousVolunteerExperience')} />
                </div>
                <div className="form-field">
                  <label htmlFor="educationLevel">Estudios o formación</label>
                  <input id="educationLevel" className="pill-input" placeholder="Opcional" {...register('educationLevel')} />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="languages">Idiomas adicionales</label>
                <input id="languages" className="pill-input" placeholder="Opcional" {...register('languages')} />
              </div>
            </div>

            <div className="fieldset">
              <h3 className="fieldset-title">Área de interés</h3>
              <div className="checkbox-group">
                {INTEREST_AREAS.map((area) => (
                  <label key={area} className="checkbox-pill">
                    <input type="checkbox" value={area} {...register('interestAreas')} />
                    {area}
                  </label>
                ))}
              </div>
              <div className="form-field">
                <label htmlFor="otherInterestArea">Otra área de interés</label>
                <input id="otherInterestArea" className="pill-input" placeholder="Opcional" {...register('otherInterestArea')} />
              </div>
            </div>

            <div className="fieldset">
              <h3 className="fieldset-title">Referencias personales</h3>
              <p className="section-subtitle" style={{ fontSize: 14 }}>Referencia 1</p>
              <div className="form-row form-row--2">
                <div className="form-field">
                  <label htmlFor="reference1Name">Nombre</label>
                  <input id="reference1Name" className="pill-input" {...register('reference1Name')} />
                </div>
                <div className="form-field">
                  <label htmlFor="reference1Relation">Relación</label>
                  <input id="reference1Relation" className="pill-input" {...register('reference1Relation')} />
                </div>
              </div>
              <div className="form-row form-row--2">
                <div className="form-field">
                  <label htmlFor="reference1Phone">Teléfono</label>
                  <input id="reference1Phone" type="tel" className="pill-input" {...register('reference1Phone')} />
                </div>
                <div className="form-field">
                  <label htmlFor="reference1Email">Correo</label>
                  <input id="reference1Email" type="email" className="pill-input" {...register('reference1Email')} />
                </div>
              </div>

              <p className="section-subtitle" style={{ fontSize: 14, marginTop: 'var(--space-sm)' }}>Referencia 2</p>
              <div className="form-row form-row--2">
                <div className="form-field">
                  <label htmlFor="reference2Name">Nombre</label>
                  <input id="reference2Name" className="pill-input" {...register('reference2Name')} />
                </div>
                <div className="form-field">
                  <label htmlFor="reference2Relation">Relación</label>
                  <input id="reference2Relation" className="pill-input" {...register('reference2Relation')} />
                </div>
              </div>
              <div className="form-row form-row--2">
                <div className="form-field">
                  <label htmlFor="reference2Phone">Teléfono</label>
                  <input id="reference2Phone" type="tel" className="pill-input" {...register('reference2Phone')} />
                </div>
                <div className="form-field">
                  <label htmlFor="reference2Email">Correo</label>
                  <input id="reference2Email" type="email" className="pill-input" {...register('reference2Email')} />
                </div>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="motivation">¿Por qué te gustaría unirte a Fundación Ovejitas?</label>
              <textarea id="motivation" className="pill-textarea" rows={4} placeholder="Cuéntanos un poco sobre ti y tu motivación..." {...register('motivation')} />
            </div>

            <div className="form-field">
              <label htmlFor="expectedContribution">¿Qué espera aprender o aportar?</label>
              <textarea id="expectedContribution" className="pill-textarea" rows={4} placeholder="Contanos qué te gustaría aprender o aportar como voluntario/a..." {...register('expectedContribution')} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
