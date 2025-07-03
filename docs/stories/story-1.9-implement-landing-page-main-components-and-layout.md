# Story 1.9: Implement Landing Page (with Detailed Sub-Tasks & Shadcn UI Mapping)

## Status: Ready for Development

## Preamble

# This master story has been broken down into highly detailed sub-stories to guide an AI development agent in recreating the `landing.html` page with high fidelity in a Next.js/React environment. This version includes specific `shadcn/ui` component mappings and granular sub-tasks to ensure consistency and accelerate development.****PO Contribution:**** I have added a detailed `Tasks / Subtasks` section to each story. This provides a clear, step-by-step implementation plan for the AI agent, minimizing guesswork and ensuring the final output aligns perfectly with the Acceptance Criteria and design specifications.

### Story 1.9.1: Implement Landing Page Route and Layout

# ****Story:**** As a developer, I need to set up the new landing page route and ensure it uses a unique layout that excludes the global `Header` and `Footer`, preparing it for its specific components.****Acceptance Criteria (ACs):****1) A new route is accessible at `/landing`.

2) The page `src/app/(frontend)/landing/page.tsx` is created.

3) The standard site `Header` and `Footer` components are ****not**** rendered on the `/landing` route.

4) The page's root element has a `background-color: #0A0A0A` and `color: #E5E7EB` as a base.****Tasks / Subtasks:***** [ ] Create the directory `src/app/(frontend)/landing/`.

* [ ] Create the file `src/app/(frontend)/landing/page.tsx` with basic placeholder content.

* [ ] Create the file `src/app/(frontend)/landing/layout.tsx`.

* [ ] In the new `layout.tsx`, define a root layout component that accepts `children` as props.

* [ ] Ensure this layout does ****not**** import or render the global `Header` or `Footer` components.

* [ ] Apply the base `bg-[#0A0A0A]` and `text-[#E5E7EB]` styles to the `<body>` tag within this layout.

### Story 1.9.2: Implement Particle Background

# ****Story:**** As a user, I want to see a dynamic, interactive particle animation in the background of the landing page to create a visually engaging and high-tech atmosphere.****Acceptance Criteria (ACs):****1) A new client-side component, `ParticleCanvas.tsx`, is created.

2) The component renders a full-screen `<canvas>` element with `position: fixed` and `z-index: -1`.

3) The particle animation from `landing.html`'s script is perfectly replicated.

4) The lines connecting nearby particles appear and are styled with a `rgba(192, 252, 50, ...)` color.

5) The canvas resizes correctly with the browser window.****Tasks / Subtasks:***** [ ] Create the component file `src/app/(frontend)/components/landing/ParticleCanvas.tsx`.

* [ ] Mark the component with `'use client'` at the top.

* [ ] Use a `useRef<HTMLCanvasElement>(null)` to get a reference to the canvas element.

* [ ] In a `useEffect` hook (with an empty dependency array `[]`), port the entire particle animation logic from `landing.html`, including the `Particle` class, `initParticles`, `animateParticles`, and `connect` functions.

* [ ] Add a `resize` event listener within the `useEffect` hook to call `initParticles` on window resize, ensuring it's debounced to prevent performance issues.

* [ ] Remember to return a cleanup function from `useEffect` to remove the event listener.

* [ ] Integrate the `<ParticleCanvas />` component into `src/app/(frontend)/landing/layout.tsx`.

### Story 1.9.3: Implement Landing Page Header

# ****Story:**** As a user, I want a minimalist header that appears only when I scroll down, providing navigation without cluttering the initial view.****Acceptance Criteria (ACs):****1) A `LandingHeader` component is created.

2) The header is fixed to the top and becomes visible on scroll with a smooth transition.

3) The header background is `bg-black/20` with a `backdrop-blur-xl`.

4) The bottom border has the specified gradient animation.

5) Navigation links have the hover effect with a small lime-green dot.****Shadcn UI Mapping:***** ****Join Waitlist Button:**** Use `Button` from `shadcn/ui`. Style it to match `landing.html` (`bg-lime-400 text-black hover:bg-lime-300`).****Tasks / Subtasks:***** [ ] Create the component file `src/app/(frontend)/components/landing/LandingHeader.tsx`.

* [ ] Use a `useState` hook to track the header's visibility state (e.g., `const [isVisible, setIsVisible] = useState(false)`).

* [ ] In a `useEffect` hook, add a `scroll` event listener to the `window`.

* [ ] Inside the scroll handler, check `window.scrollY`. If it's greater than 50, `setIsVisible(true)`; otherwise, `setIsVisible(false)`.

* [ ] Use the `isVisible` state to conditionally apply a CSS class (e.g., 'visible') that controls opacity and transform for the reveal animation.

* [ ] Define the gradient border animation in `globals.css`.

* [ ] Implement the `nav-link` hover effect using CSS pseudo-elements (`::after`).

* [ ] Use the Shadcn `Button` for the "Join Waitlist" CTA and apply the necessary custom classes.

