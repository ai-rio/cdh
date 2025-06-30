# Story 1.15: Implement Landing Page Footer (`LandingFooter`)

## Status: Not Implemented

## Story

- As a user, I want to see the final call to action and copyright information on the landing page, so that I can easily find options for next steps.

## Acceptance Criteria (ACs)

1.  The `LandingFooter.tsx` component renders the `final-cta` section from `landing.html`.
2.  The "Get Early Access" button correctly triggers the `WaitlistModal` (from `landing.html`).
3.  The copyright information is displayed correctly.
4.  (Shadcn Integration) The "Get Early Access" button uses a Shadcn `Button` component.

## Tasks / Subtasks

- [ ] Task 1: Implement `LandingFooter.tsx` component.
- [ ] Task 2: Integrate "Get Early Access" button to trigger `WaitlistModal`.
- [ ] Task 3: Display copyright information.
- [ ] Task 4: Use Shadcn `Button` for "Get Early Access" button.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/components/LandingFooter.tsx`
- `landing.html` (for original design reference)
- `src/app/(frontend)/components/WaitlistModalLanding.tsx`

### Testing

Dev Note: Story Requires the following tests:

- [ ] Jest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Jest with in memory db Integration Test (Test Location): location: `/tests/components/landingfooter.spec.ts`
- [ ] Cypress E2E: location: `/e2e/landingfooter.test.ts`

Manual Test Steps:
- Verify the footer section is present at the bottom of the landing page.
- Verify the "Get Early Access" button opens the waitlist modal.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
