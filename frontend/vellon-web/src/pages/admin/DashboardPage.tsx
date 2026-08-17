import { useEffect, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import { contactService } from '../../services/contactService';
import { activityService } from '../../services/activityService';
import { socioeconomicService } from '../../services/socioeconomicService';
import { volunteerService } from '../../services/volunteerService';
import { projectService } from '../../services/projectService';

interface Stats {
  totalContacts: number;
  unreadContacts: number;
  activeActivities: number;
  totalStudies: number;
  pendingVolunteers: number;
  activeProjects: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      contactService.getAll(),
      activityService.getAll(),
      socioeconomicService.getAll(),
      volunteerService.getAll(),
      projectService.getAll(),
    ])
      .then(([contacts, activities, studies, volunteers, projects]) => {
        setStats({
          totalContacts: contacts.length,
          unreadContacts: contacts.filter((c) => !c.isRead).length,
          activeActivities: activities.filter((a) => a.isActive).length,
          totalStudies: studies.length,
          pendingVolunteers: volunteers.filter((v) => v.status === 'Pendiente').length,
          activeProjects: projects.filter((p) => p.status === 'EnCurso').length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-text">Cargando estadísticas...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        <StatCard label="Contactos recibidos" value={stats?.totalContacts ?? 0} icon="📩" />
        <StatCard
          label="Contactos no leídos"
          value={stats?.unreadContacts ?? 0}
          icon="🔴"
          accentColor="var(--warning)"
        />
        <StatCard label="Actividades activas" value={stats?.activeActivities ?? 0} icon="🎯" />
        <StatCard label="Estudios socioeconómicos" value={stats?.totalStudies ?? 0} icon="📋" />
        <StatCard
          label="Voluntarios pendientes"
          value={stats?.pendingVolunteers ?? 0}
          icon="👥"
          accentColor="var(--warning)"
        />
        <StatCard
          label="Proyectos en curso"
          value={stats?.activeProjects ?? 0}
          icon="📁"
          accentColor="var(--success)"
        />
      </div>
    </div>
  );
}
