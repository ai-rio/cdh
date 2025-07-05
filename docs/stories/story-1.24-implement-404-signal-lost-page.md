# Story 1.24: Modify 404 Signal Lost Page to Match Final Design

## Status: Ready for Dev

## Story

- As a user, when I encounter a 404 error, I want to see a visually engaging "Signal Lost" page that matches the design specification, so I can understand the error and navigate back to safety.

## Acceptance Criteria (ACs)

1.  The existing `src/app/(frontend)/not-found.tsx` is modified to replace the current `<StarfieldCanvas />` with the Three.js animation from `docs/html/404_Signal_Lost.html`.
2.  The `glitch-text` style from the HTML reference is applied to the "404" heading.
3.  The existing `Link` component for "Re-establish Connection" is refactored to use a Shadcn `Button` component, maintaining the link to the homepage (`/`).
4.  The "Mission Control HUD" header is **explicitly excluded** from the page.

## Tasks / Subtasks

- [ ] Task 1: Create a new client component at `src/components/special/SignalLostAnimation.tsx` to encapsulate the Three.js logic from `404_Signal_Lost.html`.
- [ ] Task 2: Modify `src/app/(frontend)/not-found.tsx` to remove `<StarfieldCanvas />` and integrate the new `SignalLostAnimation` component.
- [ ] Task 3: In `not-found.tsx`, apply the `glitch-text` style to the '404' heading.
- [ ] Task 4: In `not-found.tsx`, refactor the navigation link to use a Shadcn `Button` wrapped in a Next.js `Link`.

## Dev Notes

This is a **modification** of an existing file, not a new implementation. The core layout is in place but needs specific visual and component updates.

Relevant Source Tree info:
- `src/app/(frontend)/not-found.tsx` (File to be modified)
- `docs/html/404_Signal_Lost.html` (Design and animation logic reference)

**Design Decision:** Per discussion, the 'Mission Control HUD' header will be omitted from the final implementation to provide a cleaner, more focused user experience. The primary call-to-action button is sufficient for user navigation.

### Testing

Dev Note: Story Requires the following tests:

- [ ] Vitest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Vitest with in memory db Integration Test (Test Location): location: `/tests/pages/404page.spec.ts`


Dev Note: Upon completion, consider running targeted E2E tests as per `docs/testing/e2e-strategy.md`.

Manual Test Steps:
- Verify navigating to an invalid URL displays the updated 404 page.
- Verify the "Re-establish Connection" button navigates to the homepage.
- Verify the new background animation and glitch text effect are present.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
