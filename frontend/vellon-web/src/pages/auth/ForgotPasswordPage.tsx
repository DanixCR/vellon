import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import logo from '../../assets/ovejitas/logo.jpg';
import '../../styles/public.css';
import '../../styles/auth.css';

interface FormValues { email: string; }

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data: FormValues) => {
    await authService.forgotPassword(data.email);
    setSent(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="Fundación Ovejitas" />
          <h1>Recuperar contraseña</h1>
          <p>Ingresá tu correo electrónico</p>
        </div>

        {sent ? (
          <div className="auth-message success">
            Si el correo existe en el sistema, recibirás un enlace para restablecer tu contraseña.
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                {...register('email', {
                  required: 'El correo es requerido.',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Correo no válido.' },
                })}
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}

        <Link to="/login" className="auth-link">← Volver al inicio de sesión</Link>
      </div>
    </div>
  );
}
