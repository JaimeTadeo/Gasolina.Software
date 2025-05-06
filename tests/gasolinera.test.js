import { 
    reportarFila, 
    obtenerReporteFilas, 
    notificarAdministrador,
    calificarSurtidor,       // Añadir estas líneas
    obtenerCalificaciones    // <-- Importación faltante
} from "../src/gasolineraAdmin.js";

// ... (código existente)

describe("Sistema de calificaciones", () => {
    let surtidores;

    beforeEach(() => {
        // Configuración corregida (no usar null)
        surtidores = {
            1: { litros: 1000, calificaciones: { positivas: 0, negativas: 0 } },
            2: { litros: 800, calificaciones: { positivas: 3, negativas: 1 } }
        };
    });

    test("Calificación positiva actualiza contador", () => {
        calificarSurtidor(surtidores, 1, true);
        expect(surtidores[1].calificaciones.positivas).toBe(1); // ✅
    });

    test("Calificación negativa en surtidor existente", () => {
        calificarSurtidor(surtidores, 2, false);
        expect(surtidores[2].calificaciones.negativas).toBe(2); // ✅
    });

    test("Obtener calificaciones de surtidor sin datos", () => {
        const result = obtenerCalificaciones(surtidores, 3);
        expect(result).toEqual({ positivas: 0, negativas: 0 }); // ✅
    });
});