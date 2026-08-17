import logo from '../../assets/ovejitas/logo.jpg';
import '../../styles/public.css';

interface ActivityCardProps {
  title: string;
  description: string;
  activityDate: string;
  imageUrl?: string | null;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ActivityCard({ title, description, activityDate, imageUrl }: ActivityCardProps) {
  return (
    <article className="activity-card">
      <div className="activity-card-image">
        <img src={imageUrl || logo} alt={title} />
        <div className="activity-card-date">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            event
          </span>
          {formatDate(activityDate)}
        </div>
      </div>
      <div className="activity-card-body">
        <h3 className="activity-card-title">{title}</h3>
        <p className="activity-card-desc">{description}</p>
      </div>
    </article>
  );
}
