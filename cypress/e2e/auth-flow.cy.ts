describe('Authentication Flow', () => {
  beforeEach(() => {
    // Assuming the AuthModal is triggered by clicking a login button on the homepage
    cy.visit('/'); 
    cy.get('button').contains('Login').click(); // Adjust selector as needed
    cy.get('.modal').should('be.visible');
  });

  it('should allow a new user to register and then log in', () => {
    const timestamp = new Date().getTime();
    const email = `testuser-${timestamp}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    // Switch to Sign Up view
    cy.get('.auth-toggle-button').contains('Sign Up').click();
    cy.get('.signup-view').should('not.have.class', 'hidden-form');

    // Fill registration form
    cy.get('input[placeholder="Full Name"]').type(name);
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Password"]').type(password);
    cy.get('button').contains('Create My Account').click();

    // Assert successful registration and redirection
    cy.url().should('include', '/dashboard'); // Assuming redirection to /dashboard
    cy.get('.modal').should('not.exist'); // Modal should be closed

    // Log out to test login flow
    // This assumes there's a logout mechanism, adjust as needed
    // cy.get('button').contains('Logout').click(); 
    // cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Re-open modal for login
    cy.visit('/');
    cy.get('button').contains('Login').click();
    cy.get('.modal').should('be.visible');

    // Fill login form
    cy.get('.auth-toggle-button').contains('Sign In').click(); // Ensure Sign In view
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Password"]').type(password);
    cy.get('button').contains('Launch Command Center').click();

    // Assert successful login and redirection
    cy.url().should('include', '/dashboard');
    cy.get('.modal').should('not.exist');
  });

  it('should display error for invalid login credentials', () => {
    // Fill login form with invalid credentials
    cy.get('input[placeholder="Email"]').type('invalid@example.com');
    cy.get('input[placeholder="Password"]').type('wrongpassword');
    cy.get('button').contains('Launch Command Center').click();

    // Assert error message is displayed
    cy.get('p').contains('Login failed').should('be.visible'); // Adjust error message text as per your implementation
    cy.url().should('not.include', '/dashboard'); // Should not redirect
  });

  it('should display error for existing user registration', () => {
    // This test requires a user to already exist in the system.
    // For a real scenario, you might seed the database or use a known existing user.
    const existingEmail = 'existing@example.com'; // Replace with an actual existing email in your test environment
    const existingPassword = 'password123';
    const existingName = 'Existing User';

    // First, ensure the user exists (e.g., by registering them if not already)
    // In a real E2E setup, you'd typically use a test utility to create this user directly in the DB
    // For demonstration, we'll attempt to register them, expecting it to fail if they exist.

    // Switch to Sign Up view
    cy.get('.auth-toggle-button').contains('Sign Up').click();

    // Fill registration form with existing user details
    cy.get('input[placeholder="Full Name"]').type(existingName);
    cy.get('input[placeholder="Email"]').type(existingEmail);
    cy.get('input[placeholder="Password"]').type(existingPassword);
    cy.get('button').contains('Create My Account').click();

    // Assert error message for existing user
    cy.get('p').contains('Registration failed').should('be.visible'); // Adjust error message text
    cy.url().should('not.include', '/dashboard'); // Should not redirect
  });

  it('should close the modal by clicking the X button', () => {
    cy.get('.close-btn').click();
    cy.get('.modal').should('not.be.visible');
  });

  it('should close the modal by clicking outside', () => {
    cy.get('.modal').click({ force: true }); // Click on the backdrop
    cy.get('.modal').should('not.be.visible');
  });

  it('should close the modal by pressing the Escape key', () => {
    cy.get('body').trigger('keydown', { keyCode: 27 }); // Escape key
    cy.get('.modal').should('not.be.visible');
  });

  // Add more tests for client-side validation, loading states, etc.
});