export function agregarGasolina(surtidores, surtidorId, litros) {
  if (!surtidores[surtidorId]) {
    throw new Error("Surtidor no encontrado");
  }

  surtidores[surtidorId].litros += litros;
  
  return {
    success: true,
    message: `${litros} litros agregados al ${surtidores[surtidorId].nombre}`
  };
}