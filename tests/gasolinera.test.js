import gasolinera from "../src/gasolinera";

describe("Gasolinera", () => {
    it("debería mostrar la disponibilidad de gasolina", () => {
        expect(gasolinera(false, 500)).toEqual("Ver disponibilidad de gasolina");
    });

    it("debería mostrar litros disponibles al hacer click", () => {
        expect(gasolinera(true, 500)).toEqual("500 litros disponibles (1870.00 Bs)");
    });

    it("debería mostrar litros diferentes si cambia la cantidad", () => {
        expect(gasolinera(true, 300)).toEqual("300 litros disponibles (1122.00 Bs)");
        expect(gasolinera(true, 800)).toEqual("800 litros disponibles (2992.00 Bs)");
    });
});
