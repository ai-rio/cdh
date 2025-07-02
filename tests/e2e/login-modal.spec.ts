import { test, expect } from '@playwright/test';

test.describe('Login Modal E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
  });

  test('should open login modal from Mission Control', async ({ page }) => {
    // Click Mission Control button
    await page.click('text=Mission Control');
    
    // Wait for command deck to appear
    await expect(page.locator('[data-testid="command-deck"]')).toBeVisible();
    
    // Click Login button
    await page.click('text=Login');
    
    // Wait for auth modal to appear
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Verify Sign In tab is active by default
    await expect(page.locator('.toggle-button.active')).toContainText('Sign In');
    
    // Verify login form is visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('text=Launch Command Center')).toBeVisible();
  });

  test('should switch between Sign In and Sign Up forms', async ({ page }) => {
    // Open modal
    await page.click('text=Mission Control');
    await page.click('text=Login');
    
    // Verify Sign In is active initially
    await expect(page.locator('.toggle-button.active')).toContainText('Sign In');
    
    // Click Sign Up toggle
    await page.click('text=Sign Up');
    
    // Verify Sign Up is now active
    await expect(page.locator('.toggle-button.active')).toContainText('Sign Up');
    
    // Verify signup form elements
    await expect(page.locator('input[placeholder="Full Name"]')).toBeVisible();
    await expect(page.locator('text=Create My Account')).toBeVisible();
    await expect(page.locator('text=By signing up, you agree to our Terms of Service')).toBeVisible();
    
    // Switch back to Sign In
    await page.click('text=Sign In');
    
    // Verify Sign In is active again
    await expect(page.locator('.toggle-button.active')).toContainText('Sign In');
    await expect(page.locator('text=Launch Command Center')).toBeVisible();
  });

  test('should validate email format in login form', async ({ page }) => {
    // Open modal
    await page.click('text=Mission Control');
    await page.click('text=Login');
    
    // Enter invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    
    // Try to submit
    await page.click('text=Launch Command Center');
    
    // Check for error message
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should validate password requirements in login form', async ({ page }) => {
    // Open modal
    await page.click('text=Mission Control');
    await page.click('text=Login');
    
    // Enter valid email but short password
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', '123');
    
    // Try to submit
    await page.click('text=Launch Command Center');
    
    // Check for error message
    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
  });

  test('should validate signup form fields', async ({ page }) => {
    // Open modal and switch to signup
    await page.click('text=Mission Control');
    await page.click('text=Login');
    await page.click('text=Sign Up');
    
    // Try to submit empty form
    await page.click('text=Create My Account');
    
    // Check for validation messages
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should submit valid login form', async ({ page }) => {
    // Open modal
    await page.click('text=Mission Control');
    await page.click('text=Login');
    
    // Fill valid credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('text=Launch Command Center');
    
    // Wait for success message or redirect
    await expect(page.locator('text=Login successful!')).toBeVisible({ timeout: 5000 });
  });

  test('should submit valid signup form', async ({ page }) => {
    // Open modal and switch to signup
    await page.click('text=Mission Control');
    await page.click('text=Login');
    await page.click('text=Sign Up');
    
    // Fill valid information
    await page.fill('input[placeholder="Full Name"]', 'Test User');
    await page.fill('input[type="email"]', 'newuser@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('text=Create My Account');
    
    // Wait for success message
    await expect(page.locator('text=Account created successfully!')).toBeVisible({ timeout: 5000 });
  });

  test('should close modal with close button', async ({ page }) => {
    // Open modal
    await page.click('text=Mission Control');
    await page.click('text=Login');
    
    // Verify modal is open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Click close button
    await page.click('[aria-label="Close modal"]');
    
    // Verify modal is closed
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should close modal with Escape key', async ({ page }) => {
    // Open modal
    await page.click('text=Mission Control');
    await page.click('text=Login');
    
    // Verify modal is open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Press Escape key
    await page.keyboard.press('Escape');
    
    // Verify modal is closed
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should have social login buttons', async ({ page }) => {
    // Open modal
    await page.click('text=Mission Control');
    await page.click('text=Login');
    
    // Check for social login buttons
    await expect(page.locator('text=Continue with Google')).toBeVisible();
    await expect(page.locator('text=Continue with Apple')).toBeVisible();
    
    // Switch to signup and verify social buttons there too
    await page.click('text=Sign Up');
    await expect(page.locator('text=Continue with Google')).toBeVisible();
    await expect(page.locator('text=Continue with Apple')).toBeVisible();
  });

  test('should toggle between forms using form links', async ({ page }) => {
    // Open modal
    await page.click('text=Mission Control');
    await page.click('text=Login');
    
    // Click "Sign up" link in login form
    await page.click('text=Sign up');
    
    // Verify we're now on signup form
    await expect(page.locator('.toggle-button.active')).toContainText('Sign Up');
    await expect(page.locator('text=Create My Account')).toBeVisible();
    
    // Click "Sign in" link in signup form
    await page.click('text=Sign in');
    
    // Verify we're back on login form
    await expect(page.locator('.toggle-button.active')).toContainText('Sign In');
    await expect(page.locator('text=Launch Command Center')).toBeVisible();
  });

  test('should have proper modal styling and responsiveness', async ({ page }) => {
    // Open modal
    await page.click('text=Mission Control');
    await page.click('text=Login');
    
    const modal = page.locator('[role="dialog"]');
    
    // Check modal is centered and has proper styling
    await expect(modal).toHaveCSS('position', 'fixed');
    
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(modal).toBeVisible();
    
    // Test on desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(modal).toBeVisible();
  });

  test('should maintain focus within modal', async ({ page }) => {
    // Open modal
    await page.click('text=Mission Control');
    await page.click('text=Login');
    
    // Tab through modal elements
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="password"]')).toBeFocused();
    
    // Continue tabbing to ensure focus stays within modal
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Focus should still be within the modal
    const focusedElement = await page.locator(':focus');
    const modalContent = page.locator('[role="dialog"]');
    await expect(modalContent).toContainText(await focusedElement.textContent() || '');
  });
});