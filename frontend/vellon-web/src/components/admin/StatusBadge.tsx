interface StatusBadgeProps {
  value: boolean | string;
  trueLabel?: string;
  falseLabel?: string;
}

const COLORS: Record<string, { bg: string; color: string }> = {
  true:        { bg: '#f0fdf4', color: '#166534' },
  false:       { bg: '#fef2f2', color: '#991b1b' },
  Activo:      { bg: '#f0fdf4', color: '#166534' },
  Inactivo:    { bg: '#fef2f2', color: '#991b1b' },
  Pendiente:   { bg: '#fffbeb', color: '#92400e' },
  Planificado: { bg: '#eff6ff', color: '#1e40af' },
  EnCurso:     { bg: '#f0fdf4', color: '#166534' },
  Completado:  { bg: '#f5f3ff', color: '#5b21b6' },
  Suspendido:  { bg: '#fef2f2', color: '#991b1b' },
  leído:       { bg: '#f0fdf4', color: '#166534' },
  'no leído':  { bg: '#fffbeb', color: '#92400e' },
};

export default function StatusBadge({ value, trueLabel = 'Activo', falseLabel = 'Inactivo' }: StatusBadgeProps) {
  const label = typeof value === 'boolean' ? (value ? trueLabel : falseLabel) : value;
  const key = typeof value === 'boolean' ? String(value) : value;
  const style = COLORS[key] ?? { bg: '#f3f4f6', color: '#374151' };

  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: 700,
      fontFamily: 'var(--font-heading)',
      background: style.bg,
      color: style.color,
    }}>
      {label}
    </span>
  );
}
