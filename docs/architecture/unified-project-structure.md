# **Unified Project Structure**



## **Overview**

This document defines the standard project structure and organization for the Creator's Deal Hub. It outlines the directory layout, module separation, and naming conventions to ensure consistency, improve navigability for both human and AI development agents, and facilitate scalable fullstack development within a monorepo setup. With the adoption of Shadcn UI, the src/components/ui/ directory will specifically house Shadcn components.

### **Change Log**




|            |         |                                                                            |         |
| ---------- | ------- | -------------------------------------------------------------------------- | ------- |
| Date       | Version | Description                                                                | Author  |
| 2025-06-25 | 0.1     | Initial draft based on provided project structure                          | Winston |
| 2025-06-26 | 0.2     | Updated to reflect Shadcn UI component location within src/components/ui/. | Winston |


## **Project Root Directory Structure**

The project adheres to a monorepo structure, housing both the Next.js frontend and the Payload CMS backend, along with shared configurations and documentation.

Plaintext



CDH /
├── .bmad-core/                 # BMAD Core configuration and agents
│   ├── core-config.yml
│   ├── install-manifest.yml
│   ├── agent-teams/
│   ├── agents/
│   ├── checklists/
│   ├── data/
│   ├── tasks/
│   ├── templates/
│   ├── utils/
│   └── workflows/
├── .env.example                # Example environment variables
├── .git/                       # Git version control
├── .gitignore                  # Git ignore file
├── .next/                      # Next.js build output
├── .npmrc                      # npm configuration
├── .prettierrc.json            # Prettier configuration
├── .trae/                      # Trae configuration
├── .vscode/                    # VS Code settings
├── .yarnrc                     # Yarn configuration
├── bun.lock                    # Bun package manager lock file
├── components.json             # Configuration for shared UI components (Shadcn/UI)
├── docker-compose.yml          # Docker Compose for local development environment
├── Dockerfile                  # Docker configuration for environment setup
├── docs/                       # Project documentation
│   ├── architecture/           # Architectural documentation
│   │   ├── backend-architecture.md
│   │   ├── brownfield_enhancement_architecture.md
│   │   ├── coding-standards.md
│   │   ├── components.md
│   │   ├── core-workflows.md
│   │   ├── data-models.md
│   │   ├── database-schema.md
│   │   ├── deployment-guide.md
│   │   ├── error-handling-strategy.md
│   │   ├── external-apis.md
│   │   ├── frontend-architecture.md
│   │   ├── fullstack-architecture.md
│   │   ├── index.md
│   │   ├── performance-guidelines.md
│   │   ├── rest-api-spec.md
│   │   ├── security-considerations.md
│   │   ├── tech-stack.md
│   │   ├── testing-strategy.md
│   │   ├── troubleshooting-guide.md
│   │   ├── ui-ux-spec.md
│   │   └── unified-project-structure.md
│   ├── html/                   # Original static HTML files for reference
│   │   ├── 404_Signal_Lost.html
│   │   ├── Terms_of_Service.html
│   │   ├── The_living_data_contract.html
│   │   ├── about.html
│   │   ├── blog_post_template.html
│   │   ├── carreers.html
│   │   ├── contact.html
│   │   ├── home.html
│   │   ├── landing.html
│   │   └── pricing.html
│   ├── prd/                    # Product Requirements Documents (sharded)
│   │   └── prd.md
│   ├── prompts/                # AI prompt templates
│   │   └── creative_design.md
│   └── stories/                # User stories (sharded)
│       └── story1.1.md
├── eslint.config.mjs           # ESLint configuration
├── GEMINI.md                   # Gemini agent configuration
├── next-env.d.ts               # Next.js environment type definitions
├── next.config.mjs             # Next.js configuration
├── node_modules/               # Node.js dependencies
├── package.json                # Project package manifest
├── package-lock.json           # npm package lock file
├── postcss.config.cjs          # PostCSS configuration (for Tailwind CSS)
├── README.md                   # Main project README
├── src/                        # Application source code
│   ├── app/                    # Next.js App Router structure
│   │   ├── (frontend)/         # Route group for public-facing frontend
│   │   │   ├── components/     # Reusable UI components specific to frontend application
│   │   │   │   └── Header.tsx
│   │   │   ├── layout.tsx      # Root layout for frontend pages
│   │   │   ├── page.tsx        # Homepage (root) component
│   │   │   └── styles.css      # Global CSS styles for frontend
│   │   ├── (payload)/          # Route group for Payload CMS admin and API
│   │   │   ├── admin/          # Payload admin panel routes
│   │   │   │   ├── [[...segments]]/
│   │   │   │   │   ├── not-found.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── importMap.js
│   │   │   ├── api/            # Payload API routes
│   │   │   │   ├── [...slug]/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── graphql/
│   │   │   │   │   └── route.ts
│   │   │   │   └── graphql-playground/
│   │   │   │       └── route.ts
│   │   │   ├── custom.scss
│   │   │   └── layout.tsx
│   │   └── my-route/           # Example custom route
│   │       └── route.ts
│   ├── collections/            # Payload CMS collections (data models)
│   │   ├── Media.ts
│   │   └── Users.ts
│   ├── components/             # Shared UI components (e.g., Shadcn/UI primitives)
│   │   └── ui/                 # Shadcn UI components (copied into project)
│   │       ├── button.tsx
│   │       └── card.tsx
│   │       └── dialog.tsx
│   │       └── input.tsx
│   ├── lib/                    # Utility functions and libraries
│   │   └── utils.ts
│   ├── payload-types.ts        # Payload CMS generated TypeScript types
│   └── payload.config.ts
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration


