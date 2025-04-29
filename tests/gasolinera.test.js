import gasolinera from "../src/gasolinera"; // o "./gasolinera" si está en la misma carpeta

describe("Gasolinera", () => {
    it("debería mostrar la disponibilidad de gasolina", () => {
        expect(gasolinera(false, 500)).toEqual("Ver disponibilidad de gasolina");
    });

    it("debería mostrar litros disponibles al hacer click", () => {
        expect(gasolinera(true, 500)).toEqual("500 litros disponibles");
    });

    it("debería mostrar litros diferentes si cambia la cantidad", () => {
        expect(gasolinera(true, 300)).toEqual("300 litros disponibles");
        expect(gasolinera(true, 800)).toEqual("800 litros disponibles");
    });
});
