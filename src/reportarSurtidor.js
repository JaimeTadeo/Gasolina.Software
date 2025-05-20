let reportesSurtidores = [];

export function reportarSurtidorSinGasolina(idSurtidor) {
  if (!reportesSurtidores.includes(idSurtidor)) {
    reportesSurtidores.push(idSurtidor);
  }
}

export function obtenerReportesDeSurtidores() {
  return [...reportesSurtidores];
}

export function _limpiarReportes() {
  reportesSurtidores = [];
}