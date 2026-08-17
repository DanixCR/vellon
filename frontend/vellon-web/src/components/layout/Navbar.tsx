import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/ovejitas/logo.jpg';
import '../../styles/public.css';

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/actividades', label: 'Actividades' },
  { to: '/voluntariado', label: 'Voluntariado' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <img src={logo} alt="Fundación Ovejitas" />
          Fundación Ovejitas
        </Link>

        <div className="navbar-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <Link to="/login" className="navbar-admin-link">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            account_circle
          </span>
          Personal administrativo
        </Link>

        <button className="navbar-toggle" onClick={() => setOpen((v) => !v)} aria-label="Abrir menú">
          <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
        </button>
      </div>

      {open && (
        <div className="navbar-mobile-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/login" className="navbar-admin-link" onClick={() => setOpen(false)}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              account_circle
            </span>
            Personal administrativo
          </Link>
        </div>
      )}
    </nav>
  );
}
