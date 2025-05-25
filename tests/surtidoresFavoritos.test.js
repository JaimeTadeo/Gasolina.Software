import { gestionarSurtidoresFavoritos,verificarDisponibilidadFavoritos  } from '../src/surtidoresFavoritos.js';

describe('Gestión de Surtidores Favoritos', () => {
    test('debería agregar un surtidor a favoritos', () => {
        const resultado = gestionarSurtidoresFavoritos('usuario1', 1);
        expect(resultado).toBe('Surtidor 1 agregado a favoritos');
    });
    test('debería mantener múltiples favoritos por usuario', () => {
    gestionarSurtidoresFavoritos('usuario1', 1);
    const resultado = gestionarSurtidoresFavoritos('usuario1', 2);
    expect(resultado).toBe('Surtidor 2 agregado a favoritos');
    });
    test('debería lanzar error para surtidor inválido', () => {
    expect(() => gestionarSurtidoresFavoritos('usuario1', 3))
        .toThrow('ID de surtidor no válido');
    });
});

describe('Verificación de Disponibilidad', () => {
    const surtidoresMock = {
        1: { litros: 100 },
        2: { litros: 0 }
    };

    test('debería detectar surtidores disponibles', () => {
        gestionarSurtidoresFavoritos('usuario1', 1);
        const resultado = verificarDisponibilidadFavoritos(surtidoresMock, 'usuario1');
        expect(resultado.disponible).toBe(true);
    });
});