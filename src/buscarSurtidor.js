// buscarSurtidor.js

/**
 * @param {Array<Object>} surtidores 
 * @param {string} nombreBuscado 
 * @returns {Object|null} 
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
                return surtidor; 
            }
        }
    }

    return null; 
}