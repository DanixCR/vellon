import { useState } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../../assets/ovejitas/logo.jpg';
import DonationInfo from '../../components/public/DonationInfo';
import { contactService } from '../../services/contactService';
import { formatPhoneCR } from '../../utils/maskUtils';
import '../../styles/public.css';

interface FormValues {
  fullName: string;
  phone: string;
  email: string;
  type: string;
  message: string;
}

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onSubmit = async (data: FormValues) => {
    setStatus('idle');
    try {
      await contactService.create({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || undefined,
        message: data.message || undefined,
        type: Number(data.type),
      });
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="public-main container" style={{ position: 'relative' }}>
      <header style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <h1 className="section-title">¡Hablemos!</h1>
        <p className="section-subtitle">
          Estamos aquí para escucharte. Ya sea que quieras ser voluntario, hacer una donación o simplemente
          saludarnos, llena el formulario y te responderemos pronto con una sonrisa.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--gutter)', width: '100%' }} className="contact-grid">
        <div className="card card--border-primary" style={{ gridColumn: 'span 1' }}>
          {status === 'success' && (
            <div className="form-message success" style={{ marginBottom: 'var(--space-md)' }}>
              ¡Gracias! Tu información fue registrada. Nos pondremos en contacto contigo pronto.
            </div>
          )}
          {status === 'error' && (
            <div className="form-message error" style={{ marginBottom: 'var(--space-md)' }}>
              Ocurrió un error al enviar tu información. Por favor intentá de nuevo.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="form-row form-row--2">
              <div className="form-field">
                <label htmlFor="fullName">Nombre completo</label>
                <div className="input-icon-field">
                  <span className="material-symbols-outlined">person</span>
                  <input
                    id="fullName"
                    className="pill-input"
                    placeholder="Ej. María Pérez"
                    {...register('fullName', { required: 'El nombre es requerido.' })}
                  />
                </div>
                {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="phone">Teléfono</label>
                <div className="input-icon-field">
                  <span className="material-symbols-outlined">call</span>
                  <input id="phone" type="tel" className="pill-input" placeholder="Ej. 8888-8888" maxLength={9} {...register('phone', {
                    onChange: (e) => { e.target.value = formatPhoneCR(e.target.value); },
                  })} />
                </div>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="email">Correo electrónico</label>
              <div className="input-icon-field">
                <span className="material-symbols-outlined">mail</span>
                <input
                  id="email"
                  type="email"
                  className="pill-input"
                  placeholder="correo@ejemplo.com"
                  {...register('email', {
                    required: 'El correo es requerido.',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Correo no válido.' },
                  })}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="type">Tipo de contacto</label>
              <select
                id="type"
                className="pill-select"
                defaultValue=""
                {...register('type', { required: 'Seleccioná un tipo de contacto.' })}
              >
                <option value="" disabled>Selecciona una opción</option>
                <option value="0">Donante</option>
                <option value="1">Voluntario</option>
                <option value="2">Información</option>
              </select>
              {errors.type && <p className="form-error">{errors.type.message}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="message">Tu mensaje</label>
              <textarea
                id="message"
                className="pill-textarea"
                rows={4}
                placeholder="¿En qué te podemos ayudar?"
                {...register('message')}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>
              {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
          <div className="card card--border-tertiary" style={{ textAlign: 'center' }}>
            <img src={logo} alt="Fundación Ovejitas" style={{ width: 96, height: 96, margin: '0 auto var(--space-md)', display: 'block', borderRadius: '50%' }} />
            <h2 className="fieldset-title" style={{ fontSize: 24, marginBottom: 'var(--space-md)' }}>Información de Contacto</h2>
            <div className="info-list" style={{ textAlign: 'left' }}>
              <div className="info-item">
                <div className="icon-circle" style={{ width: 40, height: 40, margin: 0, background: 'var(--color-secondary-container)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>location_on</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700 }}>Dirección</h3>
                  <p className="section-subtitle" style={{ fontSize: 15 }}>San José, Costa Rica</p>
                </div>
              </div>
              <div className="info-item">
                <div className="icon-circle" style={{ width: 40, height: 40, margin: 0, background: 'var(--color-secondary-container)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>mail</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700 }}>Email</h3>
                  <p className="section-subtitle" style={{ fontSize: 15 }}>fundacionovejitas@gmail.com</p>
                </div>
              </div>
              <div className="info-item">
                <div className="icon-circle" style={{ width: 40, height: 40, margin: 0, background: 'var(--color-secondary-container)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>phone</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700 }}>Teléfono</h3>
                  <p className="section-subtitle" style={{ fontSize: 15 }}>6480-1020</p>
                </div>
              </div>
            </div>
          </div>

          <DonationInfo border="secondary" />
        </div>
      </div>
    </main>
  );
}
