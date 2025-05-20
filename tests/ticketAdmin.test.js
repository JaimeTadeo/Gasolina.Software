import {
    crearTicket,
    cambiarEstadoTicket,
    obtenerEstadoTicket,
    obtenerTodosLosTickets
} from '../src/ticketAdmi.js';

describe("Gestión de Tickets", () => {
    let tickets;

    beforeEach(() => {
        tickets = {};
    });

    test("Debería crear un ticket correctamente", () => {
        crearTicket(tickets, "T1", "Problema con surtidor");
        expect(tickets["T1"]).toBeDefined();
        expect(tickets["T1"].estado).toBe("pendiente");
    });

    test("No debería permitir crear un ticket duplicado", () => {
        crearTicket(tickets, "T1", "Descripción");
        expect(() => crearTicket(tickets, "T1", "Otra")).toThrow();
    });

    test("Debería cambiar el estado del ticket a 'en proceso'", () => {
        crearTicket(tickets, "T1", "Descripción");
        cambiarEstadoTicket(tickets, "T1", "en proceso");
        expect(tickets["T1"].estado).toBe("en proceso");
    });

    test("No debería cambiar el estado si el ticket no existe", () => {
        expect(() => cambiarEstadoTicket(tickets, "T999", "atendiendo")).toThrow();
    });

    test("No debería aceptar un estado inválido", () => {
        crearTicket(tickets, "T1", "Descripción");
        expect(() => cambiarEstadoTicket(tickets, "T1", "resuelto")).toThrow("Estado inválido");
    });

    test("Debería obtener el estado correcto del ticket", () => {
        crearTicket(tickets, "T1", "Algo");
        expect(obtenerEstadoTicket(tickets, "T1")).toBe("pendiente");
    });

    test("Debería lanzar error si se consulta estado de ticket inexistente", () => {
        expect(() => obtenerEstadoTicket(tickets, "noexiste")).toThrow();
    });

    test("Debería devolver todos los tickets", () => {
        crearTicket(tickets, "T1", "A");
        crearTicket(tickets, "T2", "B");
        const todos = obtenerTodosLosTickets(tickets);
        expect(Object.keys(todos)).toHaveLength(2);
    });
});