## **Key Directories and Their Purpose**

- ./: The project root, containing global configurations, build scripts, and documentation.

- ./docs/: Central repository for all project documentation, including architectural diagrams, PRDs, and user stories.

* ./docs/architecture/: Contains detailed architectural documentation.

* ./docs/html/: Stores the original static HTML files that are being converted.

* ./docs/prd/: Contains the Product Requirements Document.

* ./docs/stories/: Contains individual user stories.

- ./src/: Contains all application source code.

* ./src/app/: Next.js App Router structure.

- ./src/app/(frontend)/: Houses the public-facing Next.js frontend application. This is where components and pages for the main website reside.

- ./src/app/(payload)/: Contains the Payload CMS admin panel and its API routes, logically separated from the frontend.

* ./src/collections/: Defines Payload CMS data collections (similar to database models).

* ./src/components/: Stores shared UI components.

- ./src/components/ui/: **Specifically designated for Shadcn UI components.** When npx shadcn-ui\@latest add <component> is run, the component's code is copied here, allowing for direct customization.

* ./src/lib/: Common utility functions.

- ./public/: (Implicit in Next.js structure) For static assets (images, fonts, etc.).


## **Component Organization**

- **Application-Specific Components**: Components used only within the frontend application (e.g., Header.tsx for the main site layout, HeroSection.tsx) are located under src/app/(frontend)/components/.

- **Shadcn UI Components**: Reusable, generic UI components sourced from Shadcn UI (e.g., button.tsx, card.tsx, dialog.tsx) are placed under src/components/ui/. These are designed to be highly customizable via Tailwind CSS.

- **Shared UI Primitives (Pre-Shadcn)**: If any pre-existing generic UI primitives were in src/components/ui/ before Shadcn adoption, they should either be replaced by Shadcn equivalents or explicitly designated as custom primitives within that folder.

## **Naming Conventions**

- **Folders**: Generally kebab-case.

- **Files**: Follows PascalCase for React components and TypeScript types/interfaces, and camelCase for utility functions (as detailed in docs/architecture/coding-standards.md).

- **Next.js App Router**: Adheres to Next.js conventions for app directory, route groups (), and special files (layout.tsx, page.tsx, route.ts).

## **Related Resources**

- [Coding Standards](./coding-standards.md)

- [Technology Stack](./tech-stack.md)

- [Fullstack Architecture](./fullstack-architecture.md) (to be created, will link to this structure)

- [UI Components](./components.md)