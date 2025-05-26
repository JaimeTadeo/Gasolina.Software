const favoritosPorUsuario = {};

export function gestionarSurtidoresFavoritos(usuarioId, surtidorId, accion = 'agregar') {
    // Validación de parámetros
    if (!usuarioId) throw new Error('Se requiere ID de usuario');
    if (![1, 2].includes(surtidorId)) throw new Error('ID de surtidor no válido');

    // Inicializar array si no existe
    if (!favoritosPorUsuario[usuarioId]) {
        favoritosPorUsuario[usuarioId] = [];
    }

    // Realizar la acción solicitada
    switch (accion) {
        case 'agregar':
            if (!favoritosPorUsuario[usuarioId].includes(surtidorId)) {
                favoritosPorUsuario[usuarioId].push(surtidorId);
                return {
                    success: true,
                    message: `✅ Surtidor ${surtidorId} agregado a favoritos`,
                    favoritos: [...favoritosPorUsuario[usuarioId]]
                };
            }
            return {
                success: false,
                message: `ℹ️ El surtidor ${surtidorId} ya está en tus favoritos`,
                favoritos: [...favoritosPorUsuario[usuarioId]]
            };
        case 'eliminar':
            favoritosPorUsuario[usuarioId] = favoritosPorUsuario[usuarioId].filter(id => id !== surtidorId);
            return {
                success: true,
                message: `✅ Surtidor ${surtidorId} eliminado de favoritos`,
                favoritos: [...favoritosPorUsuario[usuarioId]]
            };
        case 'obtener':
            return [...favoritosPorUsuario[usuarioId]];
        default:
            throw new Error('Acción no válida');
    }
}

export function verificarDisponibilidadFavoritos(surtidores, usuarioId) {
    if (!favoritosPorUsuario[usuarioId] || favoritosPorUsuario[usuarioId].length === 0) {
        return {
            disponible: false,
            message: 'No tienes surtidores favoritos configurados'
        };
    }

    const disponibles = favoritosPorUsuario[usuarioId].filter(id =>
        surtidores[id] && surtidores[id].litros > 0
    );

    if (disponibles.length > 0) {
        return {
            disponible: true,
            surtidores: disponibles,
            message: `Surtidores favoritos disponibles: ${disponibles.join(', ')}`
        };
    }

    return {
        disponible: false,
        message: 'Ninguno de tus surtidores favoritos tiene gasolina disponible'
    };
}

// Función para limpieza en tests
export function _limpiarFavoritos() {
    Object.keys(favoritosPorUsuario).forEach(key => {
        delete favoritosPorUsuario[key];
    });
}

