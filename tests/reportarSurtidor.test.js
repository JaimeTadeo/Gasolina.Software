import { reportarSurtidorSinGasolina, obtenerReportesDeSurtidores } from '../src/reportarSurtidor';

describe('Reportar Surtidor Sin Gasolina', () => {
  beforeEach(() => {
    global.reportesSurtidores = [];
  });

  it('debería guardar el ID del surtidor reportado', () => {
    reportarSurtidorSinGasolina('SURT-001');

    const reportes = obtenerReportesDeSurtidores();
    expect(reportes).toContain('SURT-001');
  });

  it('debería evitar reportes duplicados para el mismo surtidor', () => {
    reportarSurtidorSinGasolina('SURT-001');
    reportarSurtidorSinGasolina('SURT-001');

    const reportes = obtenerReportesDeSurtidores();
    expect(reportes.length).toBe(1);
  });
});
