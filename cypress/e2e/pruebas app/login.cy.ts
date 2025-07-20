describe('Login Pelupet', () => {
  beforeEach(() => {
    cy.viewport(375, 667); 
    cy.visit('http://localhost:8100/login');
    cy.wait(500);
  });

  it('Login exitoso con usuario de prueba', () => {
    cy.get('ion-input input').eq(0).type('bairon@gmail.com');
    cy.wait(500);
    cy.get('ion-input input').eq(1).type('123456');
    cy.wait(500); 
    cy.get('[data-cy="btn-login"]').click();
    cy.wait(500);  
    cy.url({ timeout: 5000 }).should('include', '/home');
    cy.wait(500);
    cy.contains('¡Bienvenido a Pelupet!').should('exist');
  });
});