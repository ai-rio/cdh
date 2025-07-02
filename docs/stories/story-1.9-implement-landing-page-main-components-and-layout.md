# Story 1.9: Implement Landing Page (Detailed Breakdown)

## Status: Ready for Development

## Preamble

This master story has been broken down into highly detailed sub-stories to guide an AI development agent in recreating the `landing.html` page with high fidelity in a Next.js/React environment using TypeScript and Tailwind CSS.


### Story 1.9.1: Implement Landing Page Route and Layout

**Story:** As a developer, I need to set up the new landing page route and ensure it uses a unique layout that excludes the global `Header` and `Footer`, preparing it for its specific components.

**Acceptance Criteria (ACs):**

1. A new route is accessible at `/landing`.

2. The page `src/app/(frontend)/landing/page.tsx` is created.

3. The standard site `Header` and `Footer` components are **not** rendered on the `/landing` route.

4. The page's root element has a `background-color: #0A0A0A` and `color: #E5E7EB` as a base.

**Tasks / Subtasks:**

- [ ] Create the directory `src/app/(frontend)/landing/`.

- [ ] Create `src/app/(frontend)/landing/page.tsx`.

- [ ] Create `src/app/(frontend)/landing/layout.tsx` to provide a unique layout for this page.

- [ ] In `layout.tsx`, ensure it does not include the global `Header` or `Footer`.

- [ ] Set the base background and text colors in the layout.


### Story 1.9.2: Implement Particle Background

**Story:** As a user, I want to see a dynamic, interactive particle animation in the background of the landing page to create a visually engaging and high-tech atmosphere.

**Acceptance Criteria (ACs):**

1. A new component, `ParticleCanvas`, is created.

2. The component renders a full-screen `<canvas>` element with `position: fixed` and `z-index: -1`.

3. The particle animation from `landing.html`'s script is perfectly replicated in the React component, including particle movement, density, and color.

4. The lines connecting nearby particles appear on hover and are styled with a `rgba(192, 252, 50, ...)`, with opacity based on distance.

5. The canvas resizes correctly with the browser window and document height changes.

**Tasks / Subtasks:**

- [ ] Create `src/app/(frontend)/components/ParticleCanvas.tsx`.

- [ ] Use a `useEffect` hook to initialize the canvas and particle system on mount.

- [ ] Port the `Particle` class and animation logic (`initParticles`, `animateParticles`, `connect`) into the component.

- [ ] Manage canvas resizing with a `resize` event listener within `useEffect`.

- [ ] Integrate the `ParticleCanvas` component into the `landing/layout.tsx`.


### Story 1.9.3: Implement Landing Page Header

**Story:** As a user, I want a minimalist header that appears only when I scroll down, providing navigation without cluttering the initial view.

**Acceptance Criteria (ACs):**

1. A `LandingHeader` component is created.

2. The header is fixed to the top but is initially invisible (`opacity: 0`, `transform: translateY(-100%)`).

3. On scroll (e.g., > 50px), the header becomes visible with a smooth transition (`opacity: 1`, `transform: translateY(0)`).

4. The header background is `bg-black/20` with a `backdrop-blur-xl`.

5. The bottom border has the specified gradient animation: `border-image: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(163, 230, 53, 0.5), rgba(255,255,255,0.1)) 1;`.

6. Navigation links ("Features", "Testimonials", "Pricing") have the hover effect where a small lime-green dot appears below the link.

7. The "Join Waitlist" button is a Shadcn `Button` styled to match `landing.html` (`bg-lime-400 text-black`).

**Tasks / Subtasks:**

- [ ] Create `src/app/(frontend)/components/LandingHeader.tsx`.

- [ ] Implement the scroll detection logic in a `useEffect` hook to toggle visibility.

- [ ] Use Tailwind CSS to replicate the exact styling, including the gradient border animation.

- [ ] Implement the `nav-link` hover effect using CSS pseudo-elements (`::after`).

- [ ] Use Shadcn `Button` for the CTA and style it accordingly.

- [ ] Add the `LandingHeader` component to `landing/layout.tsx`.


### Story 1.9.4: Implement Hero Section

**Story:** As a user, I want to be greeted by a powerful, centered hero section that clearly communicates the product's main value proposition.

**Acceptance Criteria (ACs):**

1. A `HeroSection` component is created.

2. The layout is a full-screen `flex` container, centering content vertically and horizontally.

3. The content is wrapped in a `div` with `bg-black/20`, `border-white/10`, `backdrop-blur-xl`, `rounded-2xl`, and `shadow-2xl`.

4. The `h1` ("Overwhelmed is Over.") and `p` tags are styled exactly as in `landing.html`.

5. The "Request Early Access" CTA is a Shadcn `Button` with the exact `bg-lime-400`, text color, font size, padding, and shadow/hover effects (`shadow-[0_0_20px_rgba(192,252,50,0.4)]`).

6. The "Scroll to explore" indicator with its pulsing animation is present at the bottom.

**Tasks / Subtasks:**

- [ ] Create `src/app/(frontend)/components/landing/HeroSection.tsx`.

- [ ] Use Tailwind CSS to replicate the styling for the container and text elements.

- [ ] Define the `pulse` animation for the scroll indicator in `globals.css`.

- [ ] Implement the `HeroSection` in `landing/page.tsx`.


### Story 1.9.5: Implement "AI Co-Pilot" Feature Demo

**Story:** As a user, I want to interact with the AI co-pilot demo to understand its capabilities through a simulated, dynamic experience.

**Acceptance Criteria (ACs):**

1. An `AITypingDemo` component is created.

2. It contains three prompt chips (Shadcn `Button` components) styled as in `landing.html`.

