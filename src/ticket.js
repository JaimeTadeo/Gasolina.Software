let contadorTickets = 0;
let ticketsUsados = new Set();

export function generarTicket() {
  return ++contadorTickets;
}

export function resetContador() {
  contadorTickets = 0;
  ticketsUsados.clear();
}

export function usarTicket(numero) {
  if (numero <= 0 || numero > contadorTickets || ticketsUsados.has(numero)) {
    return false;
  }
  ticketsUsados.add(numero);
  return true;
}

