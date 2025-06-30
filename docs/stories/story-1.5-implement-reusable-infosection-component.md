# Story 1.5: Implement Reusable InfoSection Component

## Status: Not Implemented

## Story

- As a developer, I want a reusable `InfoSection.tsx` component, so that I can efficiently build consistent content sections of the page.

## Acceptance Criteria (ACs)

1.  The `InfoSection.tsx` component is created, accepting props for `title`, `id`, and `children` (or `content`).
2.  The component is used to render the "Command Your Deals," "Financial Clarity," and "Contact Intelligence" sections on the homepage.
3.  Scroll-to-target functionality (from Header HUD items) correctly navigates to `InfoSection` components by their `id`.
4.  (Shadcn Integration) The background card-like elements within InfoSection use the Shadcn `Card` component, styled to match the dark theme and transparent border.

## Tasks / Subtasks

- [ ] Task 1: Create `InfoSection.tsx` component with specified props.
- [ ] Task 2: Integrate `InfoSection` for "Command Your Deals," "Financial Clarity," and "Contact Intelligence" sections.
- [ ] Task 3: Implement scroll-to-target functionality.
- [ ] Task 4: Use Shadcn `Card` for background elements.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/components/InfoSection.tsx`
- `home.html` (for original design reference)

### Testing

Dev Note: Story Requires the following tests:

- [ ] Jest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Jest with in memory db Integration Test (Test Location): location: `/tests/components/infosection.spec.ts`
- [ ] Cypress E2E: location: `/e2e/infosection.test.ts`

Manual Test Steps:
- Verify the "Deals," "Finance," and "Contacts" sections render correctly on the homepage using the `InfoSection` component.
- Verify clicking the respective HUD items in the header scrolls the page to the correct `InfoSection`.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
