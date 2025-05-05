import { 
  gestionarSurtidoresFavoritos, 
  notificarDisponibilidad,
  resetearEstado
} from '../src/gasolineraNotificaciones.js';

describe('Notificaciones para surtidores favoritos', () => {
  let surtidores;
  let clienteId;

  beforeEach(() => {
    // Resetear el estado completamente antes de cada test
    resetearEstado();
    surtidores = [
      { id: 1, litros: 0, nombre: 'Surtidor 1' },
      { id: 2, litros: 100, nombre: 'Surtidor 2' },
      { id: 3, litros: 50, nombre: 'Surtidor 3' }
    ];
    clienteId = 'cliente123';
  });

  describe('gestionarSurtidoresFavoritos', () => {
    it('debería agregar un surtidor a favoritos', () => {
      gestionarSurtidoresFavoritos(clienteId, 2, 'agregar');
      const favoritos = gestionarSurtidoresFavoritos(clienteId);
      expect(favoritos).toContain(2);
    });

    it('debería eliminar un surtidor de favoritos', () => {
      gestionarSurtidoresFavoritos(clienteId, 2, 'agregar');
      gestionarSurtidoresFavoritos(clienteId, 2, 'eliminar');
      const favoritos = gestionarSurtidoresFavoritos(clienteId);
      expect(favoritos).not.toContain(2);
    });

    it('debería limpiar todos los favoritos', () => {
      gestionarSurtidoresFavoritos(clienteId, 1, 'agregar');
      gestionarSurtidoresFavoritos(clienteId, 2, 'agregar');
      gestionarSurtidoresFavoritos(clienteId, null, 'limpiar');
      const favoritos = gestionarSurtidoresFavoritos(clienteId);
      expect(favoritos).toHaveLength(0);
    });
  });

  describe('notificarDisponibilidad', () => {
    it('debería notificar cuando un surtidor favorito tiene gasolina', () => {
      const callback = jest.fn();
      gestionarSurtidoresFavoritos(clienteId, 2, 'agregar');
      notificarDisponibilidad(surtidores, clienteId, callback);
      expect(callback).toHaveBeenCalledWith(
        expect.stringContaining('Surtidor 2 (Surtidor 2) tiene gasolina disponible: 100 litros.')
      );
    });

    it('no debería notificar cuando un surtidor favorito no tiene gasolina', () => {
      const callback = jest.fn();
      // Agregar solo el surtidor 1 (0 litros)
      gestionarSurtidoresFavoritos(clienteId, 1, 'agregar');

      // Verificar que no se llame al callback
      notificarDisponibilidad(surtidores, clienteId, callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it('debería notificar para múltiples surtidores favoritos con gasolina', () => {
      const callback = jest.fn();
      gestionarSurtidoresFavoritos(clienteId, 2, 'agregar');
      gestionarSurtidoresFavoritos(clienteId, 3, 'agregar');
      notificarDisponibilidad(surtidores, clienteId, callback);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});