import { agregarGasolina } from "../src/gasolineraAdmin.js";
import {notificarCamionLlegado} from "../src/gasolineraAdmin.js";
import { modificarHorario } from "../src/gasolineraAdmin.js";

describe("Administrador de Gasolinera", () => {
    it("debería agregar gasolina a un surtidor existente", () => {
        const surtidores = [{ id: 1, litros: 500 }];
        agregarGasolina(surtidores, 1, 200);

        expect(surtidores[0].litros).toBe(700); 
    });

    it("debería lanzar error si el surtidor no existe", () => {
        const surtidores = [{ id: 1, litros: 500 }];
        
        expect(() => {
            agregarGasolina(surtidores, 2, 100);
        }).toThrow("Surtidor no encontrado");
    });

    it("debería lanzar error si el valor a agregar no es un número válido", () => {
        const surtidores = [{ id: 1, litros: 500 }];
        
        expect(() => {
            agregarGasolina(surtidores, 1, "noEsUnNumero");
        }).toThrow("Cantidad inválida");
    });

    it("debería lanzar error si el valor a agregar es negativo", () => {
        const surtidores = [{ id: 1, litros: 500 }];
        
        expect(() => {
            agregarGasolina(surtidores, 1, -50);
        }).toThrow("Cantidad inválida");
    });
});

describe("Gasolinera Admin", () => {
    it("debería notificar que el camión llegó", () => {
        const mockCallback = jest.fn();
        notificarCamionLlegado(mockCallback);
        expect(mockCallback).toHaveBeenCalledWith("El camión de gasolina llegó 🚛");
    });
});

describe("Gasolinera Admin - Modificar horario", () => {
    const surtidores = {
        1: { litros: 1000, horario: { apertura: "08:00", cierre: "20:00" } },
    };

    it("debería modificar los horarios correctamente", () => {
        modificarHorario(surtidores, 1, "07:00", "19:00");
        expect(surtidores[1].horario.apertura).toBe("07:00");
        expect(surtidores[1].horario.cierre).toBe("19:00");
    });

    it("debería lanzar error si el horario de apertura es después o igual al de cierre", () => {
        expect(() => modificarHorario(surtidores, 1, "21:00", "20:00")).toThrow("El horario de apertura debe ser antes del de cierre");
    });

    it("debería lanzar error si el surtidor no existe", () => {
        expect(() => modificarHorario(surtidores, 999, "07:00", "19:00")).toThrow("Surtidor no encontrado");
    });
});
