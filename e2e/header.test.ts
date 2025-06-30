describe("Header Component E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/"); // Assuming the header is on the homepage
  });

  it("should display the header on the homepage", () => {
    cy.get(".mission-control-hud").should("be.visible");
    cy.contains("CDH").should("be.visible");
  });

  it("should toggle the navigation when the hamburger icon is clicked", () => {
    cy.get("#command-deck-toggle").should("be.visible").click();
    cy.get("#command-deck").should("have.class", "open");

    cy.get("#command-deck-close").should("be.visible").click();
    cy.get("#command-deck").should("not.have.class", "open");
  });

  it("should navigate to the blog page from the CommandDeck", () => {
    cy.get("#command-deck-toggle").click();
    cy.get("#command-deck").should("have.class", "open");
    cy.wait(500); // Wait for any potential animations to complete
    cy.contains("Blog").scrollIntoView().click({ force: true });
    cy.url().should("include", "/blog");
  });

  it("should display HUD items on desktop", () => {
    cy.viewport(1024, 768); // Desktop viewport
    cy.get(".hud-item").should("have.length", 3);
    cy.contains("Active Deals").should("be.visible");
    cy.contains("Overdue").should("be.visible");
    cy.contains("Key Contacts").should("be.visible");
  });

  // Add more E2E tests for other navigation links and interactions as needed
});
