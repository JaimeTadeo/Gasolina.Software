let reportesSurtidores = [];

export function reportarSurtidorSinGasolina(idSurtidor) {
  if (!reportesSurtidores.includes(idSurtidor)) {
    reportesSurtidores.push(idSurtidor);
    console.log(`[Reporte] Surtidor ${idSurtidor} marcado sin gasolina`);
  }
}

export function obtenerReportesDeSurtidores() {
  return [...reportesSurtidores];
}

export function verificarDisponibilidadAlternativa(idSurtidorReportado) {
  const todosSurtidores = [1, 2];
  
  const disponibles = todosSurtidores.filter(
    id => id !== idSurtidorReportado && !reportesSurtidores.includes(id)
  );

  if (disponibles.length > 0) {
    return {
      alternativoDisponible: true,
      surtidorAlternativo: disponibles[0],
      mensaje: `El surtidor ${disponibles[0]} está disponible como alternativa`
    };
  }

  return {
    alternativoDisponible: false,
    surtidorAlternativo: null,
    mensaje: "No hay surtidores con gasolina disponibles"
  };
}

export function _limpiarReportes() {
  reportesSurtidores = [];
}