import { buscarSurtidorPorNombre } from '../src/buscarSurtidor.js'; // Asegúrate que la ruta a src sea correcta

describe('Función buscarSurtidorPorNombre', () => {
    const surtidoresDePrueba = [
        { id: 1, nombre: 'Surtidor Central', litros: 500, ubicacion: 'Calle Falsa 123' },
        { id: 2, nombre: 'Surtidor Norte', litros: 1000, ubicacion: 'Avenida Siempre Viva 742' },
        { id: 3, nombre: 'Surtidor SUR', litros: 0, ubicacion: 'Boulevard de los Sueños Rotos' },
        { id: 4, nombre: 'Surtidor Oeste Express', litros: 300, ubicacion: 'Carretera Perdida km 5' },
    ];

    test('debería encontrar un surtidor por su nombre exacto (sensible a mayúsculas y minúsculas por defecto)', () => {
        const resultado = buscarSurtidorPorNombre(surtidoresDePrueba, 'Surtidor Norte');
        expect(resultado).toEqual(surtidoresDePrueba[1]);
    });

    test('debería devolver null si el surtidor no se encuentra', () => {
        const resultado = buscarSurtidorPorNombre(surtidoresDePrueba, 'Surtidor Fantasma');
        expect(resultado).toBeNull();
    });

    test('debería encontrar un surtidor por su nombre ignorando mayúsculas/minúsculas', () => {

        const resultado = buscarSurtidorPorNombre(surtidoresDePrueba, 'surtidor sur');
        expect(resultado).toEqual(surtidoresDePrueba[2]);
    });

    test('debería devolver null si el nombre buscado es una cadena vacía', () => {
        const resultado = buscarSurtidorPorNombre(surtidoresDePrueba, '');
        expect(resultado).toBeNull();
    });

    test('debería devolver null si el nombre buscado es null o undefined', () => {
        const resultadoNull = buscarSurtidorPorNombre(surtidoresDePrueba, null);
        expect(resultadoNull).toBeNull();
        const resultadoUndefined = buscarSurtidorPorNombre(surtidoresDePrueba, undefined);
        expect(resultadoUndefined).toBeNull();
    });

    test('debería devolver null si la lista de surtidores está vacía', () => {
        const resultado = buscarSurtidorPorNombre([], 'Surtidor Central');
        expect(resultado).toBeNull();
    });

    test('debería devolver el primer surtidor si hay múltiples coincidencias (basado en la implementación)', () => {
        const surtidoresConDuplicados = [
            ...surtidoresDePrueba,
            { id: 5, nombre: 'Surtidor Norte', litros: 200, ubicacion: 'Otra Calle' }
        ];
        const resultado = buscarSurtidorPorNombre(surtidoresConDuplicados, 'Surtidor Norte');

        expect(resultado).toEqual(surtidoresDePrueba[1]);
    });
});