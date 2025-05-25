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