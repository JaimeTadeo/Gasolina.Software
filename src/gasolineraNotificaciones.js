// Almacén de surtidores favoritos por cliente
let surtidoresFavoritos = new Map();

export function gestionarSurtidoresFavoritos(clienteId, surtidorId, accion) {
    if (!surtidoresFavoritos.has(clienteId)) {
        surtidoresFavoritos.set(clienteId, new Set());
    }

    const favoritos = surtidoresFavoritos.get(clienteId);

    if (accion === 'limpiar') {
        favoritos.clear();
    } else if (accion === 'agregar') {
        favoritos.add(surtidorId);
    } else if (accion === 'eliminar') {
        favoritos.delete(surtidorId);
    }

    return Array.from(favoritos);
}

export function notificarDisponibilidad(surtidores, clienteId, callback) {
    if (!surtidoresFavoritos.has(clienteId)) return;

    const favoritos = surtidoresFavoritos.get(clienteId);
    let notificaciones = 0;

    favoritos.forEach(surtidorId => {
        const surtidor = surtidores.find(s => s.id === surtidorId);
        if (surtidor && surtidor.litros > 0) {
            callback(`Surtidor ${surtidor.id} (${surtidor.nombre}) tiene gasolina disponible: ${surtidor.litros} litros.`);
            notificaciones++;
        }
    });

    return notificaciones;
}

// Función para resetear el estado en tests
export function resetearEstado() {
    surtidoresFavoritos = new Map();
}