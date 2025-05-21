export function filtrarSurtidoresPorZona(surtidores, zona) {
    if (!zona || zona === 'todas') {
        return Object.values(surtidores);
    }
    return Object.values(surtidores).filter(surtidor => surtidor.zona === zona);
}