3. Clicking a chip disables the buttons and shows a "thinking" animation.

4. After a delay, the response text is typed out character-by-character in a designated area.

5. The typing animation includes a blinking cursor effect.

6. For prompts with chart data ("roi", "income"), a Chart.js bar chart is rendered below the typed text after the typing is complete.

7. The component uses `useState` to manage the current state (idle, thinking, responding).

**Tasks / Subtasks:**

- [ ] Create `src/app/(frontend)/components/landing/AITypingDemo.tsx`.

- [ ] Implement the state logic for the interactive demo.

- [ ] Create the "thinking" animation CSS.

- [ ] Implement the typing effect using `setTimeout` or `setInterval` within a `useEffect` hook.

- [ ] Integrate Chart.js to render charts based on mock data.

- [ ] Add the component to `landing/page.tsx`.


### Story 1.9.6: Implement "Deals Timeline" Feature

**Story:** As a user, I want to visualize active brand deals on a timeline to understand how the platform helps manage collaborations.

**Acceptance Criteria (ACs):**

1. A `DealsTimeline` component is created.

2. It dynamically renders a timeline with mock deal data (name, start/end date, status, value).

3. Each deal is represented as a colored horizontal bar on the timeline, with its position and width determined by the data.

4. Hovering over a deal bar reveals a detailed popover with additional information.

5. The popover's positioning is dynamic to prevent it from going off-screen.

6. The component uses Shadcn `Popover` for the hover details.

**Tasks / Subtasks:**

- [ ] Create `src/app/(frontend)/components/landing/DealsTimeline.tsx`.

- [ ] Define the mock data structure for deals.

- [ ] Implement the logic to render the timeline and deal bars based on the data.

- [ ] Integrate Shadcn `Popover` and style it to match `landing.html`.

- [ ] Implement the dynamic positioning logic for the popover.

- [ ] Add the component to `landing/page.tsx`.


### Story 1.9.7: Implement "Cashflow Chart" Feature

**Story:** As a user, I want to see a dynamic cashflow chart to understand the financial clarity provided by the platform.

**Acceptance Criteria (ACs):**

1. A `CashflowChart` component is created.

2. It contains a Chart.js bar chart representing mock cashflow data (Pending, Paid, Overdue).

3. The chart is not visible initially but animates into view when the user scrolls to that section.

4. The scroll-triggered animation is handled using an Intersection Observer.

**Tasks / Subtasks:**

- [ ] Create `src/app/(frontend)/components/landing/CashflowChart.tsx`.

- [ ] Set up an Intersection Observer in a `useEffect` hook to detect when the component is visible.

- [ ] Trigger the Chart.js rendering and animation only when the component enters the viewport.

- [ ] Add the component to `landing/page.tsx`.


### Story 1.9.8: Implement Testimonial Carousel

**Story:** As a user, I want to read testimonials in an interactive carousel to build trust in the platform.

**Acceptance Criteria (ACs):**

1. A `TestimonialCarousel` component is created.

2. It displays testimonials in a horizontally scrollable container (`overflow-x-auto`).

3. "Scroll left" and "Scroll right" buttons (Shadcn `Button` with icons) programmatically scroll the container.

4. The testimonial cards are styled exactly as in `landing.html`, including the creator's avatar, name, and social media handle.

5. The scroll behavior is smooth.

**Tasks / Subtasks:**

- [ ] Create `src/app/(frontend)/components/landing/TestimonialCarousel.tsx`.

- [ ] Use a `useRef` to get a reference to the scrollable container.

- [ ] Implement the `onClick` handlers for the scroll buttons to manipulate `scrollLeft`.

- [ ] Add the component to `landing/page.tsx`.


### Story 1.9.9: Implement Landing Page Pricing & Footer

**Story:** As a user, I want to see the pricing and a final call-to-action to make an informed decision.

**Acceptance Criteria (ACs):**

1. A `LandingPricing` component is created, displaying the "Creator" and "Business" plans.

2. The "Most Popular" badge is correctly styled and positioned on the Business plan.

3. A `LandingFooter` component is created with the final "Get Early Access" CTA and copyright info.

4. All "Join Waitlist" / "Get Early Access" buttons are styled correctly and trigger the waitlist modal.

**Tasks / Subtasks:**

- [ ] Create `src/app/(frontend)/components/landing/LandingPricing.tsx`.

- [ ] Create `src/app/(frontend)/components/landing/LandingFooter.tsx`.

- [ ] Ensure all CTAs are wired up to open the yet-to-be-built modal.

- [ ] Add both components to `landing/page.tsx`.


### Story 1.9.10: Implement Waitlist Modal

**Story:** As a user, I want to be able to sign up for the waitlist via a sleek, interactive modal.

**Acceptance Criteria (ACs):**

1. A `WaitlistModal` component is created using Shadcn `Dialog`.

2. The modal is initially hidden and can be triggered by any "Join Waitlist" or "Request Early Access" button.

3. The form view contains "Your Name" and "Your Email" inputs (Shadcn `Input`).

4. On form submission, the view transitions to a success message.

5. The success view features an animated checkmark, replicated exactly from the CSS animations in `landing.html`.

6. The modal can be closed with a "Close" button or by clicking the backdrop.

**Tasks / Subtasks:**

- [ ] Create `src/app/(frontend)/components/landing/WaitlistModal.tsx`.

- [ ] Use a global state management solution (like Zustand or React Context) to control the modal's open/closed state from any component.

- [ ] Implement the form submission logic.

- [ ] Re-create the SVG checkmark and its `stroke` animation in CSS.

- [ ] Add the `WaitlistModal` to the `landing/layout.tsx` so it's available on the page.
