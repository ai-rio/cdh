# Technology Stack

## Overview

This document provides a definitive list of the technologies, languages, frameworks, and tools used in the Creator's Deal Hub project. Its purpose is to ensure consistency across development efforts by both human and AI agents, serving as the single source of truth for all technology selections and their specific versions. Adherence to these standards is mandatory for all contributions.


### Change Log

| Date       | Version | Description                            | Author  |
| ---------- | ------- | -------------------------------------- | ------- |
| 2025-06-25 | 0.1     | Initial draft based on package.json    | Winston |
| 2025-06-26 | 0.2     | Added Shadcn UI to the frontend stack. | Winston |


## Cloud Infrastructure

- **Provider:** Vercel (Implied by Next.js setup and Payload CMS integration, which is often deployed on Vercel or similar platforms).

- **Key Services:**

  - Next.js (for frontend deployment, static site generation, server-side rendering, and API routes).

  - Payload CMS (for backend API and content management).

  - Supabase PostgreSQL (for database hosting).

- **Deployment Regions:** Global (as typical for Vercel and Supabase).


## Technology Stack Table

This table specifies the exact technologies and their versions that are to be used across the Creator's Deal Hub project.



| Category                 | Technology                            | Version         | Purpose                                               | Rationale                                                                                                                    |
| ------------------------ | ------------------------------------- | --------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Frontend Language**    | TypeScript                            | 5.7.3           | Type-safe frontend development                        | Strong typing, excellent tooling, enhances code quality and maintainability.                                                 |
| **Frontend Framework**   | Next.js                               | 15.3.0          | React framework with SSR/SSG                          | Chosen for performance, SEO benefits, and Vercel integration, aligning with the goal of a dynamic, component-based homepage. |
| **UI Component Library** | React                                 | 19.1.0          | Base UI library                                       | Provides a declarative way to build user interfaces.                                                                         |
| **Component System**     | Shadcn UI                             | (Latest Stable) | Pre-built, customizable UI components                 | Accelerates UI development, provides accessible and responsive components, aligns with Tailwind CSS.                         |
| **State Management**     | React hooks (`useState`, `useEffect`) | N/A             | Local component state management                      | Lightweight and built-in for managing component-specific UI states.                                                          |
| **Backend Language**     | TypeScript                            | 5.7.3           | Type-safe backend development                         | Enables code sharing with the frontend and consistency across the full stack.                                                |
| **Backend Framework**    | Payload CMS                           | 3.43.0          | Headless CMS and backend API                          | Decouples content management from the presentation layer, offering flexibility and performance.                              |
| **API Style**            | REST (via Payload CMS API)            | N/A             | Data fetching and content management                  | Standard API for communication between frontend and backend.                                                                 |
| **Database**             | PostgreSQL                            | N/A             | Primary data store                                    | Chosen for its reliability, relational capabilities, and integration with Supabase.                                          |
| **Cache**                | N/A                                   | N/A             | Not explicitly defined yet for project-level caching. | Next.js's caching mechanisms will be leveraged by default.                                                                   |
| **File Storage**         | N/A                                   | N/A             | Not explicitly defined yet.                           | Payload CMS handles file storage internally (often integrated with cloud storage like S3).                                   |
| **Authentication**       | Payload CMS built-in                  | 3.43.0          | User authentication and authorization                 | Integrated with Payload CMS for secure user management.                                                                      |
| **Frontend Testing**     | N/A                                   | N/A             | Not explicitly defined yet.                           | Will be determined based on specific testing requirements.                                                                   |
| **Backend Testing**      | N/A                                   | N/A             | Not explicitly defined yet.                           | Will be determined based on specific testing requirements.                                                                   |
| **E2E Testing**          | N/A                                   | N/A             | Not explicitly defined yet.                           | Will be determined based on specific testing requirements.                                                                   |
| **Build Tool**           | Next.js Build System                  | 15.3.0          | Compiling and optimizing application                  | Integrated with Next.js for efficient build processes.                                                                       |
| **Bundler**              | Webpack (via Next.js)                 | N/A             | Module bundling                                       | Handled by Next.js internally for optimal performance.                                                                       |
| **IaC Tool**             | N/A                                   | N/A             | Not explicitly defined yet.                           | Infrastructure-as-Code may be handled by Vercel's platform features or external tools if needed.                             |
| **CI/CD**                | Vercel (Implicit)                     | N/A             | Continuous Integration/Continuous Deployment          | Vercel provides automated CI/CD for Next.js applications.                                                                    |
| **Monitoring**           | N/A                                   | N/A             | Not explicitly defined yet.                           | Will leverage platform-specific monitoring tools and potentially third-party services.                                       |
| **Logging**              | N/A                                   | N/A             | Not explicitly defined yet.                           | Will leverage platform-specific logging mechanisms.                                                                          |
| **CSS Framework**        | Tailwind CSS                          | 4.1.10          | Utility-first CSS framework                           | For rapid and consistent styling across the application.                                                                     |
| **3D Graphics**          | Three.js                              | 0.177.0         | Interactive 3D animations                             | Used for visually engaging experiences like the starfield background.                                                        |
| **Animation Library**    | GSAP                                  | 3.13.0          | Advanced animation capabilities                       | For smooth and complex animations.                                                                                           |
| **Charting Library**     | Chart.js                              | (inferred)      | For rendering interactive charts.                     | Used for displaying data visualizations on the landing page.                                                                 |