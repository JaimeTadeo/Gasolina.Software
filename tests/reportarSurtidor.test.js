import { 
  reportarSurtidorSinGasolina, 
  obtenerReportesDeSurtidores,
  _limpiarReportes
} from '../src/reportarSurtidor';

describe('Reporte básico de surtidores', () => {
  beforeEach(() => {
    _limpiarReportes();
  });

  it('debería registrar un surtidor sin gasolina', () => {
    reportarSurtidorSinGasolina(1);
    expect(obtenerReportesDeSurtidores()).toContain(1);
  });
  
  it('no debería permitir reportes duplicados', () => {
    reportarSurtidorSinGasolina(1);
    reportarSurtidorSinGasolina(1);
    expect(obtenerReportesDeSurtidores().length).toBe(1);
  });
});
