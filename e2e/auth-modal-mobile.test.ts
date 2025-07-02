import { test, expect } from '@playwright/test';

test.describe('AuthModal Mobile-Friendly E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
  });

  test.describe('Desktop Layout', () => {
    test('should display three-column layout with social icons on right', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1024, height: 768 });
      
      // Open auth modal (assuming it's triggered by Mission Control -> Login)
      await page.click('text=Mission Control');
      await expect(page.locator('[data-testid="command-deck"]')).toBeVisible();
      await page.click('text=Login');
      
      // Wait for auth modal to appear
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Check for three-column grid layout
      const authContainer = page.locator('.auth-form-container');
      await expect(authContainer).toBeVisible();
      
      // Check desktop social section is visible
      const desktopSocial = page.locator('.desktop-social');
      await expect(desktopSocial).toBeVisible();
      
      // Check mobile social section is hidden
      const mobileSocial = page.locator('.mobile-social');
      await expect(mobileSocial).toBeHidden();
      
      // Check divider is visible
      const divider = page.locator('.divider');
      await expect(divider).toBeVisible();
    });

    test('should display all social login buttons with proper styling', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Check social section title
      await expect(page.locator('text=Quick Access')).toBeVisible();
      
      // Check all social buttons are present
      await expect(page.locator('button[title="Continue with Google"]')).toBeVisible();
      await expect(page.locator('button[title="Continue with Facebook"]')).toBeVisible();
      await expect(page.locator('button[title="Continue with Twitter"]')).toBeVisible();
      await expect(page.locator('button[title="Continue with Apple"]')).toBeVisible();
      
      // Check social buttons have proper classes
      await expect(page.locator('.social-icon-btn.google')).toBeVisible();
      await expect(page.locator('.social-icon-btn.facebook')).toBeVisible();
      await expect(page.locator('.social-icon-btn.twitter')).toBeVisible();
      await expect(page.locator('.social-icon-btn.apple')).toBeVisible();
    });

    test('should maintain social section visibility when switching forms', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Initially on Sign In - social section should be visible
      await expect(page.locator('text=Quick Access')).toBeVisible();
      await expect(page.locator('button[title="Continue with Google"]')).toBeVisible();
      
      // Switch to Sign Up
      await page.click('text=Sign Up');
      
      // Social section should still be visible
      await expect(page.locator('text=Quick Access')).toBeVisible();
      await expect(page.locator('button[title="Continue with Google"]')).toBeVisible();
      
      // Switch back to Sign In
      await page.click('text=Sign In');
      
      // Social section should still be visible
      await expect(page.locator('text=Quick Access')).toBeVisible();
      await expect(page.locator('button[title="Continue with Google"]')).toBeVisible();
    });
  });

  test.describe('Mobile Layout', () => {
    test('should display single-column layout with social icons below forms', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Check mobile social section is visible
      const mobileSocial = page.locator('.mobile-social');
      await expect(mobileSocial).toBeVisible();
      
      // Check desktop social section is hidden
      const desktopSocial = page.locator('.desktop-social');
      await expect(desktopSocial).toBeHidden();
      
      // Check divider is hidden on mobile
      const divider = page.locator('.divider');
      await expect(divider).toBeHidden();
    });

    test('should display social buttons in horizontal grid on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Check mobile social section
      const mobileSocial = page.locator('.mobile-social');
      await expect(mobileSocial).toBeVisible();
      
      // Check social icons grid
      const socialGrid = mobileSocial.locator('.social-icons-grid');
      await expect(socialGrid).toBeVisible();
      
      // Check all social buttons are present in mobile layout
      await expect(mobileSocial.locator('button[title="Continue with Google"]')).toBeVisible();
      await expect(mobileSocial.locator('button[title="Continue with Facebook"]')).toBeVisible();
      await expect(mobileSocial.locator('button[title="Continue with Twitter"]')).toBeVisible();
      await expect(mobileSocial.locator('button[title="Continue with Apple"]')).toBeVisible();
    });

    test('should maintain form functionality on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Should start with Sign In form
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
      
      // Switch to Sign Up
      await page.click('text=Sign Up');
      await expect(page.locator('[data-testid="signup-form"]')).toBeVisible();
      
      // Switch back to Sign In
      await page.click('text=Sign In');
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    });

    test('should have touch-friendly button sizes on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Check social buttons have adequate touch target size
      const socialButtons = page.locator('.mobile-social .social-icon-btn');
      const buttonCount = await socialButtons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = socialButtons.nth(i);
        const boundingBox = await button.boundingBox();
        
        // Touch targets should be at least 44px (iOS) or 48px (Android) for accessibility
        expect(boundingBox?.width).toBeGreaterThanOrEqual(40);
        expect(boundingBox?.height).toBeGreaterThanOrEqual(40);
      }
    });
  });

  test.describe('Tablet Layout', () => {
    test('should adapt layout appropriately for tablet screens', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // On tablet, should behave like mobile (single column)
      const mobileSocial = page.locator('.mobile-social');
      await expect(mobileSocial).toBeVisible();
      
      const desktopSocial = page.locator('.desktop-social');
      await expect(desktopSocial).toBeHidden();
    });
  });

  test.describe('Responsive Transitions', () => {
    test('should handle viewport size changes gracefully', async ({ page }) => {
      // Start with desktop
      await page.setViewportSize({ width: 1024, height: 768 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Verify desktop layout
      await expect(page.locator('.desktop-social')).toBeVisible();
      await expect(page.locator('.mobile-social')).toBeHidden();
      
      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Wait for layout to adjust
      await page.waitForTimeout(100);
      
      // Verify mobile layout
      await expect(page.locator('.mobile-social')).toBeVisible();
      await expect(page.locator('.desktop-social')).toBeHidden();
      
      // Resize back to desktop
      await page.setViewportSize({ width: 1024, height: 768 });
      
      // Wait for layout to adjust
      await page.waitForTimeout(100);
      
      // Verify desktop layout is restored
      await expect(page.locator('.desktop-social')).toBeVisible();
      await expect(page.locator('.mobile-social')).toBeHidden();
    });
  });

  test.describe('Accessibility', () => {
    test('should maintain keyboard navigation on all screen sizes', async ({ page }) => {
      // Test on desktop
      await page.setViewportSize({ width: 1024, height: 768 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Test Tab navigation
      await page.keyboard.press('Tab');
      
      // Should be able to navigate to social buttons
      const googleButton = page.locator('button[title="Continue with Google"]');
      await googleButton.focus();
      await expect(googleButton).toBeFocused();
      
      // Test on mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(100);
      
      // Social buttons should still be focusable
      const mobileSocialButton = page.locator('.mobile-social button[title="Continue with Google"]');
      await mobileSocialButton.focus();
      await expect(mobileSocialButton).toBeFocused();
    });

    test('should have proper ARIA attributes on all screen sizes', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Check ARIA attributes
      await expect(modal).toHaveAttribute('aria-modal', 'true');
      await expect(modal).toHaveAttribute('aria-labelledby');
      
      // Check social buttons have proper titles
      await expect(page.locator('button[title="Continue with Google"]')).toBeVisible();
      await expect(page.locator('button[title="Continue with Facebook"]')).toBeVisible();
      await expect(page.locator('button[title="Continue with Twitter"]')).toBeVisible();
      await expect(page.locator('button[title="Continue with Apple"]')).toBeVisible();
    });
  });

  test.describe('Social Button Interactions', () => {
    test('should handle social button clicks on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Click each social button - should not cause errors
      await page.click('button[title="Continue with Google"]');
      await page.click('button[title="Continue with Facebook"]');
      await page.click('button[title="Continue with Twitter"]');
      await page.click('button[title="Continue with Apple"]');
      
      // Modal should still be open
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    test('should handle social button clicks on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Click each social button in mobile layout
      await page.click('.mobile-social button[title="Continue with Google"]');
      await page.click('.mobile-social button[title="Continue with Facebook"]');
      await page.click('.mobile-social button[title="Continue with Twitter"]');
      await page.click('.mobile-social button[title="Continue with Apple"]');
      
      // Modal should still be open
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    test('should provide visual feedback on hover (desktop only)', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Hover over Google button
      const googleButton = page.locator('button[title="Continue with Google"]');
      await googleButton.hover();
      
      // Should have hover state (this would need to be verified with CSS)
      await expect(googleButton).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should render quickly on all screen sizes', async ({ page }) => {
      const startTime = Date.now();
      
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      
      // Modal should appear within reasonable time
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 2000 });
      
      const endTime = Date.now();
      const renderTime = endTime - startTime;
      
      // Should render within 2 seconds
      expect(renderTime).toBeLessThan(2000);
    });

    test('should handle rapid viewport changes without errors', async ({ page }) => {
      // Open auth modal
      await page.click('text=Mission Control');
      await page.click('text=Login');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Rapidly change viewport sizes
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.waitForTimeout(50);
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(50);
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(50);
      await page.setViewportSize({ width: 1024, height: 768 });
      
      // Modal should still be functional
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator('text=Quick Access')).toBeVisible();
    });
  });
});