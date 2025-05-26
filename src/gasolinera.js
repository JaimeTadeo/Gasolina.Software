export function verDisponibilidad(surtidores) {
  if (Object.keys(surtidores).length === 0) {
    return "No hay surtidores disponibles";
  }

  let mensaje = "";
  
  Object.values(surtidores).forEach(surtidor => {
    const estado = surtidor.litros > 0 ? 
      `${surtidor.litros} litros disponibles` : 
      "AGOTADO";
      
    mensaje += `⛽ ${surtidor.nombre}: ${estado}\n` +
               `Horario: ${surtidor.horario}\n\n`;
  });

  return mensaje.trim();
}