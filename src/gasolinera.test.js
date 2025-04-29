import gasolinera from "./gasolinera";

describe("Gasolinera", () => {
    it("debería mostrar la disponibilidad de gasolina", () => {
        expect(gasolinera(false)).toEqual("Ver disponibilidad de gasolina");
    });

    it("debería mostrar litros disponibles al hacer click", () => {
        expect(gasolinera(true)).toEqual("1000 litros disponibles");
    });
});
