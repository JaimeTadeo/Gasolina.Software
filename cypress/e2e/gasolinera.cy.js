/// <reference types="Cypress" />

describe('Gasolinera E2E Tests', () => {
    beforeEach(() => {
        // Visit the application before each test
        cy.visit('index.html');
    });

    it('should display initial availability when "Ver disponibilidad de gasolina" is clicked', () => {
        cy.get('#mostrarDisponibilidad').click();
        cy.get('#resultado').should('contain', 'Surtidor 1: 1000 litros disponibles');
        cy.get('#resultado').should('contain', 'Surtidor 2: 800 litros disponibles');
    });

    it('should filter gas pumps by zone correctly', () => {
        // Select 'Zona Norte'
        cy.get('#zonaSeleccionada').select('norte');
        cy.get('#filtrarPorZona').click();
        cy.get('#resultadoFiltroZona').should('contain', 'Surtidor 1:');
        cy.get('#resultadoFiltroZona').should('contain', 'Surtidor 3:'); // Assuming you've added Surtidor 3 in 'norte' for comprehensive testing
        cy.get('#resultadoFiltroZona').should('not.contain', 'Surtidor 2:');

        // Select 'Zona Sur'
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
        // If you add more surtidores for other zones, add assertions for them too.
    });

    it('should display a ticket number when "Solicitar Ticket" is clicked', () => {
        cy.get('#solicitarTicket').click();
        cy.get('#numeroTicket').should('not.contain', '-'); // Should change from default '-'
        cy.get('#numeroTicket').should('have.text', '1'); // First ticket generated should be 1
        cy.get('#mensajeTicket').should('contain', 'Ticket generado.');
    });

    it('should allow using a generated ticket', () => {
        cy.get('#solicitarTicket').click();
        cy.get('#usarTicketBtn').click();
        cy.get('#mensajeTicket').should('contain', 'Ticket 1 usado correctamente.');
        cy.get('#numeroTicket').should('have.text', '-'); // Ticket number should reset
        cy.get('#usarTicketBtn').should('be.disabled'); // Button should be disabled after use
    });

    it('should update estimated time for tickets', () => {
        cy.get('#solicitarTicket').click(); // Ticket 1, 0 min
        cy.get('#solicitarTicket').click(); // Ticket 2, 3 min
        cy.get('#solicitarTicket').click(); // Ticket 3, 6 min
        cy.get('#tiempoEstimado').should('contain', 'Tiempo estimado: 6 minutos');
        
        // Use a ticket, time should reduce
        cy.get('#usarTicketBtn').click(); // Use Ticket 3, now 2 people before it
        cy.get('#tiempoEstimado').should('contain', 'Tiempo estimado: 3 minutos'); 
    });

    // Example: Test adding gasoline functionality (Admin side)
    it('should allow admin to add gasoline and update display', () => {
        cy.get('section.seccion-admin #surtidorSeleccionado').eq(0).select('1'); // Select Surtidor 1
        cy.get('#cantidadLitros').type('50');
        cy.get('#agregarGasolina').click();
        cy.get('#error').should('contain', 'Gasolina agregada exitosamente a Surtidor 1.');

        // Verify that the new amount is reflected in the user view
        cy.get('#mostrarDisponibilidad').click();
        cy.get('#resultado').should('contain', 'Surtidor 1: 1050 litros disponibles');
    });
});