let contadorTickets = 0;

export function generarTicket() {
  return ++contadorTickets;
}

export function resetContador() {
  contadorTickets = 0;
  ticketsUsados.clear();
}

let ticketsUsados = new Set();

export function usarTicket(numero) {
  if (numero <= 0 || numero > contadorTickets || ticketsUsados.has(numero)) {
    return false;
  }
  ticketsUsados.add(numero);
  return true;
}
