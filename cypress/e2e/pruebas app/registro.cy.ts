describe('Login Pelupet', () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.visit('http://localhost:8100/login');
  });

  it('Registro exitoso de nuevo usuario', () => {
    const nombre = 'Usuario Test';
    const correo = `test${Date.now()}@correo.com`; // único
    const contrasena = '123456';

    cy.get('ion-input input').eq(0).type(nombre);
    cy.get('ion-input input').eq(1).type(correo);
    cy.get('ion-input input').eq(2).type(contrasena);

    cy.get('[data-cy="btn-registro"]').click();

    // Esperar redirección y alerta
    cy.url({ timeout: 5000 }).should('include', '/login');

    cy.get('ion-alert')
      .find('button.alert-button')
      .contains('OK')
      .click(); // Cierra alerta
  });
});
