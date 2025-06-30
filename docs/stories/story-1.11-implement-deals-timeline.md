# Story 1.11: Implement Deals Timeline (`DealsTimeline`)

## Status: Not Implemented

## Story

- As a user, I want to visualize active brand deals on the landing page, so that I can see how the platform helps manage collaborations.

## Acceptance Criteria (ACs)

1.  The `DealsTimeline.tsx` component renders the "Command your deals." section from `landing.html`.
2.  Mock deal data is displayed as horizontal bars on a timeline.
3.  Hovering over deal bars displays a detailed popover with deal name, status, value, and next actions.
4.  The popover's positioning adjusts dynamically to avoid screen edges.
5.  (Shadcn Integration) The popover for deal details utilizes Shadcn `Popover`.

## Tasks / Subtasks

- [ ] Task 1: Implement `DealsTimeline.tsx` component.
- [ ] Task 2: Display mock deal data as horizontal bars.
- [ ] Task 3: Implement hover functionality for deal bars to display popover.
- [ ] Task 4: Implement dynamic popover positioning.
- [ ] Task 5: Use Shadcn `Popover` for deal details.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/components/DealsTimeline.tsx`
- `landing.html` (for original design reference)

### Testing

Dev Note: Story Requires the following tests:

- [ ] Vitest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Vitest with in memory db Integration Test (Test Location): location: `/tests/components/dealstimeline.spec.ts`
- [ ] Cypress E2E: location: `/e2e/dealstimeline.test.ts`

Manual Test Steps:
- Verify the deals timeline is visible and interactive on the landing page.
- Verify hovering over deal bars correctly shows popover details.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
