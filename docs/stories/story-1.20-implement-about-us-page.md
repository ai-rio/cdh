# Story 1.20: Implement About Us Page (`/about`)

## Status: Not Implemented

## Story

- As a user, I want to learn about Creator's Deal Hub's mission and team, so that I can understand its philosophy.

## Acceptance Criteria (ACs)

1.  The `src/app/(frontend)/about/page.tsx` renders the content of `about.html`.
2.  The "Manifesto" sections (`Clarity over Chaos`, `Data is Art`, etc.) are correctly displayed with their specific styling and number overlays.
3.  The "Architects" team grid is displayed.
4.  Any animations or visual effects present in the original `about.html` are correctly implemented.

## Tasks / Subtasks

- [ ] Task 1: Implement `src/app/(frontend)/about/page.tsx`.
- [ ] Task 2: Display "Manifesto" sections with styling and number overlays.
- [ ] Task 3: Display "Architects" team grid.
- [ ] Task 4: Implement animations/visual effects from `about.html`.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/about/page.tsx`
- `about.html` (for original design reference)

### Testing

Dev Note: Story Requires the following tests:

- [ ] Vitest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Vitest with in memory db Integration Test (Test Location): location: `/tests/pages/aboutuspage.spec.ts`
- [ ] Cypress E2E: location: `/e2e/aboutuspage.test.ts`

Manual Test Steps:
- Verify the `/about` page loads correctly and is visually identical to `about.html`.
- Verify scrolling through the manifesto sections correctly triggers any associated Three.js particle animations.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
