# Story 1.21: Implement Careers Page (`/careers`)

## Status: Not Implemented

## Story

- As a user, I want to view open job opportunities, so that I can potentially join the Creator's Deal Hub team.

## Acceptance Criteria (ACs)

1.  The `src/app/(frontend)/careers/page.tsx` renders the content of `carreers.html`.
2.  "Our Core Code" sections are displayed with their specific styling.
3.  "Open Missions" are dynamically rendered using `MissionCard` components.
4.  Clicking a `MissionCard` opens the `MissionBriefingModal` with the correct briefing content.
5.  The job application form within the modal allows input and displays a success message upon simulated submission.
6.  (Shadcn Integration) `MissionCard` buttons use Shadcn `Button`. `MissionBriefingModal` uses Shadcn `Dialog` and form components (`Input`, `Textarea`, `RadioGroup`, `Button`).

## Tasks / Subtasks

- [ ] Task 1: Implement `src/app/(frontend)/careers/page.tsx`.
- [ ] Task 2: Display "Our Core Code" sections.
- [ ] Task 3: Dynamically render "Open Missions" using `MissionCard` components.
- [ ] Task 4: Implement `MissionCard` click to open `MissionBriefingModal`.
- [ ] Task 5: Implement job application form within the modal.
- [ ] Task 6: Use Shadcn `Button`, `Dialog`, `Input`, `Textarea`, `RadioGroup` for relevant components.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/careers/page.tsx`
- `carreers.html` (for original design reference)
- `src/app/(frontend)/components/MissionCard.tsx`
- `src/app/(frontend)/components/MissionBriefingModal.tsx`

### Testing

Dev Note: Story Requires the following tests:

- [ ] Vitest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Vitest with in memory db Integration Test (Test Location): location: `/tests/pages/careerspage.spec.ts`
- [ ] Cypress E2E: location: `/e2e/careerspage.test.ts`

Manual Test Steps:
- Verify the `/careers` page loads correctly and is visually identical to `carreers.html`.
- Verify clicking a job card opens the mission briefing modal with relevant details.
- Verify the application form in the modal functions as expected.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
