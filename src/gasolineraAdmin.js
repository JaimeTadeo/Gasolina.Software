export function recargarGasolina(surtidores, recargas) {
    return surtidores.map(surtidor => {
        const recarga = recargas.find(r => r.id === surtidor.id);
        if (recarga) {
            return {
                ...surtidor,
                litros: surtidor.litros + recarga.litros
            };
        }
        return surtidor;
    });
}
