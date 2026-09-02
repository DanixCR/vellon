import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import banner from '../../assets/ovejitas/about-banner.jpg';
import ActivityCard from '../../components/public/ActivityCard';
import DonationInfo from '../../components/public/DonationInfo';
import { activityService, type ActivityPublic } from '../../services/activityService';
import '../../styles/public.css';

export default function HomePage() {
  const [activities, setActivities] = useState<ActivityPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityService
      .getPublic()
      .then((data) => setActivities(data.slice(0, 3)))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="public-main container">
      <section className="hero">
        <div className="hero-content">
          <h1 className="section-title">Por un futuro mejor...</h1>
          <p className="section-subtitle">
            En Fundación Ovejitas creemos en el poder de la comunidad y el apoyo mutuo. Somos una organización
            dedicada a brindar ayuda, educación y esperanza a las familias y niños de Costa Rica, cultivando un
            ambiente seguro y lleno de amor.
          </p>
          <div>
            <Link to="/contacto" className="btn btn-cta">
              <span className="material-symbols-outlined icon-fill">favorite</span>
              Quiero colaborar
            </Link>
          </div>
        </div>
        <div className="hero-image-frame">
          <img src={banner} alt="Fundación Ovejitas" />
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-md)' }}>
          <h2 className="fieldset-title" style={{ fontSize: 24 }}>Actividades recientes</h2>
          <Link to="/actividades" className="navbar-link">Ver todas →</Link>
        </div>

        {!loading && activities.length === 0 ? (
          <div className="activity-empty-card">
            <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--color-primary-container)' }}>
              calendar_month
            </span>
            <h3 className="fieldset-title">Próximamente nuevas actividades</h3>
            <p className="section-subtitle">Estamos planificando nuevas formas de ayudar. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <div className="activity-grid">
            {activities.map((a) => (
              <ActivityCard key={a.id} title={a.title} description={a.description} activityDate={a.activityDate} imageUrl={a.imageUrl} />
            ))}
          </div>
        )}
      </section>

      <section>
        <DonationInfo border="primary" />
      </section>
    </main>
  );
}
