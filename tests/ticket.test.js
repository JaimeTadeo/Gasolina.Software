import { generarTicket, resetContador, usarTicket } from '../src/ticket.js';

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