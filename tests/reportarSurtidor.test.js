import { 
  reportarSurtidorSinGasolina, 
  obtenerReportesDeSurtidores,
  verificarDisponibilidadAlternativa,
  _limpiarReportes
} from '../src/reportarSurtidor';

describe('Sistema de Reporte de Surtidores', () => {
  beforeEach(() => {
    _limpiarReportes();
  });

  describe('Reporte básico', () => {
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

  describe('Verificación de disponibilidad', () => {
    it('debería indicar si hay surtidores alternativos disponibles', () => {
      reportarSurtidorSinGasolina(1);
      
      let resultado = verificarDisponibilidadAlternativa(1);
      expect(resultado).toEqual({
        alternativoDisponible: true,
        surtidorAlternativo: 2,
        mensaje: "El surtidor 2 está disponible como alternativa"
      });

      reportarSurtidorSinGasolina(2);
      resultado = verificarDisponibilidadAlternativa(1);
      expect(resultado).toEqual({
        alternativoDisponible: false,
        surtidorAlternativo: null,
        mensaje: "No hay surtidores con gasolina disponibles"
      });
    });

    it('debería manejar correctamente cuando no hay reportes', () => {
      const resultado = verificarDisponibilidadAlternativa(1);
      expect(resultado).toEqual({
        alternativoDisponible: true,
        surtidorAlternativo: 2,
        mensaje: "El surtidor 2 está disponible como alternativa"
      });
    });
  });
});