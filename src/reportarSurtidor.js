global.reportesSurtidores = global.reportesSurtidores || [];

export function reportarSurtidorSinGasolina(idSurtidor) {
  if (!global.reportesSurtidores.includes(idSurtidor)) {
    global.reportesSurtidores.push(idSurtidor);
  }
}

export function obtenerReportesDeSurtidores() {
  return global.reportesSurtidores;
}
