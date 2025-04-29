import gasolinera from "../src/gasolinera";

describe("Gasolinera con múltiples surtidores", () => {
    it("debería mostrar la disponibilidad de varios surtidores", () => {
        const surtidores = [
            { id: 1, litros: 500 },
            { id: 2, litros: 300 },
            { id: 3, litros: 800 }
        ];

        expect(gasolinera(true, surtidores)).toEqual([
            "Surtidor 1: 500 litros disponibles (1870.00 Bs)",
            "Surtidor 2: 300 litros disponibles (1122.00 Bs)",
            "Surtidor 3: 800 litros disponibles (2992.00 Bs)"
        ]);
    });
});