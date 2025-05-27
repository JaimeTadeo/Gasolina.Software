import {
    reportarSurtidorSinGasolina,
    verificarDisponibilidadAlternativa
} from '../src/reportarSurtidor.js'; 

describe('Sistema de Reporte de Surtidores', () => {
    let surtidoresMock; 

    beforeEach(() => {
        surtidoresMock = {
            1: { id: 1, nombre: "Surtidor A", litros: 1000, horario: { apertura: "08:00", cierre: "20:00" }, filas: [], calificaciones: { positivas: 0, negativas: 0 } },
            2: { id: 2, nombre: "Surtidor B", litros: 500, horario: { apertura: "09:00", cierre: "18:00" }, filas: [], calificaciones: { positivas: 0, negativas: 0 } },
            3: { id: 3, nombre: "Surtidor C", litros: 0, horario: { apertura: "07:00", cierre: "22:00" }, filas: [], calificaciones: { positivas: 0, negativas: 0 } }
        };
    });

    describe('Reporte básico de surtidor sin gasolina', () => {
        test('debería establecer los litros del surtidor a 0 cuando se reporta sin gasolina', () => {
            expect(surtidoresMock[1].litros).toBe(1000);
            reportarSurtidorSinGasolina(surtidoresMock, 1);
            expect(surtidoresMock[1].litros).toBe(0);
        });

        test('debería lanzar un error si el surtidor reportado no existe', () => {
            expect(() => reportarSurtidorSinGasolina(surtidoresMock, 99))
                .toThrow('Surtidor 99 no encontrado.');
            expect(surtidoresMock[1].litros).toBe(1000);
        });
    });

    describe('Verificación de disponibilidad alternativa', () => {
        test('debería indicar que hay surtidores alternativos disponibles si existen otros con gasolina', () => {
            reportarSurtidorSinGasolina(surtidoresMock, 1); 
            const resultado = verificarDisponibilidadAlternativa(surtidoresMock, 1);
            expect(resultado.alternativoDisponible).toBe(true);
            expect(resultado.mensaje).toContain('Alternativas: Surtidor 2 (Surtidor B) tienen gasolina.');
        });

        test('debería indicar que no hay surtidores alternativos si todos están sin gasolina', () => {
            surtidoresMock[1].litros = 0;
            surtidoresMock[2].litros = 0;
            surtidoresMock[3].litros = 0;

            const resultado = verificarDisponibilidadAlternativa(surtidoresMock, 1); 
            expect(resultado.alternativoDisponible).toBe(false);
            expect(resultado.mensaje).toContain('Actualmente no hay otros surtidores con gasolina.');
        });

        test('debería manejar correctamente cuando solo hay un surtidor y se reporta sin gasolina', () => {
            const singleSurtidorMock = {
                1: { id: 1, nombre: "Surtidor Unico", litros: 100, horario: {}, filas: [], calificaciones: {} }
            };
            reportarSurtidorSinGasolina(singleSurtidorMock, 1); 

            const resultado = verificarDisponibilidadAlternativa(singleSurtidorMock, 1);
            expect(resultado.alternativoDisponible).toBe(false);
            expect(resultado.mensaje).toContain('Actualmente no hay otros surtidores con gasolina.');
        });

        test('debería manejar el caso en que el surtidor reportado no existe', () => {
            const resultado = verificarDisponibilidadAlternativa(surtidoresMock, 99);
            expect(resultado.alternativoDisponible).toBe(false);
            expect(resultado.mensaje).toContain('El Surtidor 99 está sin gasolina. Actualmente no hay otros surtidores con gasolina.');
        });
    });
});