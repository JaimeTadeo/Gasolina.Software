const favoritosPorUsuario = {};

export function gestionarSurtidoresFavoritos(usuarioId, surtidorId) {
    if (![1, 2].includes(surtidorId)) {
        throw new Error('ID de surtidor no válido');
    }
    if (!favoritosPorUsuario[usuarioId]) {
        favoritosPorUsuario[usuarioId] = [];
    }
    if (!favoritosPorUsuario[usuarioId].includes(surtidorId)) {
        favoritosPorUsuario[usuarioId].push(surtidorId);
        return `Surtidor ${surtidorId} agregado a favoritos`;
    }
    return `El surtidor ${surtidorId} ya está en tus favoritos`;
}

export function verificarDisponibilidadFavoritos(surtidores, usuarioId) {
    if (!favoritosPorUsuario[usuarioId]) {
        return {
            disponible: false,
            mensaje: 'No tienes surtidores favoritos'
        };
    }

    const disponibles = favoritosPorUsuario[usuarioId].filter(id => 
        surtidores[id]?.litros > 0
    );

    return {
        disponible: disponibles.length > 0,
        surtidores: disponibles,
        mensaje: disponibles.length > 0 
            ? `Surtidores disponibles: ${disponibles.join(', ')}` 
            : 'No hay surtidores favoritos disponibles'
    };
}