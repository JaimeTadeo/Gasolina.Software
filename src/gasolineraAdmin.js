import { reportarSurtidorSinGasolina } from './reportarSurtidor.js';

export function agregarGasolina(surtidores, idSurtidor, litros) {
    // Validaciones básicas
    if (!surtidores[idSurtidor]) {
        throw new Error(`Surtidor con ID ${idSurtidor} no existe`);
    }
    if (isNaN(litros) || litros <= 0) {
        throw new Error('La cantidad debe ser un número positivo');
    }

    // Actualizar los litros
    surtidores[idSurtidor].litros += litros;
    
    // Devolver el nuevo estado
    return {
        success: true,
        nuevoTotal: surtidores[idSurtidor].litros,
        message: `Se agregaron ${litros} litros al Surtidor ${idSurtidor}`
    };
}

export function notificarCamionLlegado(callback) {
    if (typeof callback === "function") {
        callback("El camión de gasolina llegó 🚛");
    }
}

export function modificarHorario(surtidores, id, apertura, cierre) {
    const surtidorIdString = String(id);

    if (!surtidores[surtidorIdString]) {
        throw new Error(`Surtidor con ID ${id} no encontrado`);
    }
    if (apertura >= cierre) {
        throw new Error("El horario de apertura debe ser antes del de cierre");
    }
    surtidores[surtidorIdString].horario = {
        apertura,
        cierre
    };
}


export function reportarFila(surtidores, idSurtidor, personas) {

    const surtidorIdString = String(idSurtidor);

    if (isNaN(personas) || personas < 0) {
        throw new Error("Número de personas inválido");
    }

    if (!surtidores[surtidorIdString]) {
        throw new Error(`Surtidor con ID ${idSurtidor} no existe`);
    }

    if (!surtidores[surtidorIdString].filas) {
         surtidores[surtidorIdString].filas = [];
     }

    surtidores[surtidorIdString].filas.push({
        personas: personas,
        hora: new Date() 
    });
}

export function obtenerReporteFilas(surtidores) {
    return surtidores;
}

export function notificarAdministrador(mensaje) {
    console.log(`[ADMIN LOG] ${mensaje}`);
}

export function calificarSurtidor(surtidores, id, esPositiva) {

    const surtidorIdString = String(id);

    if (!surtidores[surtidorIdString]) throw new Error(`Surtidor con ID ${id} no existe`);


    if (!surtidores[surtidorIdString].calificaciones) {
        surtidores[surtidorIdString].calificaciones = { positivas: 0, negativas: 0 };
    }

    esPositiva ? surtidores[surtidorIdString].calificaciones.positivas++
               : surtidores[surtidorIdString].calificaciones.negativas++;
}

export function obtenerCalificaciones(surtidores, id) {

     const surtidorIdString = String(id);
    return surtidores[surtidorIdString]?.calificaciones || { positivas: 0, negativas: 0 };
}

export function obtenerSurtidorMasLleno(surtidores) {
    let maxPersonas = -1;
    let surtidorMasLlenoId = null;

    Object.entries(surtidores).forEach(([id, datos]) => {
        const personas = datos.filas && datos.filas.length > 0 ? datos.filas.slice(-1)[0].personas : 0;

        if (personas > maxPersonas) {
            maxPersonas = personas;
            surtidorMasLlenoId = id;
        }
    });

    return {
        id: surtidorMasLlenoId,
        personas: maxPersonas
    };
}