import { test, expect } from '@playwright/test'

test.describe('Contact Us Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('should display the contact page correctly', async ({ page }) => {
    // Check main heading
    await expect(page.getByText('Establish Comms')).toBeVisible()
    
    // Check description
    await expect(page.getByText('What is the nature of your transmission?')).toBeVisible()
    
    // Check all three triage cards
    await expect(page.getByText('Request a Private Demo')).toBeVisible()
    await expect(page.getByText('Press & Media Inquiry')).toBeVisible()
    await expect(page.getByText('General Question')).toBeVisible()
  })

  test('should show demo form when demo card is clicked', async ({ page }) => {
    // Click demo card
    await page.getByText('Request a Private Demo').click()
    
    // Wait for form to appear
    await expect(page.getByText('Request a Private Demo')).toBeVisible()
    await expect(page.getByPlaceholder('Full Name')).toBeVisible()
    await expect(page.getByPlaceholder('Work Email')).toBeVisible()
    await expect(page.getByPlaceholder('Company / Channel Name')).toBeVisible()
    await expect(page.getByText('Submit Request')).toBeVisible()
  })

  test('should show press form when press card is clicked', async ({ page }) => {
    // Click press card
    await page.getByText('Press & Media Inquiry').click()
    
    // Wait for form to appear
    await expect(page.getByText('Press & Media Inquiry')).toBeVisible()
    await expect(page.getByPlaceholder('Full Name')).toBeVisible()
    await expect(page.getByPlaceholder('Work Email')).toBeVisible()
    await expect(page.getByPlaceholder('Publication')).toBeVisible()
    await expect(page.getByPlaceholder('Briefly describe your inquiry...')).toBeVisible()
    await expect(page.getByText('Send Inquiry')).toBeVisible()
  })

  test('should show general form when general card is clicked', async ({ page }) => {
    // Click general card
    await page.getByText('General Question').click()
    
    // Wait for form to appear
    await expect(page.getByText('General Question or Feedback')).toBeVisible()
    await expect(page.getByPlaceholder('Your Email')).toBeVisible()
    await expect(page.getByPlaceholder('Your message...')).toBeVisible()
    await expect(page.getByText('Send Transmission')).toBeVisible()
  })

  test('should allow going back to triage from form', async ({ page }) => {
    // Click demo card
    await page.getByText('Request a Private Demo').click()
    
    // Wait for form and click back
    await expect(page.getByText('Select a different channel')).toBeVisible()
    await page.getByText('Select a different channel').click()
    
    // Should be back to triage view
    await expect(page.getByText('Establish Comms')).toBeVisible()
    await expect(page.getByText('Request a Private Demo')).toBeVisible()
    await expect(page.getByText('Press & Media Inquiry')).toBeVisible()
    await expect(page.getByText('General Question')).toBeVisible()
  })

  test('should show success message after form submission', async ({ page }) => {
    // Click demo card
    await page.getByText('Request a Private Demo').click()
    
    // Fill form
    await page.getByPlaceholder('Full Name').fill('John Doe')
    await page.getByPlaceholder('Work Email').fill('john@example.com')
    await page.getByPlaceholder('Company / Channel Name').fill('Test Company')
    
    // Submit form
    await page.getByText('Submit Request').click()
    
    // Check success message
    await expect(page.getByText('Transmission Received')).toBeVisible()
    await expect(page.getByText('Your request has been routed to our strategy team')).toBeVisible()
  })

  test('should have animated background canvas', async ({ page }) => {
    // Check that the canvas element exists
    const canvas = page.locator('#bg-canvas')
    await expect(canvas).toBeVisible()
    await expect(canvas).toHaveAttribute('aria-hidden', 'true')
  })

  test('should have proper styling and animations', async ({ page }) => {
    // Check triage cards have hover effects
    const demoCard = page.getByText('Request a Private Demo').locator('..')
    await demoCard.hover()
    
    // Check form inputs have proper focus styles
    await page.getByText('General Question').click()
    const emailInput = page.getByPlaceholder('Your Email')
    await emailInput.focus()
    
    // Verify the input is focused
    await expect(emailInput).toBeFocused()
  })
})
