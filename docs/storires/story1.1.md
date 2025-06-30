***

# Story 1.1: Implement Header Component

## [cite_start]Status: Approved [cite: 931]

## Story

* As a user, I want to see the site's main navigation header, so that I can navigate the site.

## Acceptance Criteria (ACs)

1.  The `Header.tsx` component renders the `<header class="mission-control-hud">` element and its contents from `home.html`.

## Tasks / Subtasks

* [ ] Create a new file at `src/app/(frontend)/components/Header.tsx`.
* [ ] Add the `"use client";` directive at the very top of the file, as this component will use interactive browser features.
* [ ] Copy the entire `<header class="mission-control-hud">...</header>` block from `home.html` and use it as the return value of your React component.
* [ ] Implement the state and click handlers for the mobile navigation toggle (`command-deck-toggle`) using the `useState` hook.

## Dev Notes

* **Styles**: All necessary CSS classes for this component are already defined in `src/app/(frontend)/styles.css`. No new CSS is needed.
* **Usage**: To make the header appear on every page, you should import and place this `Header` component into your main frontend layout file at `src/app/(frontend)/layout.tsx`.

### Testing

Manual Test Steps:
-   After implementing, run your development server (`bun run dev`).
-   Verify that the header appears correctly on the homepage.
-   Click the mobile navigation toggle to ensure the Command Deck opens and closes as expected.

### Dev Agent Record

### Agent Model Used: {{Agent Model Name/Version}}

### Debug Log References

[[LLM: (Dev Agent) If the debug is logged to during the current story progress, create a table with the debug log and the specific task section in the debug log - do not repeat all the details in the story]]

### Completion Notes List

[[LLM: (Dev Agent) Anything the SM needs to know that deviated from the story that might impact drafting the next story.]]

### Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |

***

