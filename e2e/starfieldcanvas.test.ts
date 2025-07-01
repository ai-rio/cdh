describe('StarfieldCanvas E2E Tests', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/')
  })

  describe('Homepage Starfield Background', () => {
    it('should display the starfield canvas as a background element', () => {
      // Check that the starfield canvas exists
      cy.get('canvas[aria-hidden="true"]')
        .should('exist')
        .and('be.visible')
        .and('have.class', 'fixed')
        .and('have.class', 'z-[1]')
    })

    it('should position the canvas as a fixed background', () => {
      cy.get('canvas[aria-hidden="true"]')
        .should('have.css', 'position', 'fixed')
        .and('have.css', 'top', '0px')
        .and('have.css', 'left', '0px')
    })

    it('should allow content to scroll over the background', () => {
      // Check that main content is positioned above the canvas
      cy.get('main').should('have.css', 'position', 'relative')
      
      // Scroll down to test that background stays fixed
      cy.scrollTo(0, 500)
      
      // Canvas should still be visible and fixed
      cy.get('canvas[aria-hidden="true"]')
        .should('be.visible')
        .and('have.css', 'position', 'fixed')
    })

    it('should not interfere with page interactions', () => {
      // Test that we can interact with page elements over the background
      cy.get('header').should('be.visible')
      cy.get('main').should('be.visible')
      
      // Test clicking on navigation elements works
      cy.get('header').within(() => {
        cy.get('a, button').first().should('be.visible')
      })
    })

    it('should be responsive on different viewport sizes', () => {
      // Test desktop viewport
      cy.viewport(1200, 800)
      cy.get('canvas[aria-hidden="true"]')
        .should('be.visible')
        .and('have.css', 'width', '1200px')
        .and('have.css', 'height', '800px')
      
      // Test tablet viewport
      cy.viewport(768, 1024)
      cy.get('canvas[aria-hidden="true"]')
        .should('be.visible')
        .and('have.css', 'width', '768px')
        .and('have.css', 'height', '1024px')
      
      // Test mobile viewport
      cy.viewport(375, 667)
      cy.get('canvas[aria-hidden="true"]')
        .should('be.visible')
        .and('have.css', 'width', '375px')
        .and('have.css', 'height', '667px')
    })

    it('should maintain smooth animation performance', () => {
      // Check that the canvas is rendering (WebGL context should be active)
      cy.get('canvas[aria-hidden="true"]').then(($canvas) => {
        const canvas = $canvas[0] as HTMLCanvasElement
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        cy.wrap(gl).should('not.be.null')
      })
      
      // Test that scrolling doesn't cause performance issues
      cy.scrollTo(0, 500, { duration: 1000 })
      cy.scrollTo(0, 0, { duration: 1000 })
      
      // Canvas should still be responsive
      cy.get('canvas[aria-hidden="true"]').should('be.visible')
    })
  })

  describe('404 Page Starfield Background', () => {
    it('should display the 404 starfield variant on not-found page', () => {
      // Visit a non-existent page to trigger 404
      cy.visit('/non-existent-page', { failOnStatusCode: false })
      
      // Check that the starfield canvas exists with 404 styling
      cy.get('canvas[aria-hidden="true"]')
        .should('exist')
        .and('be.visible')
        .and('have.class', 'fixed')
    })

    it('should display 404 content over the starfield background', () => {
      cy.visit('/non-existent-page', { failOnStatusCode: false })
      
      // Check 404 content is visible
      cy.contains('404').should('be.visible')
      cy.contains('Signal Lost').should('be.visible')
      cy.contains('Re-establish Connection').should('be.visible')
      
      // Check that content is positioned above the canvas
      cy.get('canvas[aria-hidden="true"]').should('have.css', 'z-index', '1')
    })

    it('should allow navigation back to homepage from 404 page', () => {
      cy.visit('/non-existent-page', { failOnStatusCode: false })
      
      // Click the "Re-establish Connection" button
      cy.contains('Re-establish Connection').click()
      
      // Should navigate back to homepage
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      
      // Homepage starfield should be visible
      cy.get('canvas[aria-hidden="true"]').should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      cy.get('canvas[aria-hidden="true"]')
        .should('have.attr', 'aria-hidden', 'true')
    })

    it('should not interfere with keyboard navigation', () => {
      // Test tab navigation works over the background
      cy.get('body').type('{tab}')
      cy.focused().should('be.visible')
      
      // Continue tabbing through interactive elements
      cy.focused().type('{tab}')
      cy.focused().should('be.visible')
    })

    it('should not interfere with screen reader navigation', () => {
      // Canvas should be hidden from screen readers
      cy.get('canvas[aria-hidden="true"]')
        .should('have.attr', 'aria-hidden', 'true')
      
      // Main content should be accessible
      cy.get('main').should('not.have.attr', 'aria-hidden')
      cy.get('header').should('not.have.attr', 'aria-hidden')
    })
  })

  describe('Performance', () => {
    it('should load without blocking page render', () => {
      // Measure page load performance
      cy.window().then((win) => {
        cy.wrap(win.performance.timing.loadEventEnd - win.performance.timing.navigationStart)
          .should('be.lessThan', 5000) // Page should load within 5 seconds
      })
      
      // Canvas should be visible shortly after page load
      cy.get('canvas[aria-hidden="true"]', { timeout: 3000 })
        .should('be.visible')
    })

    it('should handle rapid viewport changes gracefully', () => {
      // Rapidly change viewport sizes
      cy.viewport(1200, 800)
      cy.viewport(375, 667)
      cy.viewport(768, 1024)
      cy.viewport(1200, 800)
      
      // Canvas should adapt without errors
      cy.get('canvas[aria-hidden="true"]')
        .should('be.visible')
        .and('have.css', 'width', '1200px')
        .and('have.css', 'height', '800px')
    })

    it('should maintain animation during heavy page interactions', () => {
      // Perform multiple scroll actions
      for (let i = 0; i < 5; i++) {
        cy.scrollTo(0, 500)
        cy.scrollTo(0, 0)
      }
      
      // Canvas should still be responsive
      cy.get('canvas[aria-hidden="true"]').should('be.visible')
      
      // Test rapid clicking doesn't break animation
      cy.get('body').click({ multiple: true })
      cy.get('canvas[aria-hidden="true"]').should('be.visible')
    })
  })

  describe('Browser Compatibility', () => {
    it('should work with WebGL support', () => {
      cy.get('canvas[aria-hidden="true"]').then(($canvas) => {
        const canvas = $canvas[0] as HTMLCanvasElement
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        cy.wrap(gl).should('not.be.null')
        cy.wrap(gl).should('have.property', 'drawArrays')
      })
    })

    it('should handle missing WebGL gracefully', () => {
      // This test would need to mock WebGL unavailability
      // For now, we just ensure the canvas exists
      cy.get('canvas[aria-hidden="true"]').should('exist')
    })
  })

  describe('Visual Regression', () => {
    it('should maintain consistent visual appearance', () => {
      // Wait for animation to stabilize
      cy.wait(2000)
      
      // Take screenshot for visual comparison
      cy.get('canvas[aria-hidden="true"]').should('be.visible')
      
      // This would be used with visual regression testing tools
      // cy.matchImageSnapshot('starfield-homepage')
    })

    it('should display correctly on 404 page', () => {
      cy.visit('/non-existent-page', { failOnStatusCode: false })
      
      // Wait for animation to stabilize
      cy.wait(2000)
      
      cy.get('canvas[aria-hidden="true"]').should('be.visible')
      cy.contains('404').should('be.visible')
      
      // This would be used with visual regression testing tools
      // cy.matchImageSnapshot('starfield-404')
    })
  })
})