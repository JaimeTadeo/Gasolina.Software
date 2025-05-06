import { generarTicket, resetContador } from '../src/ticket.js';

describe('Generación de Tickets', () => {
  beforeEach(() => {
    resetContador();
  });

  it('debe generar un ticket con el número 1 al presionar el botón por primera vez', () => {
    expect(generarTicket()).toBe(1);
  });

  it('debe generar un ticket con el número 2 al presionar el botón por segunda vez', () => {
    generarTicket();
    expect(generarTicket()).toBe(2);
  });

  it('debe generar un ticket con el número 3 al presionar el botón por tercera vez', () => {
    generarTicket();
    generarTicket();
    expect(generarTicket()).toBe(3);
  });
});
