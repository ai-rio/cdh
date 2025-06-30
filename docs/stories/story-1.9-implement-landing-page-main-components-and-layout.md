# Story 1.9: Implement Landing Page Main Components and Layout (`/landing`)

## Status: Implemented

## Story

- As a user, I want to view the interactive demo landing page, so that I can experience the key features of the Creator's Deal Hub.

## Acceptance Criteria (ACs)

1.  The `src/app/(frontend)/landing/page.tsx` renders the overall layout and main sections of `landing.html`.
2.  The main header (`main-header`) is integrated, correctly appearing on scroll.
3.  The hero section with "Overwhelmed is Over." is displayed.
4.  The "Scroll to explore" indicator functions correctly.
5.  The general structure of the "Features," "Testimonials," and "Pricing" sections is present.
6.  The `ParticleCanvas` component (from `landing.html`) is integrated as a background element.
7.  (Shadcn Integration) The main header (`LandingHeader`) is a custom component, but any internal interactive elements use Shadcn components (e.g., `Button` for "Join the Waitlist").

## Tasks / Subtasks

- [ ] Task 1: Implement `src/app/(frontend)/landing/page.tsx` with overall layout.
- [ ] Task 2: Integrate main header (`LandingHeader`) with scroll behavior.
- [ ] Task 3: Display hero section.
- [ ] Task 4: Implement "Scroll to explore" indicator.
- [ ] Task 5: Structure "Features," "Testimonials," and "Pricing" sections.
- [ ] Task 6: Integrate `ParticleCanvas` as background.
- [ ] Task 7: Use Shadcn `Button` for interactive elements in `LandingHeader`.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/landing/page.tsx`
- `landing.html` (for original design reference)
- `src/app/(frontend)/components/LandingHeader.tsx`
- `src/app/(frontend)/components/ParticleCanvas.tsx`

### Testing

Dev Note: Story Requires the following tests:

- [ ] Jest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Jest with in memory db Integration Test (Test Location): location: `/tests/pages/landing.spec.ts`
- [ ] Cypress E2E: location: `/e2e/landing.test.ts`

Manual Test Steps:
- Verify the `/landing` page loads without errors and its initial view matches `landing.html`.
- Verify the header appears when scrolling down and hides when scrolling up.
- Verify the background particle animation is visible.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
