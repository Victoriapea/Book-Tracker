// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", () => {
  const email = "test@test.test";
  const password = "test";

  cy.visit("http://localhost:5173/login");

  cy.get('input[type="email"]')
    .should("be.visible")
    .should("not.be.disabled")
    .type(email);

  cy.get('input[type="password"]')
    .should("be.visible")
    .should("not.be.disabled")
    .type(password);

  cy.get("button").contains("Se connecter").click();

  cy.url().should("include", "/books");
});
