import logo from '../../assets/ovejitas/logo.jpg';
import '../../styles/public.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-col">
          <div className="footer-brand">
            <img src={logo} alt="Fundación Ovejitas" />
            Fundación Ovejitas
          </div>
          <p className="footer-copy">© 2026 Fundación Ovejitas de Costa Rica. Todos los derechos reservados.</p>
        </div>

        <div className="footer-col">
          <a href="mailto:fundacionovejitas@gmail.com">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              mail
            </span>
            fundacionovejitas@gmail.com
          </a>
          <a href="tel:64801020">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              call
            </span>
            6480-1020
          </a>
          <span>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              location_on
            </span>
            San José, Costa Rica
          </span>
        </div>
      </div>
    </footer>
  );
}
