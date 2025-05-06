import { reportarSurtidorSinGasolina, obtenerReportesDeSurtidores } from './reportarSurtidor';

describe('Reportar Surtidor Sin Gasolina', () => {
  beforeEach(() => {
    global.reportesSurtidores = [];
  });

  it('debería guardar el ID del surtidor reportado', () => {
    reportarSurtidorSinGasolina('SURT-001');

    const reportes = obtenerReportesDeSurtidores();
    expect(reportes).toContain('SURT-001');
  });
});
