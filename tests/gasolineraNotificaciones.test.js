import { 
  gestionarSurtidoresFavoritos, 
  notificarDisponibilidad,
  resetearEstado,
  notificarArriboCamion
} from '../src/gasolineraNotificaciones.js';

describe('Notificaciones para surtidores favoritos', () => {
  let surtidores;
  let clienteId;

  beforeEach(() => {
    resetearEstado();
    surtidores = [
      { id: 1, litros: 0, nombre: 'Surtidor 1' },
      { id: 2, litros: 100, nombre: 'Surtidor 2' },
      { id: 3, litros: 50, nombre: 'Surtidor 3' }
    ];
    clienteId = 'cliente123';
  });

  describe('gestionarSurtidoresFavoritos', () => {
    const clienteId = 'cliente_test';
    beforeEach(() => {
        gestionarSurtidoresFavoritos(clienteId, null, 'limpiar');
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
      gestionarSurtidoresFavoritos(clienteId, 1, 'agregar');
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

describe('notificarArriboCamion', () => {
    let surtidores;
    let camion;
    let callback;

    beforeEach(() => {
        surtidores = [
            { id: 1, litros: 100, nombre: 'Surtidor 1' },
            { id: 2, litros: 200, nombre: 'Surtidor 2' }
        ];
        camion = { surtidorId: 1, litrosDescargados: 50 };
        callback = jest.fn();
    });

    it('debería actualizar el combustible del surtidor y notificar el arribo', () => {
        notificarArriboCamion(surtidores, camion, callback);
        expect(surtidores[0].litros).toBe(150); // Combustible actualizado
        expect(callback).toHaveBeenCalledWith(
            expect.stringContaining('🚛 Camión arribó al Surtidor 1')
        );
    });

    it('debería notificar error si el surtidor no existe', () => {
        camion.surtidorId = 99;
        notificarArriboCamion(surtidores, camion, callback);
        expect(callback).toHaveBeenCalledWith(
            expect.stringContaining('Error: No se encontró el surtidor con ID 99')
        );
    });
});

