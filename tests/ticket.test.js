import { generarTicket } from '../src/ticket.js';

describe('Generación de Tickets', () => {
  it('debe generar un ticket con el número 1 al presionar el botón por primera vez', () => {
    expect(generarTicket()).toBe(1);
  });
});
