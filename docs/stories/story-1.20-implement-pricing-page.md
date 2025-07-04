# Story 1.20: Implement Pricing Page (`/pricing`)

## Status: Implemented

## Story

- As a user, I want to view Creator's Deal Hub pricing plans, so that I can choose a subscription that fits my needs.

## Acceptance Criteria (ACs)

1.  The `src/app/(frontend)/pricing/page.tsx` renders the content of `pricing.html`.
2.  The page utilizes `FoundersKeyCard`, `PricingCard`, and `BillingToggle` components.
3.  The `BillingToggle` correctly switches between monthly and annual pricing for `PricingCard` components.
4.  The "Claim My Founder's Key" button triggers the `EarlyAccessModal`.
5.  (Shadcn Integration) `FoundersKeyCard` and `PricingCard` buttons use Shadcn `Button`. The `BillingToggle` uses Shadcn `ToggleGroup`.
6.  The HUD items in the `Header` component are only visible on the home page (`/`).

## Tasks / Subtasks

- [x] Task 1: Implement `src/app/(frontend)/pricing/page.tsx`.
- [x] Task 2: Integrate `FoundersKeyCard`, `PricingCard`, and `BillingToggle` components.
- [x] Task 3: Implement `BillingToggle` functionality.
- [x] Task 4: Integrate "Claim My Founder's Key" button with `EarlyAccessModal`.
- [x] Task 5: Use Shadcn `Button` and `ToggleGroup`.
- [x] Task 6: Implement conditional rendering for HUD items in `Header.tsx`.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/pricing/page.tsx`
- `pricing.html` (for original design reference)
- `src/app/(frontend)/components/FoundersKeyCard.tsx`
- `src/app/(frontend)/components/PricingCard.tsx`
- `src/app/(frontend)/components/BillingToggle.tsx`
- `src/app/(frontend)/components/EarlyAccessModal.tsx`

### Conditional HUD Items in Header

To implement Task 6, modify `src/app/(frontend)/components/Header.tsx`:
1.  Import `usePathname` from `next/navigation`.
2.  Inside the `Header` component, get the current path using `const pathname = usePathname();`.
3.  Conditionally render the `div` containing the `hud-item` elements based on `pathname === '/'`.

### Testing

Dev Note: Story Requires the following tests:

- [ ] Vitest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Vitest with in memory db Integration Test (Test Location): location: `/tests/pages/pricingpage.spec.ts`
- [ ] Cypress E2E: location: `/e2e/pricingpage.test.ts`

Dev Note: Upon completion, consider running targeted E2E tests as per `docs/testing/e2e-strategy.md`.

Manual Test Steps:
- Verify the `/pricing` page loads correctly and is visually identical to `pricing.html`.
- Verify the billing toggle accurately updates prices.
- Verify clicking "Claim My Founder's Key" opens the `EarlyAccessModal`.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
