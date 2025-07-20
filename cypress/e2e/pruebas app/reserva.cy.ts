describe('Reserva Pelupet con sesión activa', () => {
  beforeEach(() => {
    cy.viewport(375, 667); 
    cy.visit('http://localhost:8100/login');
    cy.get('ion-input input').eq(0).type('bairon@gmail.com', { force: true });
    cy.get('ion-input input').eq(1).type('123456', { force: true });
    cy.get('[data-cy="btn-login"]').click();
    cy.url().should('include', '/home');

    cy.visit('http://localhost:8100/reservas');
    cy.url().should('include', '/reservas');
    cy.contains('Reserva Pelupet!').should('exist');
  });

  it('Debe completar el formulario, seleccionar fecha/hora y agendar reserva', () => {
    cy.get('[data-cy="input-nombre"] input').type('Firulais', { force: true });
    cy.get('[data-cy="input-raza"] input').type('Poodle', { force: true });

    // Tamaño: abrir y cancelar
    cy.get('[data-cy="select-tamano"]').click({ force: true });
    cy.contains('Cancel').click({ force: true });
    cy.get('.action-sheet-wrapper').should('not.exist');

    // Servicio: abrir, seleccionar y cancelar
    cy.get('[data-cy="select-servicio"]').click({ force: true });
    cy.contains('Completo').click({ force: true });
    cy.contains('Cancel').click({ force: true });
    cy.get('.action-sheet-wrapper').should('not.exist');

    cy.get('[data-cy="input-peso"] input').type('7', { force: true });
    cy.get('[data-cy="textarea-indicaciones"] textarea').type('Cortar con cuidado', { force: true });

    // Selección de fecha y hora específica
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 30);
    const isoValue = targetDate.toISOString();

    cy.wait(500);
    cy.get('[data-cy="input-fecha"] input').click({ force: true });
    cy.wait(500);
    cy.get('ion-datetime').then($el => {
      $el[0].value = isoValue;
      $el[0].dispatchEvent(new Event('ionChange'));
    });

    // Guardar reserva
    cy.get('[data-cy="btn-reservar"]').click();
  });
});
