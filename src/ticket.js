let contador = 0;
const tickets = {};

export function generarTicket() {
  const id = ++contador;
  tickets[id] = { usado: false, estado: 'pendiente' };
  return id;
}

export function usarTicket(id) {
  if (!tickets[id] || tickets[id].usado) return false;
  tickets[id].usado = true;
  return true;
}

export function resetContador() {
  contador = 0;
  for (const id in tickets) {
    delete tickets[id];
  }
}

export function cambiarEstadoTicket(id, nuevoEstado) {
  const estadosValidos = ['pendiente', 'en proceso', 'atendiendo'];

  if (!tickets[id]) throw new Error('Ticket no encontrado');
  if (!estadosValidos.includes(nuevoEstado)) throw new Error('Estado inválido');

  tickets[id].estado = nuevoEstado;
}

export function obtenerEstadoTicket(id) {
  if (!tickets[id]) throw new Error('Ticket no encontrado');
  return tickets[id].estado;
}
const TIEMPO_POR_TICKET_MINUTOS = 2;

export function calcularTiempoEstimado(id) {
  if (!tickets[id]) throw new Error('Ticket no encontrado');

  const idsAnteriores = Object.keys(tickets)
    .map(Number)
    .filter(tid => tid < id && tickets[tid].estado !== 'atendiendo');

  const tiempoEstimado = idsAnteriores.length * TIEMPO_POR_TICKET_MINUTOS;

  return {
    tiempo: tiempoEstimado,
    mensaje: `Tu tiempo estimado de atención es ${tiempoEstimado} minutos`
  };
}
