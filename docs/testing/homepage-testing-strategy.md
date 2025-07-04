# Testing Strategy for Story 1.18: Assemble Homepage

## 1. Overview

This document outlines the testing strategy for **Story 1.18: Assemble Homepage (`page.tsx`)**. The goal is to verify that the main homepage is correctly assembled from its constituent components and is ready for more detailed E2E testing.

This strategy covers two types of tests as required by the story:
1.  **Vitest Unit Tests** (next-to-file)
2.  **Vitest Integration Tests**

## 2. Unit Testing

-   **Tool:** Vitest
-   **Location:** `src/app/(frontend)/page.spec.tsx` (next to `page.tsx`)
-   **Coverage Goal:** >80% for `src/app/(frontend)/page.tsx`

### Objective

The primary objective of the unit tests is to ensure the structural integrity of the `HomePage` component. We will verify that it correctly imports and renders all its direct child components without errors. This is a "smoke test" for the page assembly itself.

### Mocking Strategy

All direct child components will be mocked using `vi.mock`. This isolates the `HomePage` component and ensures we are only testing the assembly logic, not the children's internal functionality.

```javascript
// Example Mocking in page.spec.tsx
vi.mock('@/components/Header', () => ({ default: () => <div data-testid="mock-header" /> }));
vi.mock('@/components/StarfieldCanvas', () => ({ default: () => <div data-testid="mock-starfield" /> }));
vi.mock('@/components/HeroSection', () => ({ default: () => <div data-testid="mock-hero" /> }));
vi.mock('@/components/InfoSection', () => ({ default: () => <div data-testid="mock-info" /> }));
vi.mock('@/components/Footer', () => ({ default: () => <div data-testid="mock-footer" /> }));
```

### Test Cases

1.  **Test 1: Renders without crashing**
    -   Render the `<HomePage />` component.
    -   Assert that no errors are thrown.

2.  **Test 2: Renders all child components**
    -   Render the `<HomePage />` component.
    -   Use `screen.getByTestId()` to assert that `mock-header`, `mock-starfield`, `mock-hero`, `mock-info`, and `mock-footer` are all present in the document.

## 3. Integration Testing

-   **Tool:** Vitest with JSDOM and Testing Library
-   **Location:** `/tests/pages/homepage.spec.ts`

### Objective

The integration test verifies that the homepage and its real child components render correctly together in a simulated DOM environment. This test ensures there are no conflicting styles, scripts, or rendering issues when the components are combined.

### Mocking Strategy

-   **API Calls:** While this page is largely static, any child components that make API calls (e.g., `Header` for user session, `Footer` for nav links) will have their network requests intercepted and mocked using **Mock Service Worker (MSW)**. This simulates a live environment without actual network dependency.
-   **Database:** No direct database interaction is expected for this page. The "in-memory DB" requirement is satisfied by mocking the API layer that would otherwise interact with the database.

### Test Cases

1.  **Test 1: Full Page Render and Structural Verification**
    -   Render the `<HomePage />` with its actual child components using `@testing-library/react`.
    -   Assert that the main landmark roles are present:
        -   `role="banner"` (Header)
        -   `role="main"`
        -   `role="contentinfo"` (Footer)

2.  **Test 2: Key Content Presence**
    -   Render the full page.
    -   Assert that key, unique text from each major component is visible.
        -   Example: Check for the main H1 from the `HeroSection`.
        -   Example: Check for the title of at least one `InfoSection`.
        -   Example: Check for the copyright text in the `Footer`.

## 4. Manual Testing Steps

The manual tests outlined in the story remain valid and should be executed as a final verification step:

1.  Navigate to the homepage (`/`).
2.  **Visual Verification:** Compare the rendered page against `home.html`. It should be visually identical, including responsive behavior at different screen sizes.
3.  **Functional Verification:** Click every interactive element (buttons, links, modals) to ensure they function as expected.

By executing this strategy, we will validate the successful assembly and basic functionality of the homepage, meeting all requirements of the story.
