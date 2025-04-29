export function agregarGasolina(surtidores, id, cantidad) {
    if (typeof cantidad !== "number" || cantidad <= 0) {
        throw new Error("Cantidad inválida");
    }

    const surtidor = surtidores.find(s => s.id === id);

    if (!surtidor) {
        throw new Error("Surtidor no encontrado");
    }

    surtidor.litros += cantidad;
    
}

export function notificarCamionLlegado(callback) {
    if (typeof callback === "function") {
        callback("El camión de gasolina llegó 🚛");
    }
}

