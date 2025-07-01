# Story 1.17: Implement Waitlist Modal (Landing Page Specific) (`WaitlistModalLanding`)

## Status: Not Implemented

## Story

- As a user, I want to join the waitlist from the landing page, so that I can be informed about the platform's launch.

## Acceptance Criteria (ACs)

1.  The `WaitlistModalLanding.tsx` component renders the waitlist modal from `landing.html` (`id="waitlist-modal"`).
2.  The modal can be opened by various CTA buttons on the landing page (Hero, Pricing, Footer).
3.  The form (`name`, `email`) functions correctly, and on submission, transitions to a success message with a checkmark animation.
4.  The modal can be closed via a close button or by clicking the backdrop.
5.  (Shadcn Integration) The modal structure uses Shadcn `Dialog`. Form inputs (`Input`), labels (`Label`), and buttons (`Button`) use Shadcn components. The success animation is custom within the Shadcn Dialog.

## Tasks / Subtasks

- [ ] Task 1: Implement `WaitlistModalLanding.tsx` component.
- [ ] Task 2: Integrate modal opening with CTA buttons on the landing page.
- [ ] Task 3: Implement form functionality, submission, and success message with animation.
- [ ] Task 4: Implement modal closing functionality.
- [ ] Task 5: Use Shadcn `Dialog`, `Input`, `Label`, and `Button` components.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/components/WaitlistModalLanding.tsx`
- `landing.html` (for original design reference)

### Testing

Dev Note: Story Requires the following tests:

- [ ] Vitest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Vitest with in memory db Integration Test (Test Location): location: `/tests/components/waitlistmodallanding.spec.ts`
- [ ] Cypress E2E: location: `/e2e/waitlistmodallanding.test.ts`

Dev Note: Upon completion, consider running targeted E2E tests as per `docs/testing/e2e-strategy.md`.

Manual Test Steps:
- Verify clicking "Join Waitlist" or "Request Early Access" buttons on the landing page opens the modal.
- Verify submitting the form displays the success message with animation.
- Verify the modal closes when the close button or backdrop is clicked.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
