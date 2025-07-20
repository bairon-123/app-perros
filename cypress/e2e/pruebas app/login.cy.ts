describe('Login Pelupet', () => {
  beforeEach(() => {
    cy.viewport(375, 667); 
    cy.visit('http://localhost:8100/login');
  });

  it('Login exitoso con usuario de prueba', () => {
    cy.get('ion-input input').eq(0).type('bairon@gmail.com');
    cy.get('ion-input input').eq(1).type('123456');
    cy.get('[data-cy="btn-login"]').click();
    cy.url({ timeout: 5000 }).should('include', '/home');
    cy.contains('¡Bienvenido a Pelupet!').should('exist');
  });
});