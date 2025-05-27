/**
 * @param {object} surtidores 
 * @param {number} idSurtidor
 * @returns {string} 
 */
export function reportarSurtidorSinGasolina(surtidores, idSurtidor) {
    const surtidor = surtidores[idSurtidor];
    if (surtidor) {
        surtidor.litros = 0;
        console.log(`[ADMIN ACCION] Surtidor ${idSurtidor} reportado sin gasolina. Litros establecidos a 0.`);
        return `Surtidor ${idSurtidor} ha sido reportado sin gasolina.`;
    } else {
        console.warn(`[ADMIN ACCION] Intento de reportar surtidor ${idSurtidor} sin gasolina, pero no existe.`);
        throw new Error(`Surtidor ${idSurtidor} no encontrado.`);
    }
}

/**
 * @param {object} surtidores 
 * @param {number} idSurtidorReportado 
 * @returns {object} 
 */
export function verificarDisponibilidadAlternativa(surtidores, idSurtidorReportado) {
    const otrosSurtidores = Object.values(surtidores).filter(
        s => s.id !== parseInt(idSurtidorReportado) && s.litros > 0
    );

    if (otrosSurtidores.length > 0) {
        const nombresAlternativos = otrosSurtidores.map(s => `Surtidor ${s.id}`).join(", ");
        return {
            mensaje: `El Surtidor ${idSurtidorReportado} está sin gasolina. Alternativas: ${nombresAlternativos} tienen gasolina.`,
            alternativoDisponible: true
        };
    } else {
        return {
            mensaje: `El Surtidor ${idSurtidorReportado} está sin gasolina. Actualmente no hay otros surtidores con gasolina.`,
            alternativoDisponible: false
        };
    }
}