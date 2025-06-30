# Story 1.22: Implement Contact Us Page (`/contact`)

## Status: Implemented

## Story

- As a user, I want to contact Creator's Deal Hub for various inquiries, so that I can get specific assistance.

## Acceptance Criteria (ACs)

1.  The `src/app/(frontend)/contact/page.tsx` renders the content of `contact.html`.
2.  The `TriageCard` components correctly allow selection of "Request a Private Demo," "Press & Media Inquiry," or "General Question."
3.  Selecting a `TriageCard` dynamically displays the appropriate form (`ContactFormView`).
4.  Form submission (simulated) displays a success message (`SuccessMessageView`).
5.  The "Select a different channel" link correctly returns to the triage view.
6.  (Shadcn Integration) `TriageCard` can use Shadcn `Card`. `ContactFormView` uses Shadcn `Form`, `Input`, `Textarea`, `Button`, `Label`. `SuccessMessageView` uses Shadcn `Button`.

## Tasks / Subtasks

- [ ] Task 1: Implement `src/app/(frontend)/contact/page.tsx`.
- [ ] Task 2: Implement `TriageCard` components for inquiry selection.
- [ ] Task 3: Dynamically display `ContactFormView` based on `TriageCard` selection.
- [ ] Task 4: Implement simulated form submission and `SuccessMessageView` display.
- [ ] Task 5: Implement "Select a different channel" link.
- [ ] Task 6: Use Shadcn `Card`, `Form`, `Input`, `Textarea`, `Button`, `Label`.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/contact/page.tsx`
- `contact.html` (for original design reference)
- `src/app/(frontend)/components/TriageCard.tsx`
- `src/app/(frontend)/components/ContactFormView.tsx`
- `src/app/(frontend)/components/SuccessMessageView.tsx`

### Testing

Dev Note: Story Requires the following tests:

- [ ] Jest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Jest with in memory db Integration Test (Test Location): location: `/tests/pages/contactuspage.spec.ts`
- [ ] Cypress E2E: location: `/e2e/contactuspage.test.ts`

Manual Test Steps:
- Verify the `/contact` page loads correctly and is visually identical to `contact.html`.
- Verify selecting a triage card changes the displayed form.
- Verify form submission leads to a success message.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |