import gasolinera from "../src/gasolinera";

describe("Gasolinera", () => {
    it("debería mostrar la disponibilidad de gasolina", () => {
        expect(gasolinera(false, 500)).toEqual("Ver disponibilidad de gasolina");
    });

    it("debería mostrar litros disponibles al hacer click", () => {
        expect(gasolinera(true, 500)).toEqual("500 litros disponibles");
    });
});
