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
