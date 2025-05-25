export default function gasolinera(click, data) {
    const precioLitro = 3.74;

    if (Array.isArray(data)) {
        if (click) {
            return data.map(surtidor => {
                const bolivianos = (surtidor.litros * precioLitro).toFixed(2);
                return `Surtidor ${surtidor.id}: ${surtidor.litros} litros disponibles (${bolivianos} Bs)`;
            });
        } else {
            return 'Ver disponibilidad de gasolina';
        }
    } else {
        if (click) {
            const bolivianos = (data * precioLitro).toFixed(2);
            return `${data} litros disponibles (${bolivianos} Bs)`;
        } else {
            return 'Ver disponibilidad de gasolina';
        }
    }
}

export function actualizarCombustible(surtidores, surtidorId, litros) {
    const surtidor = surtidores.find(s => s.id === surtidorId);
    if (!surtidor) return `Error: Surtidor con ID ${surtidorId} no existe.`;
    surtidor.litros += litros;
    return `Combustible actualizado para Surtidor ${surtidorId}: ${surtidor.litros} litros.`;
}