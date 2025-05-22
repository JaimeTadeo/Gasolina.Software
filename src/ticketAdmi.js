const ESTADOS_VALIDOS = ["pendiente", "en proceso", "atendiendo"];
const archivedTickets = [];

export function crearTicket(tickets, id, descripcion) {
    if (tickets[id]) {
        throw new Error(`Ya existe un ticket con ID ${id}`);
    }
    tickets[id] = {
        descripcion,
        estado: "pendiente",
        creado: new Date()
    };
}

export function cambiarEstadoTicket(tickets, id, nuevoEstado) {
  if (!tickets[id]) throw new Error(`Ticket con ID ${id} no encontrado`);
  if (!ESTADOS_VALIDOS.includes(nuevoEstado)) throw new Error(`Estado inválido: ${nuevoEstado}`);

  tickets[id].estado = nuevoEstado;

  if (nuevoEstado === 'atendiendo') {
    archivedTickets.push({...tickets[id], archivedAt: new Date()});
  }
}
export function obtenerEstadoTicket(tickets, id) {
    if (!tickets[id]) {
        throw new Error(`Ticket con ID ${id} no encontrado`);
    }
    return tickets[id].estado;
}

export function obtenerTodosLosTickets(tickets) {
    return tickets;
}

export function obtenerTicketsArchivados() {
  return [...archivedTickets];
}