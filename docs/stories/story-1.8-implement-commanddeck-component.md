# Story 1.8: Implement CommandDeck Component

## Status: Not Implemented

## Story

- As a user, I want to access navigation links on mobile devices, so that I can move between different sections of the site.

## Acceptance Criteria (ACs)

1.  The `CommandDeck.tsx` component renders the full-screen mobile navigation overlay from `home.html` (`id="command-deck"`).
2.  It is triggered by the mobile navigation toggle in the `Header`.
3.  All navigation links (`blog.html`, `pricing.html`, `about.html`, `login.html`) are correctly implemented as Next.js links.
4.  The close button correctly hides the `CommandDeck`.
5.  (Shadcn Integration) The underlying mobile drawer functionality uses Shadcn `Sheet` or `Dialog` to provide built-in accessibility and animations.

## Tasks / Subtasks

- [ ] Task 1: Implement CommandDeck.tsx component.
- [ ] Task 2: Integrate with mobile navigation toggle in Header.
- [ ] Task 3: Implement Next.js links for navigation.
- [ ] Task 4: Implement close button functionality.
- [ ] Task 5: Use Shadcn Sheet or Dialog for mobile drawer.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/components/CommandDeck.tsx`
- `home.html` (for original design reference)
- `src/app/(frontend)/components/Header.tsx`

### Testing

Dev Note: Story Requires the following tests:

- [ ] Jest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Jest with in memory db Integration Test (Test Location): location: `/tests/components/commanddeck.spec.ts`
- [ ] Cypress E2E: location: `/e2e/commanddeck.test.ts`

Manual Test Steps:
- Verify clicking the hamburger icon in the header opens the `CommandDeck`.
- Verify all links within the `CommandDeck` navigate to their respective pages.
- Verify clicking the close button hides the `CommandDeck`.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
