import { useEffect, useState } from 'react';
import ActivityCard from '../../components/public/ActivityCard';
import { activityService, type ActivityPublic } from '../../services/activityService';
import '../../styles/public.css';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityService
      .getPublic()
      .then(setActivities)
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="public-main container">
      <header style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <h1 className="section-title">Nuestras Actividades</h1>
        <p className="section-subtitle">
          Descubre los eventos, talleres y campañas que estamos organizando para brindar esperanza y apoyo a los
          niños de nuestra comunidad. Únete y sé parte del cambio.
        </p>
      </header>

      {!loading && activities.length === 0 ? (
        <div className="activity-empty-card">
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--color-primary-container)' }}>
            calendar_month
          </span>
          <h3 className="fieldset-title">Próximamente nuevas actividades</h3>
          <p className="section-subtitle">Estamos constantemente planificando nuevas formas de ayudar. ¡Vuelve pronto!</p>
        </div>
      ) : (
        <div className="activity-grid">
          {activities.map((a) => (
            <ActivityCard key={a.id} title={a.title} description={a.description} activityDate={a.activityDate} imageUrl={a.imageUrl} />
          ))}
        </div>
      )}
    </main>
  );
}
