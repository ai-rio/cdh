# Story 1.12: Implement Cashflow Chart (`CashflowChart`)

## Status: Not Implemented

## Story

- As a user, I want to see my projected income with a dynamic chart on the landing page, so that I understand the financial clarity provided by the platform.

## Acceptance Criteria (ACs)

1.  The `CashflowChart.tsx` component renders the "Get paid. Get smarter." section from `landing.html`.
2.  A Chart.js bar chart (mock data) representing cashflow (Pending, Paid, Overdue) is displayed.
3.  The chart animates into view when the section becomes visible on scroll.

## Tasks / Subtasks

- [ ] Task 1: Implement `CashflowChart.tsx` component.
- [ ] Task 2: Display Chart.js bar chart with mock data.
- [ ] Task 3: Implement animation for chart when scrolled into view.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/components/CashflowChart.tsx`
- `landing.html` (for original design reference)

### Testing

Dev Note: Story Requires the following tests:

- [ ] Jest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Jest with in memory db Integration Test (Test Location): location: `/tests/components/cashflowchart.spec.ts`
- [ ] Cypress E2E: location: `/e2e/cashflowchart.test.ts`

Manual Test Steps:
- Verify the cashflow chart section appears on the landing page.
- Verify the chart renders and animates when scrolled into view.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
