# Story 1.13: Implement Testimonial Carousel (`TestimonialCarousel`)

## Status: Not Implemented

## Story

- As a user, I want to read testimonials from other creators on the landing page, so that I can build trust in the platform.

## Acceptance Criteria (ACs)

1.  The `TestimonialCarousel.tsx` component renders the "Trusted by top creators." section from `landing.html`.
2.  Testimonials are displayed in a horizontally scrollable container.
3.  "Scroll left" and "Scroll right" buttons correctly navigate the testimonials carousel.
4.  (Shadcn Integration) The navigation buttons use Shadcn `Button` components.

## Tasks / Subtasks

- [ ] Task 1: Implement `TestimonialCarousel.tsx` component.
- [ ] Task 2: Display testimonials in a horizontally scrollable container.
- [ ] Task 3: Implement "Scroll left" and "Scroll right" button functionality.
- [ ] Task 4: Use Shadcn `Button` for navigation buttons.

## Dev Notes

Relevant Source Tree info:
- `src/app/(frontend)/components/TestimonialCarousel.tsx`
- `landing.html` (for original design reference)

### Testing

Dev Note: Story Requires the following tests:

- [ ] Vitest Unit Tests: (nextToFile: true), coverage requirement: 80%
- [ ] Vitest with in memory db Integration Test (Test Location): location: `/tests/components/testimonialcarousel.spec.ts`


Manual Test Steps:
- Verify testimonials are visible and horizontally scrollable.
- Verify navigation buttons move the carousel content as expected.

## Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
