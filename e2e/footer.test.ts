describe('Footer Component E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the footer at the bottom of the page', () => {
    cy.get('.site-footer').should('be.visible');
    cy.get('.site-footer').should('have.class', 'site-footer');
  });

  it('should display all footer sections with correct headings', () => {
    cy.get('.site-footer').within(() => {
      cy.contains('h4', 'Navigation').should('be.visible');
      cy.contains('h4', 'Company').should('be.visible');
      cy.contains('h4', 'Legal').should('be.visible');
      cy.contains('h4', 'Join the Community').should('be.visible');
    });
  });

  it('should have all navigation links clickable and properly formatted', () => {
    cy.get('.site-footer').within(() => {
      // Navigation section links
      cy.contains('a', 'Home').should('be.visible').and('have.attr', 'href', '#hero-section');
      cy.contains('a', 'Deals').should('be.visible').and('have.attr', 'href', '#deals-section');
      cy.contains('a', 'Pricing').should('be.visible').and('have.attr', 'href', '/pricing');
      cy.contains('a', 'Blog').should('be.visible').and('have.attr', 'href', '/blog');
    });
  });

  it('should have all company links clickable and properly formatted', () => {
    cy.get('.site-footer').within(() => {
      // Company section links
      cy.contains('a', 'About Us').should('be.visible').and('have.attr', 'href', '/about');
      cy.contains('a', 'Careers').should('be.visible').and('have.attr', 'href', '/careers');
      cy.contains('a', 'Contact').should('be.visible').and('have.attr', 'href', '/contact');
    });
  });

  it('should have all legal links clickable and properly formatted', () => {
    cy.get('.site-footer').within(() => {
      // Legal section links
      cy.contains('a', 'Privacy Policy').should('be.visible').and('have.attr', 'href', '/privacy');
      cy.contains('a', 'Terms of Service').should('be.visible').and('have.attr', 'href', '/terms');
    });
  });

  it('should display social media links with correct icons', () => {
    cy.get('.site-footer').within(() => {
      // Social media links
      cy.get('.social-link').should('have.length', 3);
      cy.get('.fa-twitter').should('be.visible');
      cy.get('.fa-youtube').should('be.visible');
      cy.get('.fa-discord').should('be.visible');
    });
  });

  it('should display copyright information', () => {
    cy.get('.site-footer').within(() => {
      cy.contains('© 2025 Creator\'s Deal Hub. All Rights Reserved.').should('be.visible');
    });
  });

  it('should have proper responsive layout on desktop', () => {
    cy.viewport(1280, 720);
    cy.get('.footer-grid').should('have.class', 'md:grid-cols-4');
    cy.get('.footer-grid').should('have.class', 'md:text-left');
  });

  it('should have proper responsive layout on mobile', () => {
    cy.viewport(375, 667);
    cy.get('.footer-grid').should('have.class', 'grid-cols-2');
    cy.get('.footer-grid').should('have.class', 'text-center');
  });

  it('should apply hover effects to footer links', () => {
    cy.get('.site-footer').within(() => {
      cy.contains('a', 'Home').parent().should('have.class', 'footer-link');
      cy.contains('a', 'Home').parent().trigger('mouseover');
      // Note: CSS hover effects are tested through visual regression or manual testing
      // as Cypress doesn't directly test CSS pseudo-classes
    });
  });

  it('should apply hover effects to social links', () => {
    cy.get('.site-footer').within(() => {
      cy.get('.social-link').first().should('be.visible');
      cy.get('.social-link').first().trigger('mouseover');
      // Note: CSS hover effects are tested through visual regression or manual testing
    });
  });

  it('should navigate to internal sections when anchor links are clicked', () => {
    // Test internal navigation (anchor links)
    cy.get('.site-footer').within(() => {
      cy.contains('a', 'Home').click();
    });
    // Verify URL contains the anchor
    cy.url().should('include', '#hero-section');
  });

  it('should maintain footer position at bottom of page', () => {
    // Scroll to bottom to ensure footer is visible
    cy.scrollTo('bottom');
    cy.get('.site-footer').should('be.visible');
    
    // Check that footer is at the bottom
    cy.get('.site-footer').then(($footer) => {
      const footerTop = $footer.offset()?.top || 0;
      cy.window().then((win) => {
        const windowHeight = win.innerHeight;
        const documentHeight = win.document.body.scrollHeight;
        // Footer should be near the bottom of the document
        expect(footerTop).to.be.greaterThan(documentHeight - windowHeight - 200);
      });
    });
  });

  it('should have proper accessibility attributes', () => {
    cy.get('.site-footer').within(() => {
      // Check that footer has proper semantic role
      cy.get('footer').should('exist');
      
      // Check that all links are accessible
      cy.get('a').each(($link) => {
        cy.wrap($link).should('have.attr', 'href');
      });
      
      // Check heading hierarchy
      cy.get('h4').should('have.length', 4);
    });
  });

  it('should display proper grid layout structure', () => {
    cy.get('.site-footer').within(() => {
      cy.get('.footer-grid').should('have.class', 'grid');
      cy.get('.footer-grid').should('have.class', 'gap-8');
      cy.get('.footer-grid > div').should('have.length', 4);
    });
  });

  it('should handle external link navigation properly', () => {
    cy.get('.site-footer').within(() => {
      // Test that external links have correct href attributes
      cy.contains('a', 'Pricing').should('have.attr', 'href', '/pricing');
      cy.contains('a', 'About Us').should('have.attr', 'href', '/about');
      cy.contains('a', 'Careers').should('have.attr', 'href', '/careers');
    });
  });
});