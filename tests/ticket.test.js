import { generarTicket, resetContador, usarTicket, cambiarEstadoTicket, obtenerEstadoTicket } from '../src/ticket.js';

describe('Uso de Tickets', () => {
  beforeEach(() => {
    resetContador();
  });

  it('debe permitir usar un ticket generado', () => {
    const ticket = generarTicket();
    expect(usarTicket(ticket)).toBe(true);
  });

  it('no debe permitir usar un ticket que no fue generado', () => {
    expect(usarTicket(99)).toBe(false);
  });

  it('no debe permitir usar un ticket dos veces', () => {
    const ticket = generarTicket();
    expect(usarTicket(ticket)).toBe(true);
    expect(usarTicket(ticket)).toBe(false);
  });
});

describe('Cambio de estado del ticket', () => {
  beforeEach(() => {
    resetContador();
  });

  it('debería cambiar el estado del ticket correctamente', () => {
    const ticket = generarTicket();
    cambiarEstadoTicket(ticket, 'en proceso');
    expect(obtenerEstadoTicket(ticket)).toBe('en proceso');
  });

  it('debería mantener estado inicial como "pendiente"', () => {
    const ticket = generarTicket();
    expect(obtenerEstadoTicket(ticket)).toBe('pendiente');
  });

  it('no debería permitir estados inválidos', () => {
    const ticket = generarTicket();
    expect(() => cambiarEstadoTicket(ticket, 'cerrado')).toThrow('Estado inválido');
  });

  it('no debería cambiar estado de ticket inexistente', () => {
    expect(() => cambiarEstadoTicket(99, 'atendiendo')).toThrow('Ticket no encontrado');
  });
});
