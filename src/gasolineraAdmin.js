export function agregarGasolina(surtidores, id, cantidad) {
    if (!surtidores[id]) {
        throw new Error("El surtidor no existe.");
    }
    if (isNaN(cantidad) || cantidad <= 0) {
        throw new Error("Cantidad inválida.");
    }

    surtidores[id].litros += cantidad;
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



