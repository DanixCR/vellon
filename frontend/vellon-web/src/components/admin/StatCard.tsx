interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  accentColor?: string;
}

export default function StatCard({ label, value, icon, accentColor = 'var(--primary)' }: StatCardProps) {
  return (
    <div className="stat-card" style={{ borderLeftColor: accentColor }}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value" style={{ color: accentColor }}>{value}</div>
    </div>
  );
}
