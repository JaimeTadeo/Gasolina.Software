import { gestionarSurtidoresFavoritos } from '../src/surtidoresFavoritos.js';

describe('Gestión de Surtidores Favoritos', () => {
    test('debería agregar un surtidor a favoritos', () => {
        const resultado = gestionarSurtidoresFavoritos('usuario1', 1);
        expect(resultado).toBe('Surtidor 1 agregado a favoritos');
    });
});