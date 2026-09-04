const COSTA_RICA_TZ = 'America/Costa_Rica';

const HAS_TIMEZONE = /Z$|[+-]\d{2}:\d{2}$/;

function cleanMeridiem(time: string): string {
  return time.replace('a. m.', 'a.m.').replace('p. m.', 'p.m.');
}

/**
 * Formatea una fecha "pura" (sin componente de hora real) en español de Costa Rica,
 * ej. "2 de septiembre, 2026". No aplica conversión de zona horaria: los campos de
 * solo-fecha (birthDate, activityDate, startDate, etc.) se guardan a medianoche sin
 * offset, y desplazarlos por UTC-6 rompería el día mostrado.
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return '';
  const datePart = dateString.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  if (!year || !month || !day) return '';

  const date = new Date(Date.UTC(year, month - 1, day));
  const monthName = new Intl.DateTimeFormat('es-CR', { month: 'long', timeZone: 'UTC' }).format(date);
  return `${day} de ${monthName}, ${year}`;
}

/**
 * Formatea un timestamp real (CreatedAt/UpdatedAt) en fecha y hora de Costa Rica
 * (UTC-6), ej. "2 de septiembre, 2026, 6:12 p.m.". El backend guarda estos valores
 * con DateTime.UtcNow pero EF Core los devuelve sin sufijo "Z" (Kind Unspecified),
 * así que aquí se fuerza la interpretación UTC antes de convertir.
 */
export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '';
  const isoString = HAS_TIMEZONE.test(dateString) ? dateString : `${dateString}Z`;
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';

  const day = new Intl.DateTimeFormat('es-CR', { day: 'numeric', timeZone: COSTA_RICA_TZ }).format(date);
  const monthName = new Intl.DateTimeFormat('es-CR', { month: 'long', timeZone: COSTA_RICA_TZ }).format(date);
  const year = new Intl.DateTimeFormat('es-CR', { year: 'numeric', timeZone: COSTA_RICA_TZ }).format(date);
  const time = cleanMeridiem(
    new Intl.DateTimeFormat('es-CR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: COSTA_RICA_TZ,
    }).format(date)
  );

  return `${day} de ${monthName}, ${year}, ${time}`;
}
