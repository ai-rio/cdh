# UI Components

## Overview

This document details the reusable UI components for the Creator's Deal Hub frontend application. It defines their purpose, structure, properties (props), states, and usage guidelines, ensuring consistency, reusability, and maintainability across the user interface. Components are designed with a mobile-first philosophy, utilizing React 19.1.0, TypeScript, and Tailwind CSS 4.1.10. With the adoption of Shadcn UI, many common UI elements will now leverage Shadcn's pre-built, customizable components, while unique designs will remain custom.

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
| 2025-06-25 | 0.1 | Initial draft based on home.html and other static files | Winston |
| 2025-06-26 | 0.2 | Updated to integrate Shadcn UI components into the component strategy. | Winston |

## Core UI Components

The following components are identified as key building blocks for the Creator's Deal Hub, primarily derived from the structure of `home.html`, `landing.html`, and other static pages. Where applicable, existing designs will be mapped to Shadcn UI components and customized to match the visual fidelity.

### Global Components

These components are typically used across multiple pages.

    * **Header**
    * **Type**: Custom Component (adapting existing `Header.tsx` structure)
    * **Purpose**: The main navigation header of the site, providing branding (CDH logo), key metrics (Active Deals, Overdue Invoices, Key Contacts), and a mobile navigation toggle.
    * **Source HTML Reference**: `<header class="mission-control-hud">...</header>` from `home.html`.
    * **File Location**: `src/app/(frontend)/components/Header.tsx`.
    * **Props**: `activeDealsCount: number`, `overdueInvoicesCount: number`, `keyContactsCount: number`.
    * **States**: `isCommandDeckOpen: boolean`.
    * **Shadcn UI Integration**: While the overall structure remains custom, internal elements like buttons or dropdowns *within* the header may leverage Shadcn `Button` or `DropdownMenu` components.
    * **CommandDeck (Mobile Navigation Overlay)**
    * **Type**: Shadcn UI Component (Sheet) with Custom Content
    * **Purpose**: A full-screen overlay for mobile navigation.
    * **Source HTML Reference**: `<div id="command-deck">...</div>` from `home.html`.
    * **File Location**: `src/app/(frontend)/components/CommandDeck.tsx` (suggested).
    * **Props**: `isOpen: boolean`, `onClose: () => void`.
    * **States**: None (controlled by props).
    * **Shadcn UI Integration**: This component will likely wrap a Shadcn `Sheet` component to provide the mobile drawer functionality and its associated accessibility and animation. Navigation links within the sheet can use Shadcn's `Button` components with `variant="ghost"` or custom styling.
    * **Footer**
    * **Type**: Custom Component
    * **Purpose**: Site-wide footer, providing secondary navigation links, company information, legal links, and social media links.
    * **Source HTML Reference**: `<footer class="content-section site-footer">...</footer>` from `home.html`.
    * **File Location**: `src/app/(frontend)/components/Footer.tsx` (suggested).
    * **Props**: None.
    * **States**: None.
    * **Shadcn UI Integration**: Individual links or buttons within the footer might use Shadcn `Button` (e.g., `variant="link"`) for consistent styling, but the overall layout and content structure remains custom.
    * **StarfieldCanvas (3D Background)**
        * **Type**: Custom Component
        * **Purpose**: Renders an animated 3D starfield background using Three.js.
        * **Source HTML Reference**: `<canvas id="bg-canvas">...</canvas>` from `home.html`.
        * **File Location**: `src/app/(frontend)/components/StarfieldCanvas.tsx`.
        * **Props**: None.
        * **States**: None.
        * **Shadcn UI Integration**: None. This is a highly specialized graphical component.
    * **EarlyAccessModal (Waitlist Modal)**
        * **Type**: Shadcn UI Component (Dialog) with Custom Form Content
        * **Purpose**: A modal overlay for users to join a waitlist by submitting their name and email.
        * **Source HTML Reference**: `<div id="early-access-modal" class="modal">...</div>` from `home.html`.
        * **File Location**: `src/app/(frontend)/components/EarlyAccessModal.tsx` (suggested).
        * **Props**: `isOpen: boolean`, `onClose: () => void`, `onSubmit: (name: string, email: string) => void`.
        * **States**: `showSuccess: boolean`, `name: string`, `email: string`.
        * **Shadcn UI Integration**: This will wrap a Shadcn `Dialog` component. The internal form elements (Input, Button) should leverage Shadcn's `Input` and `Button` components for consistency and accessibility.
    * **AuthModal (Login/Signup Modal)**
        * **Type**: Shadcn UI Component (Dialog) with Custom Form Content
        * **Purpose**: A modal overlay for user authentication, allowing users to switch between "Sign In" and "Sign Up" forms.
        * **Source HTML Reference**: `<div id="auth-modal" class="modal">...</div>` from `home.html`.
        * **File Location**: `src/app/(frontend)/components/AuthModal.tsx` (suggested).
        * **Props**: `isOpen: boolean`, `onClose: () => void`, `onSignIn: (email: string, password: string) => void`, `onSignUp: (name: string, email: string, password: string) => void`.
        * **States**: `currentView: 'signin' | 'signup'`, `email: string`, `password: string`, `name: string`.
        * **Shadcn UI Integration**: This will also wrap a Shadcn `Dialog`. The form inputs (`Input`, `Label`) and buttons (`Button`) will be sourced from Shadcn UI to maintain consistency and leverage their built-in accessibility. The tab-like interface for Sign In/Sign Up could use Shadcn's `Tabs` component.

    ### Homepage Specific Components

    * **HeroSection**
        * **Type**: Custom Component (integrates Shadcn Button)
        * **Purpose**: Main introductory section of the homepage.
        * **Source HTML Reference**: `<section class="hero-section" id="hero-section">...</section>` from `home.html`.
        * **File Location**: `src/app/(frontend)/components/HeroSection.tsx` (suggested).
        * **Props**: `onRequestEarlyAccess: () => void`.
        * **States**: None.
        * **Shadcn UI Integration**: The "Request Early Access" button will be a Shadcn `Button` component, customized with appropriate Tailwind classes to match the original design's glowing effect (`box-shadow`, `animate-glow`).
    * **InfoSection (Reusable Content Section)**
        * **Type**: Custom Component (integrates Shadcn Card)
        * **Purpose**: Reusable component for displaying content sections with a title and descriptive text.
        * **Source HTML Reference**: `<section class="content-section" id="deals-section">...</section>` from `home.html`.
        * **File Location**: `src/app/(frontend)/components/InfoSection.tsx` (suggested).
        * **Props**: `title: string`, `id: string`, `children: React.ReactNode`.
        * **States**: None.
        * **Shadcn UI Integration**: Each "card" within this section can be implemented using a Shadcn `Card` component, styled to match the dark theme and transparent border.

    ### Landing Page Specific Components

    * **LandingHeader**
        * **Type**: Custom Component (integrates Shadcn Button)
        * **Purpose**: The header for the interactive demo landing page, with scroll-triggered visibility.
        * **Source HTML Reference**: `<header class="main-header">...</header>` from `landing.html`.
        * **File Location**: `src/app/(frontend)/components/LandingHeader.tsx` (suggested).
        * **Props**: None.
        * **States**: `isVisible: boolean` (controlled by scroll event).
        * **Shadcn UI Integration**: The "Join the Waitlist" button within this header will be a Shadcn `Button`, styled to match.
    * **ParticleCanvas**
        * **Type**: Custom Component
        * **Purpose**: Renders dynamic background particles on the landing page for visual effect.
        * **Source HTML Reference**: `<canvas id="particle-canvas">...</canvas>` from `landing.html`.
        * **File Location**: `src/app/(frontend)/components/ParticleCanvas.tsx` (suggested).
        * **Props**: None.
        * **States**: None.
        * **Shadcn UI Integration**: None. This is a specialized graphical component.
    * **AITypingDemo**
        * **Type**: Custom Component (integrates Shadcn Buttons for chips)
        * **Purpose**: Interactive AI co-pilot demonstration with typing animation and dynamic content display.
        * **Source HTML Reference**: `<section class="feature-section ai-copilot-section">...</section>` from `landing.html`.
        * **File Location**: `src/app/(frontend)/components/AITypingDemo.tsx` (suggested).
        * **Props**: None.
        * **States**: `currentPrompt: string`, `displayedResponse: string`, `showChart: boolean`.
        * **Shadcn UI Integration**: The "prompt chips" can be implemented using Shadcn `Button` components, customized for their specific `variant` and styling.
    * **DealsTimeline**
        * **Type**: Custom Component (integrates Shadcn Popover for details)
        * **Purpose**: Visualizes active brand deals on a timeline with interactive details on hover.
        * **Source HTML Reference**: `<section class="feature-section deals-timeline-section">...</section>` from `landing.html`.
        * **File Location**: `src/app/(frontend)/components/DealsTimeline.tsx` (suggested).
        * **Props**: `dealsData: object[]`.
        * **States**: `hoveredDeal: object | null`.
        * **Shadcn UI Integration**: The popover for deal details on hover can utilize Shadcn's `Popover` component for its positioning and accessibility features.
    * **CashflowChart**
        * **Type**: Custom Component (integrates Chart.js)
        * **Purpose**: Displays a dynamic bar chart for projected income.
        * **Source HTML Reference**: `<section class="feature-section cashflow-chart-section">...</section>` from `landing.html`.
        * **File Location**: `src/app/(frontend)/components/CashflowChart.tsx` (suggested).
        * **Props**: `chartData: object`.
        * **States**: None.
        * **Shadcn UI Integration**: While the chart rendering uses Chart.js, any control elements (buttons, selectors) associated with the chart (not explicitly in HTML, but typical) would use Shadcn UI components.
    * **TestimonialCarousel**
        * **Type**: Custom Component (integrates Shadcn Button for navigation)
        * **Purpose**: Displays horizontally scrollable testimonials.
        * **Source HTML Reference**: `<section class="content-section testimonials-section">...</section>` from `landing.html`.
        * **File Location**: `src/app/(frontend)/components/TestimonialCarousel.tsx` (suggested).
        * **Props**: `testimonials: object[]`.
        * **States**: `currentIndex: number`.
        * **Shadcn UI Integration**: The "scroll left" and "scroll right" buttons will be Shadcn `Button` components.
    * **LandingPricingSection**
        * **Type**: Custom Component (integrates Shadcn Button)
        * **Purpose**: Summarized pricing plans section for the landing page.
        * **Source HTML Reference**: `<section class="content-section pricing-section">...</section>` from `landing.html`.
        * **File Location**: `src/app/(frontend)/components/LandingPricingSection.tsx` (suggested).
        * **Props**: `onJoinWaitlist: () => void`.
        * **States**: None.
        * **Shadcn UI Integration**: The "Join the Waitlist" buttons will be Shadcn `Button` components.
    * **LandingFooter**
        * **Type**: Custom Component (integrates Shadcn Button)
        * **Purpose**: Final call to action and copyright for the landing page.
        * **Source HTML Reference**: `<section class="final-cta">...</section>` from `landing.html`.
        * **File Location**: `src/app/(frontend)/components/LandingFooter.tsx` (suggested).
        * **Props**: `onGetEarlyAccess: () => void`.
        * **States**: None.
        * **Shadcn UI Integration**: The "Get Early Access" button will be a Shadcn `Button`.
    * **WaitlistModalLanding**
        * **Type**: Shadcn UI Component (Dialog) with Custom Form Content
        * **Purpose**: Waitlist modal specific to the landing page, with a distinct success animation.
        * **Source HTML Reference**: `<div id="waitlist-modal" class="modal">...</div>` from `landing.html`.
        * **File Location**: `src/app/(frontend)/components/WaitlistModalLanding.tsx` (suggested).
        * **Props**: `isOpen: boolean`, `onClose: () => void`, `onSubmit: (name: string, email: string) => void`.
        * **States**: `showSuccess: boolean`, `name: string`, `email: string`.
        * **Shadcn UI Integration**: Similar to `EarlyAccessModal`, this will wrap a Shadcn `Dialog`. The form elements (`Input`, `Button`) will be Shadcn components. The success animation (checkmark) will be a custom integration within Shadcn's dialog content.

    ### Other Page Specific Components

    * **FoundersKeyCard (Pricing Page Specific)**
        * **Type**: Custom Component (integrates Shadcn Button)
        * **Purpose**: Prominent card on the pricing page highlighting a special "Founder's Circle" offer.
        * **Source HTML Reference**: `<div class="founders-key-card">...</div>` from `pricing.html`.
        * **File Location**: `src/app/(frontend)/components/FoundersKeyCard.tsx` (suggested).
        * **Props**: `onClaimOffer: () => void`.
        * **States**: `countdown: string`.
        * **Shadcn UI Integration**: The "Claim My Founder's Key" button will be a Shadcn `Button`.
    * **PricingCard (Pricing Page Specific)**
        * **Type**: Custom Component (integrates Shadcn Button)
        * **Purpose**: Reusable component for displaying different pricing plans.
        * **Source HTML Reference**: `<div class="pricing-card">...</div>` from `pricing.html`.
        * **File Location**: `src/app/(frontend)/components/PricingCard.tsx` (suggested).
        * **Props**: `planName: string`, `description: string`, `monthlyPrice: string`, `annuallyPrice: string`, `features: string[]`, `isPopular?: boolean`, `onChoosePlan: () => void`, `billingPeriod: 'monthly' | 'annually'`.
        * **States**: None.
        * **Shadcn UI Integration**: The "Choose Plan" buttons will be Shadcn `Button` components.
    * **BillingToggle (Pricing Page Specific)**
        * **Type**: Shadcn UI Component (ToggleGroup)
        * **Purpose**: Toggles between monthly and annual billing periods on the pricing page.
        * **Source HTML Reference**: `<div class="billing-toggle">...</div>` from `pricing.html`.
        * **File Location**: `src/app/(frontend)/components/BillingToggle.tsx` (suggested).
        * **Props**: `onToggle: (period: 'monthly' | 'annually') => void`, `currentPeriod: 'monthly' | 'annually'`.
        * **States**: None (controlled by props).
        * **Shadcn UI Integration**: This is a prime candidate for Shadcn's `ToggleGroup` component, providing out-of-the-box functionality for exclusive selection.
    * **MissionCard (Careers Page Specific)**
        * **Type**: Custom Component (integrates Shadcn Button)
        * **Purpose**: Displays individual "open missions" (job postings).
        * **Source HTML Reference**: `<div class="mission-card">...</div>` from `carreers.html`.
        * **File Location**: `src/app/(frontend)/components/MissionCard.tsx` (suggested).
        * **Props**: `title: string`, `department: string`, `location: string`, `briefing: string`, `onViewBriefing: (mission: MissionData) => void`.
        * **States**: None.
        * **Shadcn UI Integration**: The "View Briefing" button will be a Shadcn `Button`.
    * **MissionBriefingModal (Careers Page Specific)**
        * **Type**: Shadcn UI Component (Dialog) with Custom Form Content
        * **Purpose**: Displays detailed briefing for a selected job mission and allows users to apply.
        * **Source HTML Reference**: `<div id="mission-briefing-modal">...</div>` from `carreers.html`.
        * **File Location**: `src/app/(frontend)/components/MissionBriefingModal.tsx` (suggested).
        * **Props**: `isOpen: boolean`, `onClose: () => void`, `mission: MissionData`, `onSubmit: (formData: any) => void`.
        * **States**: `currentView: 'briefing' | 'apply' | 'success'`.
        * **Shadcn UI Integration**: Wraps a Shadcn `Dialog`. Form inputs (`Input`, `Textarea`), radio buttons (`RadioGroup`), and buttons (`Button`) will use Shadcn components.
    * **TriageCard (Contact Page Specific)**
        * **Type**: Custom Component (integrates Shadcn Card)
        * **Purpose**: Allows users to select a communication channel.
        * **Source HTML Reference**: `<div class="triage-card">...</div>` from `contact.html`.
        * **File Location**: `src/app/(frontend)/components/TriageCard.tsx` (suggested).
        * **Props**: `title: string`, `description: string`, `formType: 'demo' | 'press' | 'general'`, `onSelect: (formType: 'demo' | 'press' | 'general') => void`.
        * **States**: None.
        * **Shadcn UI Integration**: Can use Shadcn `Card` as the outer container for each triage option.
    * **ContactFormView (Contact Page Specific)**
        * **Type**: Custom Component (integrates Shadcn Form components)
        * **Purpose**: Displays a dynamic contact form based on the selected channel.
        * **Source HTML Reference**: `<div id="form-container-view">...</div>` from `contact.html`.
        * **File Location**: `src/app/(frontend)/components/ContactFormView.tsx` (suggested).
        * **Props**: `isOpen: boolean`, `formTitle: string`, `formFields: string`, `onBack: () => void`, `onSubmit: (formData: any) => void`.
        * **States**: Form input states.
        * **Shadcn UI Integration**: Forms within this component should leverage Shadcn's `Form` component for structure, and `Input`, `Textarea`, `Label`, `Button` for individual controls.
    * **SuccessMessageView (Contact Page Specific)**
        * **Type**: Custom Component (integrates Shadcn Button)
        * **Purpose**: Displays a success message after a contact form submission.
        * **Source HTML Reference**: `<div id="success-view">...</div>` from `contact.html`.
        * **File Location**: `src/app/(frontend)/components/SuccessMessageView.tsx` (suggested).
        * **Props**: `isOpen: boolean`, `message: string`.
        * **States**: None.
        * **Shadcn UI Integration**: The "Close Window" button can be a Shadcn `Button`.
    * **HoloPanel (404 Page Specific)**
        * **Type**: Custom Component (integrates Shadcn Button)
        * **Purpose**: A central panel on the 404 page, displaying "Signal Lost" message and a "Re-establish Connection" button.
        * **Source HTML Reference**: `<div class="holo-panel">...</div>` from `404_Signal_Lost.html`.
        * **File Location**: `src/app/(frontend)/components/HoloPanel.tsx` (suggested).
        * **Props**: None.
        * **States**: None.
        * **Shadcn UI Integration**: The "Re-establish Connection" button will be a Shadcn `Button`.

    ## Component Design Principles

    * **Reusability**: Design components to be as generic and reusable as possible, accepting props to customize content and behavior. Prioritize using Shadcn UI components for common patterns to maximize reusability and maintainability.
    * **Single Responsibility Principle**: Each component should ideally have one primary reason to change.
    * **Composition**: Prefer composing smaller, simpler components (including Shadcn primitives) to build more complex UI elements.
    * **Accessibility**: All components must adhere to accessibility guidelines (e.g., semantic HTML, keyboard navigation, ARIA attributes). Shadcn UI components provide strong accessibility foundations that will be leveraged.
    * **Responsiveness (Mobile-First)**: Components are built and styled with a mobile-first approach using Tailwind CSS, ensuring proper display and functionality across various screen sizes. Shadcn UI components are inherently responsive and designed to integrate with Tailwind.
    * **Performance**: Optimize components for performance (e.g., memoization where appropriate, efficient rendering), especially for animated sections.

    ## Usage Guidelines

    * **Props**: Clearly define prop types using TypeScript interfaces for better developer experience and type safety.
    * **Styling**: Primarily use Tailwind CSS utility classes. For Shadcn components, leverage their `className` prop and `cn` utility for conditional styling and merging. For complex or component-specific styles not easily achievable with utilities, utilize CSS Modules or extend Tailwind as per Shadcn's theming guidance.
    * **Client vs. Server Components**: Differentiate between "use client" components (interactive, browser-specific logic) and server components (static rendering, data fetching on the server) appropriately. Components utilizing Shadcn UI will generally be client components.
    * **Shadcn UI Components Integration**:
        * **Installation**: Components are added via `npx shadcn-ui@latest add <component-name>`. This copies the component code directly into the project, allowing full customization.
        * **Customization**: Tailor Shadcn components using Tailwind CSS classes, either directly on the component or by modifying the component's source code (as it's local). Ensure brand colors are mapped to Tailwind configuration and applied consistently.
        * **Theming**: Adhere to the defined color palette by overriding Shadcn's default CSS variables in `src/app/(frontend)/styles.css` (or `globals.css`) where necessary, following Shadcn's theming instructions.

    ## Related Resources

    * [Frontend Architecture](./frontend-architecture.md)
    * [UI/UX Specification](./ui-ux-spec.md)
    * [Core Workflows](./core-workflows.md)
    * [Coding Standards](./coding-standards.md)
    * [Testing Strategy](./testing-strategy.md)
    * [Shadcn UI Documentation](https://ui.shadcn.com/docs) (External Reference)