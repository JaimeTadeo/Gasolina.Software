let contadorTickets = 0;

export function generarTicket() {
  return ++contadorTickets;
}

export function resetContador() {
  contadorTickets = 0;
}