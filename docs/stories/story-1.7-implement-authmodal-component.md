# Story 1.7: Implement AuthModal Component

## Status: Not Implemented

## Story

- As a user, I want to sign in or sign up, so that I can access my account or create a new one.

## Acceptance Criteria (ACs)

1.  The `AuthModal.tsx` component renders the modal content from `home.html` (`id="auth-modal"`).
2.  The modal can be opened via the "Login" link in the `CommandDeck`.
3.  The "Sign In" and "Sign Up" tabs correctly toggle between their respective forms.
4.  Both forms simulate submission (no actual API call needed for this story) and display appropriate feedback.
5.  The modal can be closed via a close button.
6.  (Shadcn Integration) The modal structure uses Shadcn `Dialog`. Form inputs (`Input`), labels (`Label`), and buttons (`Button`) use Shadcn components. The tab functionality uses Shadcn `Tabs`.

## Tasks / Subtasks

- [ ] Task 1: Implement AuthModal.tsx component.
- [ ] Task 2: Integrate modal opening with "Login" link.
- [ ] Task 3: Implement tab toggling for "Sign In" and "Sign Up" forms.
- [ ] Task 4: Implement simulated form submission and feedback.
- [ ] Task 5: Implement modal closing functionality.
- [ ] Task 6: Use Shadcn Dialog, Input, Label, Button, and Tabs components.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/components/AuthModal.tsx`
- `home.html` (for original design reference)
- `src/app/(frontend)/components/CommandDeck.tsx`

### Testing

Dev Note: Story Requires the following tests:

- [ ] Jest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Jest with in memory db Integration Test (Test Location): location: `/tests/components/authmodal.spec.ts`
- [ ] Cypress E2E: location: `/e2e/authmodal.test.ts`

Manual Test Steps:
- Verify clicking "Login" in the mobile navigation opens the AuthModal.
- Verify toggling between "Sign In" and "Sign Up" tabs displays the correct form fields.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
