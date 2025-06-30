
# Core Workflows

## Overview

# This document illustrates the core user interaction flows and associated data flows within the Creator's Deal Hub frontend application. It provides a visual and textual representation of how users navigate and interact with key features, from initial access to performing primary tasks. Understanding these workflows is essential for both human and AI development agents to build intuitive and cohesive user experiences.

### Change Log

# | Date       | Version | Description                                             | Author  |
| ---------- | ------- | ------------------------------------------------------- | ------- |
| 2025-06-25 | 0.1     | Initial draft based on home.html and other static pages | Winston |

## Key User Journeys and Flows

### 1. Homepage Navigation & Content Exploration

# **User Goal:** Understand the value proposition and navigate to key content sections on the homepage.**Entry Points:** Direct access to root URL (`/`), external links.**Success Criteria:** User successfully views all major homepage sections and understands the primary offerings.

#### Flow Diagram

Snippet de código    sequenceDiagram
        actor User
        participant Browser
        participant Frontend(Next.js)
        participant Three.js(Canvas)
        participant API(Payload CMS)

        User->>Browser: Navigates to /
        Browser->>Frontend: Loads homepage (page.tsx)
        Frontend->>Frontend: Renders Header, HeroSection, StarfieldCanvas
        Frontend->>Three.js(Canvas): Initializes 3D scene (StarfieldCanvas.tsx)
        Note over Frontend: Components fetch their own static/initial data if needed
        User->>User: Scrolls down the page
        User->>Frontend: Interacts with scroll-triggered animations (GSAP)
        Frontend->>Frontend: Renders InfoSection components (Deals, Finance, Contacts)
        User->>User: Clicks HUD item (e.g., Active Deals)
        Frontend->>Frontend: Smooth scrolls to target section (e.g., #deals-section)**Edge Cases & Error Handling:*** **Browser compatibility**: Ensure graceful degradation if Three.js/GSAP animations are not fully supported.

* **Slow loading**: Implement loading states or skeleton screens for content.**Notes:** This flow represents the primary landing page experience, focusing on visual engagement and content discovery.
======================================================================================================================================================================================================

### 2. Early Access Request

# **User Goal:** Join the waitlist for early access to the Creator's Deal Hub.**Entry Points:** "Request Early Access" button on Hero Section, "Get Early Access" button on Footer, "Claim My Founder's Key" on Pricing page.**Success Criteria:** User's information is submitted, and a success confirmation is displayed.

#### Flow Diagram

Snippet de código    sequenceDiagram
        actor User
        participant Frontend(Next.js)
        participant EarlyAccessModal
        participant Backend(Payload CMS)

        User->>Frontend: Clicks "Request Early Access" (HeroSection/Footer)
        Frontend->>EarlyAccessModal: Triggers modal open (sets isOpen=true)
        User->>EarlyAccessModal: Enters Name and Email
        User->>EarlyAccessModal: Clicks "Secure My Spot"
        EarlyAccessModal->>Backend: Submits form data (e.g., POST /api/waitlist-signup - future API)
        Backend-->>EarlyAccessModal: Responds with success/failure
        alt Submission Successful
            EarlyAccessModal->>EarlyAccessModal: Hides form, displays success message
            User->>EarlyAccessModal: Views confirmation
        else Submission Failed
            EarlyAccessModal->>EarlyAccessModal: Displays error message on form
            User->>User: Retries or corrects input
        end
        User->>EarlyAccessModal: Clicks close button
        EarlyAccessModal->>Frontend: Triggers modal close (sets isOpen=false)**Edge Cases & Error Handling:*** **Invalid Email/Name**: Client-side validation to provide immediate feedback.

* **Network Error**: Display a user-friendly message and allow retry.

* **Duplicate Submission**: Inform user if they are already on the waitlist.
============================================================================

### 3. User Authentication (Sign In/Sign Up)

# **User Goal:** Log in to an existing account or create a new account.**Entry Points:** "Login" link in Command Deck, direct navigation to `/login`.**Success Criteria:** User successfully logs in/signs up and is redirected to the dashboard (future functionality).

#### Flow Diagram

Snippet de código    sequenceDiagram
        actor User
        participant Frontend(Next.js)
        participant AuthModal
        participant API(Payload CMS)

        User->>Frontend: Clicks "Login" (CommandDeck)
        Frontend->>AuthModal: Triggers modal open (sets isOpen=true)
        User->>AuthModal: Selects "Sign In" or "Sign Up" tab
        AuthModal->>User: Displays corresponding form

        alt Sign In Flow
            User->>AuthModal: Enters Email and Password
            User->>AuthModal: Clicks "Launch Command Center"
            AuthModal->>API: POST /api/users/login (credentials)
            API-->>AuthModal: Responds with JWT token/user data or error
            alt Login Successful
                AuthModal->>Frontend: Stores token (e.g., in cookies) & closes modal
                Frontend->>Frontend: Redirects to authenticated dashboard (future)
            else Login Failed
                AuthModal->>AuthModal: Displays error message (invalid credentials)
            end
        else Sign Up Flow
            User->>AuthModal: Enters Name, Email, and Password
            User->>AuthModal: Clicks "Create My Account"
            AuthModal->>API: POST /api/users (new user data)
            API-->>AuthModal: Responds with new user data or error
            alt Sign Up Successful
                AuthModal->>Frontend: Auto-logs in (or prompts for login) & closes modal
                Frontend->>Frontend: Redirects to authenticated dashboard (future)
            else Sign Up Failed
                AuthModal->>AuthModal: Displays error message (e.g., email already exists)
            end
        end
        User->>AuthModal: Clicks close button
        AuthModal->>Frontend: Triggers modal close (sets isOpen=false)**Edge Cases & Error Handling:*** **Invalid Input**: Client-side validation for email format, password strength.

* **Network Issues**: Display an error message and provide retry options.

* **Server Errors**: Generic error messages for unexpected issues.
==================================================================

### 4. Contact Form Submission

# **User Goal:** Send a specific inquiry (Demo, Press, General) to the Creator's Deal Hub team.**Entry Points:** Navigation to `/contact`.**Success Criteria:** User's message is submitted, and a success confirmation is displayed.

#### Flow Diagram

Snippet de código    sequenceDiagram
        actor User
        participant Frontend(Next.js)
        participant TriageView
        participant ContactFormView
        participant SuccessMessageView
        participant Backend(Email Service)

        User->>Frontend: Navigates to /contact
        Frontend->>TriageView: Displays initial channel selection cards
        User->>TriageView: Clicks a TriageCard (e.g., "Request a Private Demo")
        TriageView->>ContactFormView: Transitions to selected form, hides TriageView
        User->>ContactFormView: Fills out form fields (Name, Email, Company, Message etc.)
        User->>ContactFormView: Clicks "Submit Request"
        ContactFormView->>Backend(Email Service): Submits form data (e.g., via Next.js API route or direct form action)
        Backend(Email Service)-->>ContactFormView: Responds with success/failure
        alt Submission Successful
            ContactFormView->>SuccessMessageView: Transitions to success message, hides form
            User->>SuccessMessageView: Views confirmation
        else Submission Failed
            ContactFormView->>ContactFormView: Displays error message on form
            User->>User: Retries or corrects input
        end
        User->>SuccessMessageView: Clicks "Close Window" or "Select a different channel"
        SuccessMessageView->>TriageView: Transitions back to TriageView**Edge Cases & Error Handling:*** **Form Validation**: Client-side validation to ensure required fields are filled and formats are correct.

* **API Failure**: Display an error message and advise the user to try again later or use alternative contact methods.
======================================================================================================================

## Related Resources

# - [Frontend Architecture](./frontend-architecture.md)

- [UI Components](./components.md)

- [UI/UX Specification](./ui-ux-spec.md) (to be created)

- [REST API Specification](./rest-api-spec.md)
