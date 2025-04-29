import { agregarGasolina } from "../src/gasolineraAdmin.js";
import {notificarCamionLlegado} from "../src/gasolineraAdmin.js";

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