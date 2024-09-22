describe("BookList Page Tests", () => {
  beforeEach(() => {
    cy.login();
    cy.url().should("include", "/books");
  });

  it("Should display books", () => {
    cy.get(".book-list").should("be.visible");
    cy.get(".book-item").should("have.length.greaterThan", 0);
  });

  describe("Should add a book", () => {
    beforeEach(() => {
      cy.login();
      cy.url().should("include", "/books");
    });

    it("Ajout d'un livre et retour à la bibliothèque", () => {
      cy.contains("Ajouter un livre").click();

      cy.get('input[name="title"]').type("Nouveau Livre");
      cy.get('input[name="author"]').type("Nouvel Auteur");
      cy.get('select[name="status"]').select("À lire");
      cy.get('input[name="startDate"]').type("2024-09-01");
      cy.get('input[name="endDate"]').type("2024-09-30");

      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/books");

      cy.contains("Nouveau Livre").should("be.visible");
      cy.contains("Nouvel Auteur").should("be.visible");
    });
  });

  it("Shoudld edit a book", () => {
    cy.contains("Modifier")
      .parent()
      .find("button")
      .contains("Modifier")
      .click();

    cy.get('input[placeholder="Titre"]').clear().type("Livre Modifié");
    cy.get('input[placeholder="Auteur"]').clear().type("Auteur Modifié");
    cy.get("select").select("En cours");
    cy.get("button").contains("Enregistrer").click();

    cy.contains("Livre Modifié").should("be.visible");
    cy.contains("Auteur Modifié").should("be.visible");
    cy.contains("Statut: En cours").should("be.visible");
  });

  it("Should delete a book", () => {
    cy.contains("Supprimer").should("exist");

    cy.contains("Supprimer")
      .parent()
      .find("button")
      .contains("Supprimer")
      .click();

    cy.on("window:confirm", () => true);

    cy.contains("Livre à Supprimer").should("not.exist");
  });
});
