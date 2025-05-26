import { 
    gestionarSurtidoresFavoritos,
    _limpiarFavoritos // Asegúrate de importar con el nombre correcto
} from '../src/surtidoresFavoritos.js';

describe('Gestión de Surtidores Favoritos', () => {
    beforeEach(() => {
        _limpiarFavoritos(); // Usa el nombre correcto de la función
    });

    test('debería agregar un surtidor a favoritos', () => {
        const resultado = gestionarSurtidoresFavoritos('usuario1', 1);
        expect(resultado.message).toBe('✅ Surtidor 1 agregado a favoritos');
    });

    test('debería mantener múltiples favoritos por usuario', () => {
        gestionarSurtidoresFavoritos('usuario1', 1);
        const resultado = gestionarSurtidoresFavoritos('usuario1', 2);
        expect(resultado.message).toBe('✅ Surtidor 2 agregado a favoritos');
        expect(resultado.favoritos).toEqual([1, 2]);
    });

    test('debería lanzar error para surtidor inválido', () => {
        expect(() => gestionarSurtidoresFavoritos('usuario1', 3))
            .toThrow('ID de surtidor no válido');
    });
});