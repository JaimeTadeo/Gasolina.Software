import { 
  reportarSurtidorSinGasolina, 
  obtenerReportesDeSurtidores,
  verificarDisponibilidadAlternativa,
  _limpiarReportes
} from '../src/reportarSurtidor';

describe('Sistema de Reporte de Surtidores', () => {
  let surtidores;

  beforeEach(() => {
    _limpiarReportes();
    surtidores = {
      1: { id: 1, litros: 1000, nombre: 'Surtidor 1' },
      2: { id: 2, litros: 800, nombre: 'Surtidor 2' }
    };
  });

  describe('Reporte básico', () => {
    it('debería registrar un surtidor sin gasolina', () => {
      const resultado = reportarSurtidorSinGasolina(surtidores, 1);
      
      expect(resultado.success).toBe(true);
      expect(obtenerReportesDeSurtidores()).toContain(1);
      expect(surtidores[1].litros).toBe(0);
    });

    it('no debería permitir reportes duplicados', () => {
      reportarSurtidorSinGasolina(surtidores, 1);
      reportarSurtidorSinGasolina(surtidores, 1);
      
      expect(obtenerReportesDeSurtidores().length).toBe(1);
      expect(surtidores[1].litros).toBe(0);
    });

    it('debería lanzar error para ID inválido', () => {
      expect(() => reportarSurtidorSinGasolina(surtidores, 'invalido')).toThrow();
      expect(() => reportarSurtidorSinGasolina(surtidores, 99)).toThrow();
    });
  });

  describe('Verificación de disponibilidad', () => {
    it('debería indicar si hay surtidores alternativos disponibles', () => {
      reportarSurtidorSinGasolina(surtidores, 1);
      
      let resultado = verificarDisponibilidadAlternativa(surtidores, 1);
      expect(resultado).toEqual({
        alternativoDisponible: true,
        surtidorAlternativo: 2,
        mensaje: "El surtidor 2 está disponible como alternativa"
      });

      reportarSurtidorSinGasolina(surtidores, 2);
      resultado = verificarDisponibilidadAlternativa(surtidores, 1);
      expect(resultado).toEqual({
        alternativoDisponible: false,
        surtidorAlternativo: null,
        mensaje: "No hay surtidores con gasolina disponibles"
      });
    });
  });
});