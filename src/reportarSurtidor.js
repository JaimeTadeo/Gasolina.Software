let reportesSurtidores = [];

export function reportarSurtidorSinGasolina(surtidores, idSurtidor) {
  // Validación del ID
  if (typeof idSurtidor !== 'number' || isNaN(idSurtidor)) {
    throw new Error('ID de surtidor no válido');
  }

  // Verificar existencia del surtidor
  if (!surtidores[idSurtidor]) {
    throw new Error(`Surtidor con ID ${idSurtidor} no existe`);
  }

  // Registrar el reporte si no existe
  if (!reportesSurtidores.includes(idSurtidor)) {
    reportesSurtidores.push(idSurtidor);
    // Actualizar el estado real del surtidor
    surtidores[idSurtidor].litros = 0;
    console.log(`[Reporte] Surtidor ${idSurtidor} marcado sin gasolina`);
  }

  return {
    success: true,
    message: `Surtidor ${idSurtidor} reportado sin gasolina`,
    surtidorId: idSurtidor
  };
}


export function obtenerReportesDeSurtidores() {
  return [...reportesSurtidores];
}

export function verificarDisponibilidadAlternativa(surtidores, idSurtidorReportado) {
  const todosSurtidores = Object.keys(surtidores).map(Number);
  
  const disponibles = todosSurtidores.filter(
    id => id !== idSurtidorReportado && surtidores[id].litros > 0
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