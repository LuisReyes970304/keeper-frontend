export function formatearFechaHumana(fecha) {
  const coderAhora = new Date();
  const diffMs = coderAhora - fecha;
  const mins = Math.floor(diffMs / (1000 * 60));
  const horas = Math.floor(diffMs / (1000 * 60 * 60));

  if (mins < 1) return 'Hace un momento';
  if (mins < 60) return `Hace ${mins} minutos`;
  if (horas < 24) return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}
