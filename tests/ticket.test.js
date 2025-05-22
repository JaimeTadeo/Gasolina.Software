import { generarTicket, resetContador, usarTicket, cambiarEstadoTicket, obtenerEstadoTicket,calcularTiempoEstimado,obtenerHistorialTickets,agregarTicketAlHistorial,obtenerTicketsArchivados } from '../src/ticket.js';

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


describe('Calcular tiempo estimado', () => {
  beforeEach(() => {
    resetContador();
  });

  it('debería calcular correctamente el tiempo estimado', () => {
    const t1 = generarTicket(); 
    const t2 = generarTicket(); 
    const t3 = generarTicket(); 

    const estimadoT3 = calcularTiempoEstimado(t3);
    expect(estimadoT3.tiempo).toBe(4); 
    expect(estimadoT3.mensaje).toBe("Tu tiempo estimado de atención es 4 minutos");
  });
});

describe('Historial de Tickets', () => {
  beforeEach(() => {
    resetContador(); 
  });

  it('debe devolver un array vacío si no hay tickets', () => {
    const historial = obtenerHistorialTickets();
    expect(historial).toEqual([]);
  });

  it('debe registrar tickets nuevos en el historial', () => {
    const ticketId = generarTicket();
    const historial = obtenerHistorialTickets();
    expect(historial.length).toBe(1);
    expect(historial[0].id).toBe(ticketId);
  });

it('debe filtrar tickets por rango de fechas', () => {
  const hoy = new Date();
  const ticketHoy = generarTicket(); 
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);
  agregarTicketAlHistorial({
    id: 99,
    fecha: ayer,
    usado: false,
    estado: 'pendiente'
  });

  const historialReciente = obtenerHistorialTickets(hoy.toISOString());
  expect(historialReciente.length).toBe(1);
  expect(historialReciente[0].id).toBe(ticketHoy);
});

describe('Archivado de Tickets', () => {
  beforeEach(() => {
    resetContador();
  });

  it('debe mover tickets usados a archivados', () => {
    const ticketId = generarTicket();
    usarTicket(ticketId);
    const archivados = obtenerTicketsArchivados();
    expect(archivados.length).toBe(1);
    expect(archivados[0].id).toBe(ticketId);
    expect(archivados[0].usado).toBe(true);
  });
});
});