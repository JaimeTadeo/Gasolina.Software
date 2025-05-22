// buscarSurtidor.js

/**
 * Busca un surtidor en una lista por su nombre.
 * La búsqueda es insensible a mayúsculas y minúsculas.
 *
 * @param {Array<Object>} surtidores - Un array de objetos surtidor.
 * Cada objeto debe tener al menos una propiedad 'nombre'.
 * @param {string} nombreBuscado - El nombre del surtidor a buscar.
 * @returns {Object|null} El objeto del surtidor encontrado o null si no se encuentra,
 * o si el nombreBuscado es inválido.
 */
export function buscarSurtidorPorNombre(surtidores, nombreBuscado) {
    if (!surtidores || surtidores.length === 0) {
        return null;
    }
    if (!nombreBuscado || typeof nombreBuscado !== 'string' || nombreBuscado.trim() === '') {
        return null;
    }

    const nombreNormalizado = nombreBuscado.toLowerCase().trim();

    for (const surtidor of surtidores) {
        if (surtidor.nombre && typeof surtidor.nombre === 'string') {
            if (surtidor.nombre.toLowerCase() === nombreNormalizado) {
                return surtidor; // Devuelve el primer surtidor que coincida
            }
        }
    }

    return null; // No se encontró el surtidor
}