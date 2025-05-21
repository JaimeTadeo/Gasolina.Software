// cypress/e2e/buscarSurtidor.cy.js

describe('Pruebas de búsqueda de surtidores', () => {
  beforeEach(() => {
    // Visitar la página donde está implementada la funcionalidad
    cy.visit('http://localhost:3000'); // Ajusta la URL según corresponda
  });

  it('Debería encontrar un surtidor por nombre exacto', () => {
    const nombreSurtidor = 'Surtidor Principal Centro';
    
    cy.get('#nombreSurtidorInput').type(nombreSurtidor);
    cy.get('#buscarSurtidorBtn').click();
    
    cy.get('#resultadoBusquedaSurtidor').within(() => {
      cy.contains('Surtidor Encontrado:').should('exist');
      cy.contains(`Nombre: ${nombreSurtidor}`).should('exist');
      cy.contains('ID: 1').should('exist');
      cy.contains('Litros disponibles: 750').should('exist');
    });
  });

  it('Debería encontrar un surtidor ignorando mayúsculas/minúsculas', () => {
    const nombreSurtidor = 'surtidor avenida veloz';
    
    cy.get('#nombreSurtidorInput').type(nombreSurtidor);
    cy.get('#buscarSurtidorBtn').click();
    
    cy.get('#resultadoBusquedaSurtidor').within(() => {
      cy.contains('Surtidor Encontrado:').should('exist');
      cy.contains('Nombre: Surtidor Avenida Veloz').should('exist');
      cy.contains('ID: 2').should('exist');
      cy.contains('Litros disponibles: 400').should('exist');
    });
  });

  it('Debería mostrar mensaje cuando no se encuentra el surtidor', () => {
    const nombreSurtidor = 'Surtidor Inexistente';
    
    cy.get('#nombreSurtidorInput').type(nombreSurtidor);
    cy.get('#buscarSurtidorBtn').click();
    
    cy.get('#resultadoBusquedaSurtidor')
      .should('contain', `No se encontró ningún surtidor con el nombre "${nombreSurtidor}"`);
  });

  it('Debería manejar búsqueda con cadena vacía', () => {
    cy.get('#nombreSurtidorInput').focus().blur(); // Simular dejar el campo vacío
    cy.get('#buscarSurtidorBtn').click();
    
    cy.get('#resultadoBusquedaSurtidor')
      .should('contain', 'No se encontró ningún surtidor con el nombre ""');
  });

  it('Debería mostrar la disponibilidad inicial de surtidores', () => {
    // Verificar que se muestra la disponibilidad inicial
    cy.get('#disponibilidadGasolina').within(() => {
      cy.contains('Disponibilidad Actual:').should('exist');
      cy.contains('Surtidor Principal Centro').should('exist');
      cy.contains('Surtidor Avenida Veloz').should('exist');
    });
  });
});