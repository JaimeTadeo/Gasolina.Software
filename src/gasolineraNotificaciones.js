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

export function notificarDisponibilidad(surtidores, usuarioId, callback, notificarAlternativas = false) {
    // Convertir array a objeto si es necesario
    const surtidoresObj = Array.isArray(surtidores) 
        ? surtidores.reduce((acc, surtidor) => {
            acc[surtidor.id] = surtidor;
            return acc;
          }, {})
        : surtidores;

    const favoritos = gestionarSurtidoresFavoritos(usuarioId);
    const notificaciones = [];

    // 1. Notificar favoritos con gasolina (CHECKLIST: Notificar al usuario que su surtidor hay gasolina)
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

    // 2. Notificar alternativas si es necesario (CHECKLIST: Notificar si la otra gasolina no esté pues que vaya a la siguiente favorita)
    if (notificarAlternativas && notificaciones.length === 0 && favoritos.length > 0) {
        const surtidoresConGasolina = Object.values(surtidoresObj).filter(
            s => s.litros > 0 && !favoritos.includes(s.id)
        );

        if (surtidoresConGasolina.length > 0) {
            const surtidorRecomendado = surtidoresConGasolina[0];
            callback(`⚠️ Tus surtidores favoritos no tienen gasolina. Te recomendamos el Surtidor ${surtidorRecomendado.id} (${surtidorRecomendado.nombre || `Surtidor ${surtidorRecomendado.id}`}) con ${surtidorRecomendado.litros} litros.`);
        }
    }

    return notificaciones.length;
}

export function resetearEstado() {
    surtidoresFavoritos = new Map();
    Object.keys(favoritosPorUsuario).forEach(key => delete favoritosPorUsuario[key]);
}

export function notificarArriboCamion(surtidores, camion, callback) {
    const surtidor = surtidores.find(s => s.id === camion.surtidorId);
    if (!surtidor) {
        callback(`Error: No se encontró el surtidor con ID ${camion.surtidorId}.`);
        return;
    }
    surtidor.litros += camion.litrosDescargados;
    callback(`🚛 Camión arribó al Surtidor ${surtidor.id}. Combustible actualizado: ${surtidor.litros} litros.`);
}