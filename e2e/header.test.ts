describe("Header Component E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/"); // Assuming the header is on the homepage
  });

  it("should display the header on the homepage", () => {
    cy.get(".mission-control-hud").should("be.visible");
    cy.contains("CDH").should("be.visible");
  });

  it("should toggle the mobile navigation when the hamburger icon is clicked", () => {
    // Ensure we are in a mobile viewport for the hamburger to be visible
    cy.viewport(375, 667); // iPhone X size

    cy.get("#command-deck-toggle").should("be.visible").click();
    cy.get("#command-deck").should("be.visible");

    cy.get("#command-deck-close").should("be.visible").click();
    cy.get("#command-deck").should("not.exist");
  });

  it("should navigate to the blog page from the CommandDeck", () => {
    cy.viewport(375, 667);
    cy.get("#command-deck-toggle").click();
    cy.get("#command-deck").should("be.visible"); // Ensure CommandDeck is visible
    cy.wait(500); // Wait for any potential animations to complete
    cy.contains("Blog").scrollIntoView().click({ force: true });
    cy.url().should("include", "/blog");
  });

  // Add more E2E tests for other navigation links and interactions as needed
});
