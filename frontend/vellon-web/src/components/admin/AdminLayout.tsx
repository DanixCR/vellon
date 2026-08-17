import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/contacts', label: 'Contactos', icon: '📩' },
  { to: '/admin/activities', label: 'Actividades', icon: '🎯' },
  { to: '/admin/socioeconomic', label: 'Estudios Socioeconómicos', icon: '📋' },
  { to: '/admin/volunteers', label: 'Voluntarios', icon: '👥' },
  { to: '/admin/projects', label: 'Proyectos', icon: '📁' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>🐑 Fundación Ovejitas</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}

          {admin?.isSuperAdmin && (
            <>
              <div className="sidebar-divider" />
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                👤 Usuarios Admin
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-admin-name">👤 {admin?.fullName}</div>
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h2>Panel Administrativo — Fundación Ovejitas</h2>
          <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
            {admin?.username}
          </span>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
