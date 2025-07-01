describe('CommandDeck Component E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should be hidden by default', () => {
    cy.get('#command-deck').should('not.exist');
  });

  it('should open when the toggle button is clicked', () => {
    cy.get('#command-deck-toggle').click();
    cy.wait(500);
    cy.get('#command-deck').should('have.class', 'open');
  });

  it('should close when the close button is clicked', () => {
    cy.get('#command-deck-toggle').click();
    cy.wait(500);
    cy.get('#command-deck').should('have.class', 'open');
    cy.get('#command-deck-close').click();
    cy.get('#command-deck').should('not.exist');
  });

  it('should contain the correct navigation links', () => {
    cy.get('#command-deck-toggle').click();
    cy.wait(500);
    cy.get('#command-deck').should('have.class', 'open');
    cy.contains('Blog').should('be.visible');
    cy.contains('Pricing').should('be.visible');
    cy.contains('About Us').should('be.visible');
    cy.contains('Login').should('be.visible');
  });

  it('should navigate to the correct pages', () => {
    cy.get('#command-deck-toggle').click();
    cy.wait(500);
    cy.get('#command-deck').should('have.class', 'open');
    cy.contains('Blog').click({ force: true });
    cy.url().should('include', '/blog');

    cy.visit('/');
    cy.get('#command-deck-toggle').click();
    cy.wait(500);
    cy.get('#command-deck').should('have.class', 'open');
    cy.contains('Pricing').click({ force: true });
    cy.url().should('include', '/pricing');

    cy.visit('/');
    cy.get('#command-deck-toggle').click();
    cy.wait(500);
    cy.get('#command-deck').should('have.class', 'open');
    cy.contains('About Us').click({ force: true });
    cy.url().should('include', '/about');
  });
});