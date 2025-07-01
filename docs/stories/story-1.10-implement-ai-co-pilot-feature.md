# Story 1.10: Implement AI Co-Pilot Feature (`AITypingDemo`)

## Status: Not Implemented

## Story

- As a user, I want to interact with the AI co-pilot demo on the landing page, so that I can understand its strategic insight capabilities.

## Acceptance Criteria (ACs)

1.  The `AITypingDemo.tsx` component encapsulates the "Ask anything. Understand everything." section from `landing.html`.
2.  Clicking on prompt chips (`roi`, `income`, `followup`) triggers the AI response simulation.
3.  The thinking indicator and typing animation are correctly displayed.
4.  The response text is typed out character by character.
5.  For applicable prompts (ROI, Income), a mock Chart.js graph is displayed below the typed response.
6.  (Shadcn Integration) The prompt chips utilize Shadcn `Button` components, customized for their appearance.

## Tasks / Subtasks

- [ ] Task 1: Implement `AITypingDemo.tsx` component.
- [ ] Task 2: Implement prompt chip click functionality to trigger AI response simulation.
- [ ] Task 3: Implement thinking indicator and typing animation.
- [ ] Task 4: Implement character-by-character response text display.
- [ ] Task 5: Display mock Chart.js graph for relevant prompts.
- [ ] Task 6: Use Shadcn `Button` for prompt chips.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/components/AITypingDemo.tsx`
- `landing.html` (for original design reference)

### Testing

Dev Note: Story Requires the following tests:

- [ ] Vitest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Vitest with in memory db Integration Test (Test Location): location: `/tests/components/aitypingdemo.spec.ts`


Manual Test Steps:
- Verify clicking prompt chips on the landing page activates the AI demo.
- Verify AI responses are typed out, and charts appear as expected.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
