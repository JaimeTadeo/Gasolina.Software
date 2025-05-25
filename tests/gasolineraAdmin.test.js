import { gestionarSurtidoresFavoritos, notificarDisponibilidad } from "../src/gasolineraNotificaciones.js";

describe("Notificaciones para surtidores favoritos", () => {
    // Datos de prueba comunes
    const surtidores = [
        { id: 1, litros: 0, nombre: "Surtidor Premium" },
        { id: 2, litros: 100, nombre: "Surtidor Regular" },
        { id: 3, litros: 50, nombre: "Surtidor Diesel" }
    ];
    const clienteId = "cliente-123";

    beforeEach(() => {
        // Limpiar el estado antes de cada test
        gestionarSurtidoresFavoritos(clienteId, null, "limpiar");
    });

    describe("gestionarSurtidoresFavoritos", () => {
        it("debería agregar un surtidor a favoritos", () => {
            gestionarSurtidoresFavoritos(clienteId, 2, "agregar");
            const favoritos = gestionarSurtidoresFavoritos(clienteId);
            expect(favoritos).toContain(2);
        });

        it("debería eliminar un surtidor de favoritos", () => {
            gestionarSurtidoresFavoritos(clienteId, 2, "agregar");
            gestionarSurtidoresFavoritos(clienteId, 2, "eliminar");
            const favoritos = gestionarSurtidoresFavoritos(clienteId);
            expect(favoritos).not.toContain(2);
        });

        it("debería limpiar todos los favoritos", () => {
            gestionarSurtidoresFavoritos(clienteId, 1, "agregar");
            gestionarSurtidoresFavoritos(clienteId, 2, "agregar");
            gestionarSurtidoresFavoritos(clienteId, null, "limpiar");
            const favoritos = gestionarSurtidoresFavoritos(clienteId);
            expect(favoritos).toHaveLength(0);
        });

        it("debería devolver lista vacía para cliente sin favoritos", () => {
            const favoritos = gestionarSurtidoresFavoritos("cliente-nuevo");
            expect(favoritos).toEqual([]);
        });
    });

    describe("notificarDisponibilidad", () => {
        it("debería notificar cuando surtidor favorito tiene gasolina", () => {
            const mockCallback = jest.fn();
            gestionarSurtidoresFavoritos(clienteId, 2, "agregar");

            notificarDisponibilidad(surtidores, clienteId, mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(
                expect.stringContaining("Surtidor 2 (Surtidor Regular) tiene gasolina disponible: 100 litros.")
            );
        });

        it("no debería notificar cuando surtidor favorito no tiene gasolina", () => {
            const mockCallback = jest.fn();
            gestionarSurtidoresFavoritos(clienteId, 1, "agregar");

            notificarDisponibilidad(surtidores, clienteId, mockCallback);

            expect(mockCallback).not.toHaveBeenCalled();
        });

        it("debería notificar múltiples surtidores con gasolina", () => {
            const mockCallback = jest.fn();
            gestionarSurtidoresFavoritos(clienteId, 2, "agregar");
            gestionarSurtidoresFavoritos(clienteId, 3, "agregar");

            notificarDisponibilidad(surtidores, clienteId, mockCallback);

            expect(mockCallback).toHaveBeenCalledTimes(2);
        });

        it("no debería notificar si cliente no tiene favoritos", () => {
            const mockCallback = jest.fn();
            notificarDisponibilidad(surtidores, "cliente-sin-favoritos", mockCallback);
            expect(mockCallback).not.toHaveBeenCalled();
        });
    });
});