* [ ] Add the `<LandingHeader />` component to `src/app/(frontend)/landing/layout.tsx`.

### Story 1.9.4: Implement Hero Section

# ****Story:**** As a user, I want to be greeted by a powerful, centered hero section that clearly communicates the product's main value proposition.****Acceptance Criteria (ACs):****1) A `HeroSection` component is created.

2) The layout is a full-screen `flex` container, centering content.

3) The content is wrapped in a container with `bg-black/20`, `border-white/10`, and `backdrop-blur-xl`.

4) The "Scroll to explore" indicator with its pulsing animation is present.****Shadcn UI Mapping:***** ****Content Container:**** Use `Card` from `shadcn/ui` as the base for the main content block, customizing its style (`Card`, `CardContent`).

* ****Request Early Access Button:**** Use `Button` from `shadcn/ui`. Replicate the exact styling, including the custom shadow effect on hover.****Tasks / Subtasks:***** [x] Create the component file `src/app/(frontend)/components/landing/HeroSection.tsx`.

* [x] Use Tailwind CSS for the full-screen `h-screen` and `flex` properties to center the content.

* [x] Implement the main content container using Shadcn `Card` and apply the specified background, border, and blur styles via `className`.

* [x] Implement the "Request Early Access" button using Shadcn `Button`, ensuring the custom `shadow-[0_0_20px_rgba(192,252,50,0.4)]` and hover effects are applied.

* [x] Define the `pulse` animation for the scroll indicator in `globals.css` and apply it to the indicator element.

* [x] Add the `<HeroSection />` component to `src/app/(frontend)/landing/page.tsx`.

### Story 1.9.5: Implement "AI Co-Pilot" Feature Demo

# ****Story:**** As a user, I want to interact with the AI co-pilot demo to understand its capabilities through a simulated, dynamic experience.****Acceptance Criteria (ACs):****1) An `AITypingDemo` component is created.

2) It contains three interactive prompt chips.

3) Clicking a chip triggers a "thinking" animation, followed by a typed-out text response.

4) For applicable prompts, a Chart.js bar chart is rendered below the text.****Shadcn UI Mapping:***** ****Prompt Chips:**** Use `Button` from `shadcn/ui` with `variant="outline"` or custom styling to achieve the `bg-white/5 border border-white/10` look.

* ****AI Response Area:**** Use `Card` from `shadcn/ui` to frame the entire response area, including the placeholder, thinking indicator, and final text/chart.****Tasks / Subtasks:***** [ ] Create `src/app/(frontend)/components/landing/AITypingDemo.tsx`.

* [ ] Use `useState` to manage the demo's state: `idle`, `thinking`, `responding`.

* [ ] Implement the prompt chips using Shadcn `Button` and attach `onClick` handlers.

* [ ] The `onClick` handler should set the state to `thinking`, then use a `setTimeout` to switch to `responding`.

* [ ] Implement the typing effect logic within a `useEffect` that triggers when the response text changes.

* [ ] Create a separate `ChartComponent.tsx` that takes chart data as props and renders a Chart.js instance. Conditionally render this component based on the response data.

* [ ] Add the `<AITypingDemo />` component to `landing/page.tsx`.

### Story 1.9.6: Implement "Deals Timeline" Feature

# ****Story:**** As a user, I want to visualize active brand deals on a timeline to understand how the platform helps manage collaborations.****Acceptance Criteria (ACs):****1) A `DealsTimeline` component is created.

2) It dynamically renders a timeline with mock deal data.

3) Hovering over a deal bar reveals a detailed popover.

4) The popover's positioning is dynamic to avoid going off-screen.****Shadcn UI Mapping:***** ****Deal Detail Popover:**** Use `Popover` from `shadcn/ui` (`Popover`, `PopoverTrigger`, `PopoverContent`) to display details on hover.****Tasks / Subtasks:***** [ ] Create `src/app/(frontend)/components/landing/DealsTimeline.tsx`.

* [ ] Define a TypeScript interface and mock data array for the deals.

* [ ] Map over the mock data to render the timeline rows.

* [ ] For each row, wrap the deal bar element in `PopoverTrigger`.

* [ ] Inside `PopoverContent`, render the detailed view of the deal.

* [ ] The popover positioning is handled by `shadcn/ui` by default, but you can pass props like `sideOffset` for fine-tuning.

* [ ] Add the `<DealsTimeline />` component to `landing/page.tsx`.

### Story 1.9.7: Implement "Cashflow Chart" Feature

# ****Story:**** As a user, I want to see a dynamic cashflow chart to understand the financial clarity provided by the platform.****Acceptance Criteria (ACs):****1) A `CashflowChart` component is created.

2) It contains a Chart.js bar chart with mock data.

3) The chart animates into view when the user scrolls to that section.****Shadcn UI Mapping:***** ****Chart Container:**** Use `Card` from `shadcn/ui` to wrap the chart canvas for consistent padding and background styling.****Tasks / Subtasks:***** [ ] Create `src/app/(frontend)/components/landing/CashflowChart.tsx`.

