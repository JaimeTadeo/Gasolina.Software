import { buscarSurtidorPorNombre } from '../src/buscarSurtidor.js';

describe('Función buscarSurtidorPorNombre', () => {
    const surtidoresDePrueba = [
        { id: 1, nombre: 'Surtidor Central', litros: 500, ubicacion: 'Calle Falsa 123' },
        { id: 2, nombre: 'Surtidor Norte', litros: 1000, ubicacion: 'Avenida Siempre Viva 742' },
        { id: 3, nombre: 'Surtidor SUR', litros: 0, ubicacion: 'Boulevard de los Sueños Rotos' },
        { id: 4, nombre: 'Surtidor Oeste Express', litros: 300, ubicacion: 'Carretera Perdida km 5' },
    ];

    test('debería encontrar un surtidor por su nombre exacto', () => {
        const resultado = buscarSurtidorPorNombre(surtidoresDePrueba, 'Surtidor Norte');
        expect(resultado).toEqual(surtidoresDePrueba[1]);
    });

    test('debería encontrar un surtidor ignorando mayúsculas/minúsculas', () => {
        const resultado = buscarSurtidorPorNombre(surtidoresDePrueba, 'surtidor sur');
        expect(resultado).toEqual(surtidoresDePrueba[2]);
    });

    test('debería devolver null si el surtidor no se encuentra', () => {
        const resultado = buscarSurtidorPorNombre(surtidoresDePrueba, 'Fantasma');
        expect(resultado).toBeNull();
    });

    test('debería devolver null si el nombre es vacío, null o undefined', () => {
        expect(buscarSurtidorPorNombre(surtidoresDePrueba, '')).toBeNull();
        expect(buscarSurtidorPorNombre(surtidoresDePrueba, null)).toBeNull();
        expect(buscarSurtidorPorNombre(surtidoresDePrueba, undefined)).toBeNull();
    });

    test('debería devolver null si la lista está vacía', () => {
        expect(buscarSurtidorPorNombre([], 'Surtidor Central')).toBeNull();
    });

    test('debería devolver el primer surtidor si hay múltiples coincidencias', () => {
        const duplicados = [
            ...surtidoresDePrueba,
            { id: 5, nombre: 'Surtidor Norte', litros: 200 }
        ];
        const resultado = buscarSurtidorPorNombre(duplicados, 'surtidor norte');
        expect(resultado).toEqual(surtidoresDePrueba[1]);
    });
});
