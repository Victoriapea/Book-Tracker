describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('Successful Login with Valid Credentials', () => {
    cy.get('input[type="email"]').type('test@test.test');
    cy.get('input[type="password"]').type('test');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/books');
  });

  it('Login Failure with Invalid Credentials', () => {
    cy.get('input[type="email"]').type('invalid-email@example.com');
    cy.get('input[type="password"]').type('invalid-password');
    cy.get('button[type="submit"]').click();
    cy.get('.text-red-500')
    .should('be.visible')
    .and('not.be.empty');
  });
});
