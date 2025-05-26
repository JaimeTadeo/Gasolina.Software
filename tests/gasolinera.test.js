import { verDisponibilidad } from '../src/gasolinera.js';

describe('Usuario - Ver Disponibilidad', () => {
  const surtidores = {
    1: { id: 1, litros: 1000, nombre: "Surtidor Principal", horario: "08:00-20:00" },
    2: { id: 2, litros: 0, nombre: "Surtidor Secundario", horario: "09:00-18:00" }
  };

 test('debería mostrar disponibilidad correctamente', () => {
  const resultado = verDisponibilidad(surtidores);
  
  // Verificamos por partes en lugar del string completo
  expect(resultado).toMatch(/Surtidor Principal.*1000 litros disponibles/);
  expect(resultado).toMatch(/Surtidor Secundario.*AGOTADO/);
  expect(resultado).toMatch(/Horario: 08:00-20:00/);
});

  test('debería mostrar correctamente cuando no hay surtidores', () => {
    expect(verDisponibilidad({})).toBe("No hay surtidores disponibles");
  });
});