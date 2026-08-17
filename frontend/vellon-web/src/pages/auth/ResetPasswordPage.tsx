import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import logo from '../../assets/ovejitas/logo.jpg';
import '../../styles/public.css';
import '../../styles/auth.css';

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    setError('');
    try {
      await authService.resetPassword({ token, newPassword: data.newPassword, confirmPassword: data.confirmPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch {
      setError('Este enlace no es válido o ha expirado.');
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-message error">El enlace de recuperación no es válido.</div>
          <Link to="/login" className="auth-link">← Volver al inicio de sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="Fundación Ovejitas" />
          <h1>Nueva contraseña</h1>
          <p>Ingresá tu nueva contraseña</p>
        </div>

        {success ? (
          <div className="auth-message success">
            ¡Tu contraseña fue actualizada con éxito! Redirigiendo al inicio de sesión...
          </div>
        ) : (
          <>
            {error && <div className="auth-message error">{error}</div>}
            <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  {...register('newPassword', {
                    required: 'La contraseña es requerida.',
                    minLength: { value: 8, message: 'Mínimo 8 caracteres.' },
                    pattern: { value: /\d/, message: 'Debe incluir al menos un número.' },
                  })}
                />
                {errors.newPassword && <p className="form-error">{errors.newPassword.message}</p>}
              </div>

              <div className="form-group">
                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirmá la contraseña.',
                    validate: (v) => v === watch('newPassword') || 'Las contraseñas no coinciden.',
                  })}
                />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" className="auth-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
            </form>
          </>
        )}

        <Link to="/login" className="auth-link">← Volver al inicio de sesión</Link>
      </div>
    </div>
  );
}
