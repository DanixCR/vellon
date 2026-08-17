import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import logo from '../../assets/ovejitas/logo.jpg';
import '../../styles/public.css';
import '../../styles/auth.css';

interface FormValues {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    setServerError('');
    try {
      const loginRes = await authService.login(data);
      localStorage.setItem('token', loginRes.token);
      const me = await authService.getMe();
      login(loginRes.token, {
        id: me.id,
        fullName: me.fullName,
        username: me.username,
        isSuperAdmin: me.isSuperAdmin,
      });
      navigate('/admin/dashboard');
    } catch {
      setServerError('Las credenciales ingresadas no son correctas.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="Fundación Ovejitas" />
          <h1>Fundación Ovejitas</h1>
          <p>Panel Administrativo</p>
        </div>

        {serverError && (
          <div className="auth-message error">{serverError}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              {...register('username', { required: 'El usuario es requerido.' })}
              autoComplete="username"
            />
            {errors.username && <p className="form-error">{errors.username.message}</p>}
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              {...register('password', { required: 'La contraseña es requerida.' })}
              autoComplete="current-password"
            />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <Link to="/forgot-password" className="auth-link">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </div>
  );
}
