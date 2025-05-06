import { reportarFila, obtenerReporteFilas, notificarAdministrador } from "../src/gasolineraAdmin.js";

describe("Gestión de filas", () => {
    let surtidores;

    beforeEach(() => {
        // Configuración limpia para cada test
        surtidores = {
            1: { litros: 1000, filas: [] },
            2: { litros: 800, filas: [] }
        };
    });

    test("Reportar fila válida actualiza el estado", () => {
        // Ejecutar
        reportarFila(surtidores, 1, 5);
        
        // Verificar
        const estado = obtenerReporteFilas(surtidores);
        expect(estado[1].filas[0].personas).toBe(5); // ✅
    });

    test("Reportar número negativo lanza error", () => {
        // Verificar que se lanza el error
        expect(() => reportarFila(surtidores, 2, -3))
            .toThrow("Número de personas inválido"); // ✅
    });

    test("Notificación al administrador registra en consola", () => {
        // Mock de console.log
        const consoleSpy = jest.spyOn(console, "log");
        
        // Ejecutar
        notificarAdministrador("Mensaje de prueba");
        
        // Verificar
        expect(consoleSpy).toHaveBeenCalledWith("[ADMIN] Mensaje de prueba"); // ✅
    });
});