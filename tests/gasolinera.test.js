import { agregarGasolina } from '../src/gasolineraAdmin.js';

describe('Admin - Agregar Gasolina', () => {
  let surtidores;

  beforeEach(() => {
    // Configuración inicial para cada test
    surtidores = {
      1: { id: 1, litros: 1000, nombre: "Surtidor Principal" },
      2: { id: 2, litros: 800, nombre: "Surtidor Secundario" }
    };
  });

  test('debería agregar gasolina a un surtidor existente', () => {
    const resultado = agregarGasolina(surtidores, 1, 500);
    expect(resultado.success).toBe(true);
    expect(surtidores[1].litros).toBe(1500);
    expect(resultado.message).toBe("500 litros agregados al Surtidor Principal");
  });

  test('debería fallar si el surtidor no existe', () => {
    expect(() => agregarGasolina(surtidores, 3, 500))
      .toThrow("Surtidor no encontrado");
  });
});