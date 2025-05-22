<reference types="Cypress" />

describe('Gasolinera E2E Tests', () => {
    beforeEach(() => {
        cy.visit('index.html');
    });

    it('should display initial availability when "Ver disponibilidad de gasolina" is clicked', () => {
        cy.get('#mostrarDisponibilidad').click();
        cy.get('#resultado').should('contain', 'Surtidor 1: 1000 litros disponibles');
        cy.get('#resultado').should('contain', 'Surtidor 2: 800 litros disponibles');
    });

    it('should filter gas pumps by zone correctly', () => {
        cy.get('#zonaSeleccionada').select('norte');
        cy.get('#filtrarPorZona').click();
        cy.get('#resultadoFiltroZona').should('contain', 'Surtidor 1:');
        cy.get('#resultadoFiltroZona').should('contain', 'Surtidor 3:'); 
        cy.get('#resultadoFiltroZona').should('not.contain', 'Surtidor 2:');

        cy.get('#zonaSeleccionada').select('sur');
        cy.get('#filtrarPorZona').click();
        cy.get('#resultadoFiltroZona').should('not.contain', 'Surtidor 1:');
        cy.get('#resultadoFiltroZona').should('contain', 'Surtidor 2:');
    });

    it('should show all pumps when "Todas las Zonas" is selected', () => {
        cy.get('#zonaSeleccionada').select('todas');
        cy.get('#filtrarPorZona').click();
        cy.get('#resultadoFiltroZona').should('contain', 'Surtidor 1:');
        cy.get('#resultadoFiltroZona').should('contain', 'Surtidor 2:');

    });

    it('should display a ticket number when "Solicitar Ticket" is clicked', () => {
        cy.get('#solicitarTicket').click();
        cy.get('#numeroTicket').should('not.contain', '-'); 
        cy.get('#numeroTicket').should('have.text', '1'); 
        cy.get('#mensajeTicket').should('contain', 'Ticket generado.');
    });

    it('should allow using a generated ticket', () => {
        cy.get('#solicitarTicket').click();
        cy.get('#usarTicketBtn').click();
        cy.get('#mensajeTicket').should('contain', 'Ticket 1 usado correctamente.');
        cy.get('#numeroTicket').should('have.text', '-'); 
        cy.get('#usarTicketBtn').should('be.disabled'); 
    });

    it('should update estimated time for tickets', () => {
        cy.get('#solicitarTicket').click(); 
        cy.get('#solicitarTicket').click(); 
        cy.get('#solicitarTicket').click(); 
        cy.get('#tiempoEstimado').should('contain', 'Tiempo estimado: 6 minutos');
        

        cy.get('#usarTicketBtn').click(); 
        cy.get('#tiempoEstimado').should('contain', 'Tiempo estimado: 3 minutos'); 
    });

    it('should allow admin to add gasoline and update display', () => {
        cy.get('section.seccion-admin #surtidorSeleccionado').eq(0).select('1'); 
        cy.get('#cantidadLitros').type('50');
        cy.get('#agregarGasolina').click();
        cy.get('#error').should('contain', 'Gasolina agregada exitosamente a Surtidor 1.');

        cy.get('#mostrarDisponibilidad').click();
        cy.get('#resultado').should('contain', 'Surtidor 1: 1050 litros disponibles');
    });
});