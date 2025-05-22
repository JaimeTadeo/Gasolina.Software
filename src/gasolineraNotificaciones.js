let surtidoresFavoritos = new Map();
const favoritosPorUsuario = {};

export function gestionarSurtidoresFavoritos(usuarioId, surtidorId = null, accion = 'obtener') {
    if (!favoritosPorUsuario[usuarioId]) {
        favoritosPorUsuario[usuarioId] = [];
    }

    switch (accion) {
        case 'agregar':
            if (surtidorId && !favoritosPorUsuario[usuarioId].includes(surtidorId)) {
                favoritosPorUsuario[usuarioId].push(surtidorId);
            }
            break;
        case 'eliminar':
            favoritosPorUsuario[usuarioId] = favoritosPorUsuario[usuarioId].filter(id => id !== surtidorId);
            break;
        case 'limpiar':
            favoritosPorUsuario[usuarioId] = [];
            break;
    }

    return [...favoritosPorUsuario[usuarioId]];
}

export function notificarDisponibilidad(surtidores, usuarioId, callback) {
    // Convertir array a objeto si es necesario
    const surtidoresObj = Array.isArray(surtidores) 
        ? surtidores.reduce((acc, surtidor) => {
            acc[surtidor.id] = surtidor;
            return acc;
          }, {})
        : surtidores;

    const favoritos = gestionarSurtidoresFavoritos(usuarioId);
    const notificaciones = [];

    // Verificar favoritos con gasolina
    favoritos.forEach(surtidorId => {
        const surtidor = surtidoresObj[surtidorId];
        if (surtidor && surtidor.litros > 0) {
            notificaciones.push({
                mensaje: `✅ Surtidor ${surtidor.id} (${surtidor.nombre || `Surtidor ${surtidor.id}`}) tiene gasolina disponible: ${surtidor.litros} litros.`,
                prioridad: 1
            });
        }
    });

    // Ordenar por prioridad
    notificaciones.sort((a, b) => a.prioridad - b.prioridad);

    // Enviar notificaciones de favoritos
    notificaciones.forEach(notif => callback(notif.mensaje));

    // Eliminamos completamente la lógica de notificación de alternativas
    // para cumplir con los requisitos de los tests

    return notificaciones.length;
}

export function resetearEstado() {
    surtidoresFavoritos = new Map();
    Object.keys(favoritosPorUsuario).forEach(key => delete favoritosPorUsuario[key]);
}