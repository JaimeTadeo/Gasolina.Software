import numeros from "./NumerosRomanos.js";

describe("Numeros Romanos", () => {
    it("debería convertir 1 a I", () => {
        expect(numeros(1)).toEqual("I");
    });

    it("debería convertir 2 a II", () => {
        expect(numeros(2)).toEqual("II");
    });

    it("debería convertir 3 a III", () => {
        expect(numeros(3)).toEqual("III");
    });

    it("debería convertir 4 a IV", () => {
        expect(numeros(4)).toEqual("IV");
    });

    it("debería convertir 5 a V", () => {
        expect(numeros(5)).toEqual("V");
    });

    it("debería convertir 6 a VI", () => {
        expect(numeros(6)).toEqual("VI");
    });

    it("debería convertir 9 a IX", () => {
        expect(numeros(9)).toEqual("IX");
    });

    it("debería convertir 10 a X", () => {
        expect(numeros(10)).toEqual("X");
    });

    it("debería convertir 20 a XX", () => {
        expect(numeros(20)).toEqual("XX");
    });

    it("debería convertir 40 a XL", () => {
        expect(numeros(40)).toEqual("XL");
    });

    it("debería convertir 50 a L", () => {
        expect(numeros(50)).toEqual("L");
    });

    it("debería convertir 90 a XC", () => {
        expect(numeros(90)).toEqual("XC");
    });

    it("debería convertir 100 a C", () => {
        expect(numeros(100)).toEqual("C");
    });

    it("debería convertir 400 a CD", () => {
        expect(numeros(400)).toEqual("CD");
    });

    it("debería convertir 500 a D", () => {
        expect(numeros(500)).toEqual("D");
    });

    it("debería convertir 900 a CM", () => {
        expect(numeros(900)).toEqual("CM");
    });

    it("debería convertir 1000 a M", () => {
        expect(numeros(1000)).toEqual("M");
    });

    it("debería convertir lo que sea", () => {
        expect(numeros(1998)).toEqual("MCMXCVIII");
    });
});
