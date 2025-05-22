import { 
    reportarFila, 
    obtenerReporteFilas, 
    notificarAdministrador,
    calificarSurtidor,       
    obtenerCalificaciones , 
    obtenerSurtidorMasLleno

} from "../src/gasolineraAdmin.js";



describe("Sistema de calificaciones", () => {
    let surtidores;

    beforeEach(() => {
       
        surtidores = {
            1: { litros: 1000, calificaciones: { positivas: 0, negativas: 0 } },
            2: { litros: 800, calificaciones: { positivas: 3, negativas: 1 } }
        };
    });

    test("Calificación positiva actualiza contador", () => {
        calificarSurtidor(surtidores, 1, true);
        expect(surtidores[1].calificaciones.positivas).toBe(1); 
    });

    test("Calificación negativa en surtidor existente", () => {
        calificarSurtidor(surtidores, 2, false);
        expect(surtidores[2].calificaciones.negativas).toBe(2); 
    });

    test("Obtener calificaciones de surtidor sin datos", () => {
        const result = obtenerCalificaciones(surtidores, 3);
        expect(result).toEqual({ positivas: 0, negativas: 0 }); 
    });
    describe("Notificaciones de surtidores llenos", () => {
        const surtidoresMock = {
            1: { filas: [{ personas: 3 }, { personas: 5 }] },
            2: { filas: [{ personas: 2 }] }
        };
    
        test("Identificar surtidor más lleno", () => {
            const resultado = obtenerSurtidorMasLleno(surtidoresMock);
            expect(resultado.id).toBe("1");
            expect(resultado.personas).toBe(5);
        });
    
        test("Manejar surtidores sin filas", () => {
            const surtidoresVacios = { 3: { filas: [] } };
            const resultado = obtenerSurtidorMasLleno(surtidoresVacios);
            expect(resultado.personas).toBe(0);
        });
    });
});