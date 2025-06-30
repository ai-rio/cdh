# Story 1.4: Implement Hero Section Component

## Status: Implemented

## Story

- As a user, I want to see the main hero section, so that I understand the site's primary value proposition.

## Acceptance Criteria (ACs)

1.  The `HeroSection.tsx` component renders the `<section class="hero-section">` and its contents from `home.html`.
2.  The "Request Early Access" button correctly triggers the `EarlyAccessModal`.
3.  (Shadcn Integration) The "Request Early Access" button utilizes the Shadcn `Button` component, customized for its unique glowing visual effect.

## Tasks / Subtasks

- [ ] Task 1: Implement HeroSection.tsx component.
- [ ] Task 2: Integrate "Request Early Access" button to trigger EarlyAccessModal.
- [ ] Task 3: Use Shadcn Button component for the CTA.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/components/HeroSection.tsx`
- `home.html` (for original design reference)
- `src/app/(frontend)/components/EarlyAccessModal.tsx`

### Testing

Dev Note: Story Requires the following tests:

- [ ] Jest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Jest with in memory db Integration Test (Test Location): location: `/tests/components/herosection.spec.ts`
- [ ] Cypress E2E: location: `/e2e/herosection.test.ts`

Manual Test Steps:
- Verify the hero section displays correctly with all text and the CTA button.
- Verify clicking the CTA button opens the `EarlyAccessModal`.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
