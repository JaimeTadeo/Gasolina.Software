let reportesSurtidores = [];

export function reportarSurtidorSinGasolina(idSurtidor) {
  if (!reportesSurtidores.includes(idSurtidor)) {
    reportesSurtidores.push(idSurtidor);
    console.log(`[Reportes Sin Gas] Surtidor ${idSurtidor} añadido a la lista de reportes.`);
  }
}

export function obtenerReportesDeSurtidores() {
  return reportesSurtidores;
}
