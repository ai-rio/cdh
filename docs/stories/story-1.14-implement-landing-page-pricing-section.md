# Story 1.14: Implement Landing Page Pricing Section (`LandingPricingSection`)

## Status: Not Implemented

## Story

- As a user, I want to view the pricing plans summarized on the landing page, so that I can quickly assess subscription options.

## Acceptance Criteria (ACs)

1.  The `LandingPricingSection.tsx` component renders the "Choose your co-pilot." pricing section from `landing.html`.
2.  It displays the "Creator" and "Business" plans with their details.
3.  The "Join the Waitlist" buttons correctly trigger the `WaitlistModal` specific to the landing page.
4.  (Shadcn Integration) The "Join the Waitlist" buttons use Shadcn `Button` components.

## Tasks / Subtasks

- [ ] Task 1: Implement `LandingPricingSection.tsx` component.
- [ ] Task 2: Display "Creator" and "Business" plans with details.
- [ ] Task 3: Integrate "Join the Waitlist" buttons to trigger `WaitlistModal`.
- [ ] Task 4: Use Shadcn `Button` for "Join the Waitlist" buttons.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/components/LandingPricingSection.tsx`
- `landing.html` (for original design reference)
- `src/app/(frontend)/components/WaitlistModalLanding.tsx`

### Testing

Dev Note: Story Requires the following tests:

- [ ] Jest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Jest with in memory db Integration Test (Test Location): location: `/tests/components/landingpricingsection.spec.ts`
- [ ] Cypress E2E: location: `/e2e/landingpricingsection.test.ts`

Manual Test Steps:
- Verify the pricing section on the landing page is visually correct.
- Verify "Join the Waitlist" buttons open the waitlist modal.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
