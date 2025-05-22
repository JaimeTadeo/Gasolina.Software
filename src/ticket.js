let contador = 0;
const tickets = {};
let ticketsHistory = []; 
let archivedTickets = [];

export function generarTicket() {
  const id = ++contador;
  const ticketData = {
    id,
    usado: false,
    estado: 'pendiente',
    fecha: new Date()
  };
  tickets[id] = ticketData;
  ticketsHistory.push({...ticketData}); 
  return id;
}

export function usarTicket(id) {
  if (!tickets[id] || tickets[id].usado) return false;
  tickets[id].usado = true;
  archivedTickets.push({
    ...tickets[id],
    archivadoEl: new Date()
  });
  return true;
}

export function resetContador() {
  contador = 0;
  ticketsHistory.length = 0;
  archivedTickets.length = 0;
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

export function obtenerHistorialTickets(fechaInicio = null, fechaFin = null) {
  if (!fechaInicio && !fechaFin) return [...ticketsHistory]; 

  return ticketsHistory.filter(ticket => {
    const ticketDate = new Date(ticket.fecha);
    return (
      (!fechaInicio || ticketDate >= new Date(fechaInicio)) &&
      (!fechaFin || ticketDate <= new Date(fechaFin))
    );
  });
}

export function agregarTicketAlHistorial(ticket) {
  ticketsHistory.push(ticket);
}

export function obtenerTicketsArchivados() {
  return [...archivedTickets]; 
}

