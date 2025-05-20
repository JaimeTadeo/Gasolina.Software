let reportesSurtidores = [];

export function reportarSurtidorSinGasolina(idSurtidor) {
  reportesSurtidores.push(idSurtidor);
}

export function obtenerReportesDeSurtidores() {
  return [...reportesSurtidores];
}

export function _limpiarReportes() {
  reportesSurtidores = [];
}