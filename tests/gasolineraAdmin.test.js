import { recargarGasolina } from "../src/gasolineraAdmin.js";


describe("Recargar gasolina en surtidores", () => {
    it("debería recargar litros correctamente a un surtidor", () => {
        const surtidores = [
            { id: 1, litros: 500 },
            { id: 2, litros: 300 }
        ];

        const recargas = [
            { id: 1, litros: 100 },
            { id: 2, litros: 50 }
        ];
        
        const resultado = recargarGasolina(surtidores, recargas);

        expect(resultado).toEqual([
            { id: 1, litros: 600 }, 
            { id: 2, litros: 350 }  
        ]);
    });
});
