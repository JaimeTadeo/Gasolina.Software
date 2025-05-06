export function agregarGasolina(surtidores, id, cantidad) {
    let surtidor;

    if (Array.isArray(surtidores)) {
        surtidor = surtidores.find(s => s.id === id);
    } else {
        surtidor = surtidores[id];
    }

    if (!surtidor) {
        throw new Error("Surtidor no encontrado");
    }

    if (isNaN(cantidad) || cantidad <= 0) {
        throw new Error("Cantidad inválida");
    }

    surtidor.litros += cantidad;
}


export function notificarCamionLlegado(callback) {
    if (typeof callback === "function") {
        callback("El camión de gasolina llegó 🚛");
    }
}

export function modificarHorario(surtidores, id, apertura, cierre) {
    if (!surtidores[id]) {
        throw new Error("Surtidor no encontrado");
    }
    if (apertura >= cierre) {
        throw new Error("El horario de apertura debe ser antes del de cierre");
    }
    surtidores[id].horario = {
        apertura,
        cierre
    };
}

let estadoFilas = {};

export function reportarFila(surtidores, idSurtidor, personas) {
    if (isNaN(personas) || personas < 0) {
        throw new Error("Número de personas inválido");
    }
    
    if (!surtidores[idSurtidor]) {
        throw new Error("Surtidor no existe");
    }

    // Añadir el reporte al historial del surtidor
    surtidores[idSurtidor].filas.push({
        personas: personas,
        hora: new Date()
    });
}

export function obtenerReporteFilas(surtidores) {
    return surtidores;
}

export function notificarAdministrador(mensaje) {
    console.log(`[ADMIN] ${mensaje}`);
}

