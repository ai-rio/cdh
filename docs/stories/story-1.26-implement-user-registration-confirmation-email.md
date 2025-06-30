# Story 1.26: Implement User Registration Confirmation Email

## Status: Draft

## Story

- As a new user who has registered for an account
- I want to receive a confirmation email
- so that I can verify my account and complete the registration process.

## Acceptance Criteria (ACs)

1.  Upon successful user registration (e.g., via `AuthModal` or other registration flows), a confirmation email is sent to the provided email address via Resend.
2.  The email content includes a clear call to action for account verification (e.g., a verification link).
3.  The email is sent from a designated project email address (e.g., `no-reply@creatorsdealhub.com`).
4.  The email sending process is asynchronous and does not block the user registration flow.

## Tasks / Subtasks

- [ ] Task 1 (AC: 1, 4): Integrate email sending into the user registration process.
  - [ ] Subtask 1.1: Identify the appropriate Payload CMS hook (e.g., `afterChange` on the `users` collection) or Next.js API route for triggering the email.
  - [ ] Subtask 1.2: Call the email sending utility (from Story 1.24) with user registration details.
  - [ ] Subtask 1.3: Ensure email sending is non-blocking.
- [ ] Task 2 (AC: 2, 3): Design and implement the user registration confirmation email template.
  - [ ] Subtask 2.1: Define email subject and body content, including a placeholder for the verification link.
  - [ ] Subtask 2.2: Set up the sender email address.

## Dev Notes

Relevant Source Tree info:
- `src/collections/Users.ts` (Payload CMS user collection)
- `src/app/(frontend)/components/AuthModal.tsx`
- `docs/architecture/external-apis.md` (for Resend API details)
- `docs/architecture/backend-architecture.md` (for email integration approach)

### Testing

Dev Note: Story Requires the following tests:

- [ ] Jest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Jest with in memory db Integration Test (Test Location): location: `/tests/email/registration.spec.ts`
- [ ] Cypress E2E: location: `/e2e/email/registration.test.ts`

Manual Test Steps:
- Register a new user account.
- Verify that a confirmation email with a verification link is received in the provided inbox.
- Click the verification link and ensure it functions as expected.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