* [ ] Use a `useRef` for the container element and an Intersection Observer to track its visibility.

* [ ] Use a `useState` flag (e.g., `hasBeenVisible`) to ensure the chart renders only once.

* [ ] In the `useEffect` for the observer, when the element is intersecting, set `hasBeenVisible` to `true`.

* [ ] Create a separate `useEffect` that depends on `hasBeenVisible`. When it becomes `true`, initialize and render the Chart.js instance.

* [ ] Wrap the canvas in a Shadcn `Card` and `CardContent`.

* [ ] Add the `<CashflowChart />` component to `landing/page.tsx`.

### Story 1.9.8: Implement Testimonial Carousel

# ****Story:**** As a user, I want to read testimonials in an interactive carousel to build trust in the platform.****Acceptance Criteria (ACs):****1) A `TestimonialCarousel` component is created.

2) It displays testimonials in a horizontally scrollable container.

3) "Scroll left" and "Scroll right" buttons programmatically scroll the container.****Shadcn UI Mapping:***** ****Testimonial Cards:**** Use `Card` from `shadcn/ui` for each individual testimonial.

* ****Scroll Buttons:**** Use `Button` from `shadcn/ui` with `variant="outline"` and size `icon`, containing arrow icons.

* ****Carousel (Advanced):**** For a more robust implementation, use `Carousel` from `shadcn/ui` (`Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`).****Tasks / Subtasks:***** [ ] Create `src/app/(frontend)/components/landing/TestimonialCarousel.tsx`.

* [ ] Install `shadcn-ui/react-carousel` if not already present.

* [ ] Implement the component using the Shadcn `Carousel` components as the primary structure.

* [ ] Map over mock testimonial data, rendering each item inside a `CarouselItem`.

* [ ] Inside each `CarouselItem`, use a Shadcn `Card` to structure the testimonial content (quote, avatar, name, handle).

* [ ] Add the `<TestimonialCarousel />` component to `landing/page.tsx`.

### Story 1.9.9: Implement Landing Page Pricing & Footer

# ****Story:**** As a user, I want to see the pricing and a final call-to-action to make an informed decision.****Acceptance Criteria (ACs):****1) A `LandingPricing` component is created, displaying the "Creator" and "Business" plans.

2) A `LandingFooter` component is created with the final CTA.

3) All "Join Waitlist" / "Get Early Access" buttons trigger the waitlist modal.****Shadcn UI Mapping:***** ****Pricing Cards:**** Use `Card` from `shadcn/ui` for each pricing tier.

* ****Feature List:**** Use a simple `ul` and `li` with checkmark icons.

* ****CTA Buttons:**** Use `Button` from `shadcn/ui`.****Tasks / Subtasks:***** [ ] Create `src/app/(frontend)/components/landing/LandingPricing.tsx`.

* [ ] Create `src/app/(frontend)/components/landing/LandingFooter.tsx`.

* [ ] Use Shadcn `Card` for the pricing tiers, applying the `pricing-card-popular` styles to the Business plan card.

* [ ] Implement the feature lists within each card.

* [ ] Ensure all CTA buttons (Shadcn `Button`) are wired up to open the waitlist modal (this will require a shared state, see next story).

* [ ] Add both components to `landing/page.tsx`.

### Story 1.9.10: Implement Waitlist Modal

# **Story:** As a user, I want to be able to sign up for the waitlist via a sleek, interactive modal.**Acceptance Criteria (ACs):**1) A `WaitlistModal` component is created.

2) The modal is initially hidden and can be triggered by any waitlist CTA.

3) The form view contains "Your Name" and "Your Email" inputs.

4) On submission, the view transitions to a success message with an animated checkmark.

5) The modal can be closed.**Shadcn UI Mapping:*** **Modal:** Use `Dialog` from `shadcn/ui` (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`).

* **Form Inputs:** Use `Input` from `shadcn/ui`.

* **Form Labels:** Use `Label` from `shadcn/ui`.

* **Submit Button:** Use `Button` from `shadcn/ui`.**Tasks / Subtasks:*** [ ] Create a state management store (e.g., using Zustand or React Context) to handle the modal's open/closed state globally. The store should have `isOpen`, `openModal`, and `closeModal` properties/methods.

* [ ] Create `src/app/(frontend)/components/landing/WaitlistModal.tsx`.

* [ ] Wrap the buttons in `LandingHeader`, `HeroSection`, etc., with the `DialogTrigger` and connect their `onClick` to the `openModal` action from your state store.

* [ ] Implement the modal content using Shadcn `DialogContent`.

* [ ] Use `useState` within the modal to toggle between the form view and the success view.

* [ ] Re-create the SVG checkmark and its `stroke` animation in `globals.css`.

* [ ] Add the `<WaitlistModal />` component to `src/app/(frontend)/landing/layout.tsx` so it is available across the entire page.
