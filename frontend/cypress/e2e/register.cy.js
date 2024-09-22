describe("Registration Page Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/register");
  });

  it("Successful Registration with Valid Credentials", () => {
    cy.get('input[type="text"]').type("johnyy");
    cy.get('input[type="email"]').type("johny@gmail.com");
    cy.get('input[type="password"]').type("test");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/books");
  });

  it("Registration Failure with Existing Email", () => {
    cy.get('input[type="text"]').type("john");
    cy.get('input[type="email"]').type("test@test.test");
    cy.get('input[type="password"]').type("123");
    cy.get('button[type="submit"]').click();
    cy.get(".text-red-500").should("be.visible").and("not.be.empty");
  });
});
