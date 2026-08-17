import { Link } from 'react-router-dom';
import banner from '../../assets/ovejitas/about-banner.jpg';
import '../../styles/public.css';

export default function AboutPage() {
  return (
    <main className="public-main container">
      <section className="hero">
        <div className="hero-content">
          <h1 className="section-title">Conócenos</h1>
          <p className="section-subtitle">
            En Fundación Ovejitas, creemos en el poder de la comunidad y el apoyo mutuo. Somos una organización
            dedicada a brindar ayuda, educación y esperanza a las familias y niños de Costa Rica, cultivando un
            ambiente seguro y lleno de amor.
          </p>
          <div>
            <Link to="/contacto" className="btn btn-cta">
              <span className="material-symbols-outlined icon-fill">favorite</span>
              Apóyanos
            </Link>
          </div>
        </div>
        <div className="hero-image-frame">
          <img src={banner} alt="Banner Fundación Ovejitas" />
        </div>
      </section>

      <section className="mission-vision-grid">
        <div className="card card--border-secondary">
          <div className="icon-circle" style={{ background: 'var(--color-secondary-container)' }}>
            <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-on-secondary-container)' }}>
              flag
            </span>
          </div>
          <h2 className="fieldset-title" style={{ color: 'var(--color-secondary)', fontSize: 24 }}>Nuestra Misión</h2>
          <p className="section-subtitle" style={{ fontSize: 16 }}>
            Proveer recursos educativos, emocionales y materiales a niños y familias en situación de vulnerabilidad,
            fomentando un desarrollo integral a través de programas comunitarios sostenibles y basados en la empatía.
          </p>
        </div>

        <div className="card card--border-tertiary">
          <div className="icon-circle" style={{ background: 'var(--color-tertiary-fixed)' }}>
            <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-on-tertiary-container)' }}>
              visibility
            </span>
          </div>
          <h2 className="fieldset-title" style={{ color: 'var(--color-tertiary)', fontSize: 24 }}>Nuestra Visión</h2>
          <p className="section-subtitle" style={{ fontSize: 16 }}>
            Ser un faro de esperanza y un modelo de apoyo comunitario en Costa Rica, donde cada niño tenga la
            oportunidad de crecer en un ambiente seguro, lleno de oportunidades y rodeado de amor y comprensión.
          </p>
        </div>
      </section>

      <section
        className="card"
        style={{
          background: 'var(--color-surface-container-low)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-lg)',
        }}
      >
        <div style={{ flex: 1 }}>
          <h2 className="fieldset-title" style={{ fontSize: 24 }}>¿Quieres saber más?</h2>
          <p className="section-subtitle" style={{ fontSize: 16, marginTop: 'var(--space-sm)' }}>
            Estamos siempre abiertos a conversar, colaborar y recibir nuevos voluntarios. Contáctanos por cualquiera
            de nuestros canales oficiales.
          </p>
        </div>

        <div className="info-list">
          <div className="info-item">
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>mail</span>
            <span>fundacionovejitas@gmail.com</span>
          </div>
          <div className="info-item">
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>call</span>
            <span>6480-1020</span>
          </div>
          <div className="info-item">
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>location_on</span>
            <span>San José, Costa Rica</span>
          </div>
        </div>
      </section>
    </main>
  );
}
