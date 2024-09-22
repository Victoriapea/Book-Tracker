describe("Navigation Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  //Desktop tests
  it("Navigates to Login Page", () => {
    cy.viewport("macbook-15");
    cy.contains("Connexion").click();
    cy.url().should("include", "/login");
  });

  it("Navigates to Register Page", () => {
    cy.viewport("macbook-15");
    cy.contains("S'inscrire").click();
    cy.url().should("include", "/register");
  });

  it("Navigates to BookList Page", () => {
    cy.viewport("macbook-15");
    cy.login();
    cy.contains("Bibliothèque").click();
    cy.url().should("include", "/books");
  });

  it("Navigates to Reading Stats Page", () => {
    cy.viewport("macbook-15");
    cy.login();
    cy.contains("Tableau De Bord").click();
    cy.url().should("include", "/stats");
  });
});
