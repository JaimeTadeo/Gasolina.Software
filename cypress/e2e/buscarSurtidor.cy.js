export function buscarSurtidorPorNombre(lista, nombre) {
    if (!Array.isArray(lista) || typeof nombre !== 'string' || nombre.trim() === '') {
        return null;
    }

    const nombreNormalizado = nombre.trim().toLowerCase();

    return lista.find(surtidor => 
        surtidor.nombre.trim().toLowerCase() === nombreNormalizado
    ) || null;
}
