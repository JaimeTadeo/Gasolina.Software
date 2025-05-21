import { filtrarSurtidoresPorZona } from "../src/gasolineraZona.js";

describe("Filtrado de Surtidores por Zona", () => {
    const surtidoresMock = {
        1: { id: 1, litros: 1000, zona: "norte" },
        2: { id: 2, litros: 800, zona: "sur" },
        3: { id: 3, litros: 500, zona: "norte" },
        4: { id: 4, litros: 1200, zona: "este" },
    };

    test("debería filtrar surtidores por una zona específica", () => {
        const surtidoresNorte = filtrarSurtidoresPorZona(surtidoresMock, "norte");
        expect(surtidoresNorte).toHaveLength(2);
        expect(surtidoresNorte.map(s => s.id)).toEqual(expect.arrayContaining([1, 3]));
        expect(surtidoresNorte.every(s => s.zona === "norte")).toBe(true);
    });

    test("debería devolver todos los surtidores si la zona es 'todas'", () => {
        const todosSurtidores = filtrarSurtidoresPorZona(surtidoresMock, "todas");
        expect(todosSurtidores).toHaveLength(4);
        expect(todosSurtidores.map(s => s.id)).toEqual(expect.arrayContaining([1, 2, 3, 4]));
    });

    test("debería devolver todos los surtidores si la zona es nula o indefinida", () => {
        let result = filtrarSurtidoresPorZona(surtidoresMock, null);
        expect(result).toHaveLength(4);

        result = filtrarSurtidoresPorZona(surtidoresMock, undefined);
        expect(result).toHaveLength(4);
    });

    test("debería devolver un array vacío si no hay surtidores en la zona especificada", () => {
        const surtidoresOeste = filtrarSurtidoresPorZona(surtidoresMock, "oeste");
        expect(surtidoresOeste).toHaveLength(0);
    });

    test("debería manejar un objeto de surtidores vacío", () => {
        const surtidoresVacios = {};
        const result = filtrarSurtidoresPorZona(surtidoresVacios, "norte");
        expect(result).toHaveLength(0);
    });
});