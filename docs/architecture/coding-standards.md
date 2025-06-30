# **Coding Standards**



## **Overview**

This document outlines the mandatory coding standards and conventions for the Creator's Deal Hub project. Adherence to these guidelines is crucial for maintaining code quality, consistency, readability, and team collaboration, especially given the involvement of both human and AI development agents. These standards apply to all code developed for both the frontend (Next.js, React, TypeScript, Tailwind CSS, Shadcn UI) and the backend (Payload CMS, TypeScript).


### **Change Log**



|            |         |                                                          |         |
| ---------- | ------- | -------------------------------------------------------- | ------- |
| Date       | Version | Description                                              | Author  |
| 2025-06-25 | 0.1     | Initial draft based on project tech stack                | Winston |
| 2025-06-26 | 0.2     | Updated to include guidelines for Shadcn UI integration. | Winston |


## **Core Standards**



### **Languages & Runtimes**

- **TypeScript**: 5.7.3

- **Node.js**: ^18.20.2 || >=20.9.0 (as per package.json engines)

- **React**: 19.1.0

- **Next.js**: 15.3.0


### **Style & Linting**

- **ESLint**: Enforced using eslint.config.mjs with eslint-config-next.

- **Prettier**: Used for code formatting to ensure consistent style across the codebase.

- **Tailwind CSS**: Utility-first approach for styling. Follow Tailwind's recommended practices for class application.

- **Shadcn UI**: Components are integrated directly into the codebase and styled using Tailwind CSS. Follow Shadcn's recommended cn utility for combining and conditionally applying Tailwind classes.

- **Automatic Formatting**: Developers must ensure prettier and eslint checks pass before committing code. Integration with IDE format-on-save is highly recommended.


### **Test Organization**

- Test files should ideally reside next to the component/module they test, or in a __tests__ or tests subdirectory within the module's folder.

- All testing activities, including unit, integration, E2E, performance, and security tests, must adhere to the comprehensive strategy defined in [Testing Strategy](./testing-strategy.md).


## **Naming Conventions**



### **General Principles**

- Be descriptive and unambiguous.

- Use full words rather than abbreviations unless the abbreviation is widely understood within the domain (e.g., API).

- Consistency is paramount.


### **Specific Conventions**



|                                 |                        |                                                        |
| ------------------------------- | ---------------------- | ------------------------------------------------------ |
| Element                         | Convention             | Example                                                |
| **Variables**                   | camelCase              | const userName = 'John Doe';                           |
| **Functions**                   | camelCase              | function calculateTotalPrice() { ... }                 |
| **Components**                  | PascalCase             | UserProfileCard.tsx                                    |
| **Hooks**                       | use prefix + camelCase | useAuth.ts                                             |
| **TypeScript Types/Interfaces** | PascalCase             | interface UserProfile { ... }                          |
| **Files (Components)**          | PascalCase.tsx         | Button.tsx                                             |
| **Files (Hooks)**               | useHookName.ts         | useMediaQuery.ts                                       |
| **Files (Utilities)**           | camelCase.ts           | formatDate.ts                                          |
| **CSS Classes (if custom)**     | kebab-case             | mission-control-hud (already in styles.css for Header) |
| **Folders**                     | kebab-case             | src/app/(frontend)/components                          |


## **Critical Rules**

These rules are critical and must be strictly adhered to by all developers, including AI agents, to ensure project quality and maintainability.

- **"use client" directive**: Always place "use client"; at the very top of files for client-side components using interactive browser features. This includes components imported from Shadcn UI, as they are client-side interactive.

- **Absolute Imports**: Prefer absolute imports using @/ alias for src/ directory where configured (e.g., import { Button } from "@/components/ui/button";). Shadcn UI components, once added, will also follow this pattern.

- **No Direct DOM Manipulation**: Avoid direct DOM manipulation outside of React's lifecycle methods and refs where necessary.

- **Consistent Component Structure**: Follow established patterns for React components (e.g., using FC for function components, props destructuring). For Shadcn components, use them as provided and extend with className or cn utility for styling, avoiding direct modification of their core logic unless absolutely necessary.

- **Type Safety**: Always leverage TypeScript for strong typing. Avoid any unless absolutely necessary and justified. Ensure types are used for all props and state in custom components, and leverage types provided by Shadcn UI.

- **Accessibility**: Ensure all UI components and interactions adhere to accessibility best practices (e.g., proper ARIA attributes, keyboard navigation). Leverage Shadcn UI's inherent accessibility features (built on Radix UI) for all components obtained through it.

- **Performance Awareness**: Be mindful of performance implications, especially in React components (e.g., avoid unnecessary re-renders, optimize large lists). Pay particular attention to complex animations (Three.js, GSAP, Chart.js) and ensure they are optimized.

- **Error Handling**: Implement consistent error handling mechanisms across both frontend and backend.

- **Environment Variables**: Access environment variables securely and consistently via process.env (for Node.js/Next.js server-side) or process.env.NEXT_PUBLIC_ (for client-side) and ensure they are properly loaded and validated. Never hardcode sensitive information.

- **Cross-Cutting Concerns**: Handle cross-cutting concerns like logging, authentication, and error reporting through centralized services or utilities rather than scattering logic throughout components.


## **Language-Specific Guidelines**



### **TypeScript Specifics**

- **Strict Mode**: Adhere to TypeScript's strict mode settings (as configured in tsconfig.json).

- **Interface vs. Type**: Prefer interface for object types when defining public APIs, and type for aliases, unions, or complex types.

- **Function Overloads**: Use function overloads for functions that can accept different argument types or return different types.


## **Related Resources**

- [Technology Stack](./tech-stack.md)

- [Unified Project Structure](./unified-project-structure.md)

- [Testing Strategy](./testing-strategy.md)

- [UI/UX Specification](./ui-ux-spec.md)

- [UI Components](./components.md)


## **Git Branch Policy**

This section outlines the Git branching strategy and workflow for the Creator's Deal Hub project, ensuring a consistent and collaborative development process.

### **Branching Model: Simplified Gitflow**

We will adopt a simplified Gitflow model, centered around a `main` branch for production-ready code and a `dev` branch for ongoing development.

*   **`main` branch**: Represents the production-ready codebase. Only stable, fully tested code is merged into `main`. Direct commits to `main` are strictly prohibited.
*   **`dev` branch**: The primary integration branch for all new features and bug fixes. All development work starts from and is merged back into `dev`.
*   **Feature branches (`feature/<feature-name>`)**: Created from `dev` for developing new features. They should be short-lived and merged back into `dev` upon completion.
*   **Bugfix branches (`bugfix/<bug-description>`)**: Created from `dev` (or `main` for hotfixes) to address bugs. Merged back into `dev` (or `main` for hotfixes).
*   **Hotfix branches (`hotfix/<hotfix-description>`)**: Created directly from `main` to quickly address critical production issues. Merged back into both `main` and `dev`.
*   **Release branches (`release/<version>`)**: Created from `dev` when preparing for a new release. Used for final testing, bug fixing, and preparing release notes. Merged into `main` and `dev`.

### **Branch Naming Conventions**

*   **Feature**: `feature/<descriptive-feature-name>` (e.g., `feature/user-onboarding`, `feature/dark-mode-toggle`)
*   **Bugfix**: `bugfix/<short-description-of-bug>` (e.g., `bugfix/login-issue`, `bugfix/chart-display-error`)
*   **Hotfix**: `hotfix/<critical-issue-description>` (e.g., `hotfix/prod-api-down`)
*   **Release**: `release/<version-number>` (e.g., `release/1.0.0`)

### **Development Workflow**

1.  **Start New Work**: Always create a new `feature` or `bugfix` branch from the latest `dev` branch.
    ```bash
    git checkout dev
    git pull origin dev
    git checkout -b feature/my-new-feature
    ```
2.  **Develop and Commit**: Work on your branch, making small, atomic commits with clear messages.
3.  **Pull Request (PR)**: Once work is complete and tested locally, open a Pull Request from your feature/bugfix branch to the `dev` branch.
4.  **Code Review**: All PRs require at least one approval from another developer. Address all review comments.
5.  **CI/CD Checks**: Ensure all automated CI/CD checks (linting, tests, build) pass on the PR.
6.  **Merge**: Once approved and all checks pass, merge the PR into `dev`. Prefer `Squash and Merge` for feature branches to keep `dev` history clean, or `Merge Commit` for bugfixes if individual commits are important.
7.  **Delete Branch**: Delete the feature/bugfix branch after merging.

### **Environment Integration**

*   **`dev` branch**: Automatically deployed to the **staging** environment for integration testing and stakeholder review.
*   **`main` branch**: Automatically deployed to the **production** environment.
*   **Preview Deployments**: Vercel automatically creates preview deployments for every Pull Request, allowing isolated testing of changes.

### **Rebasing vs. Merging**

*   **Merging**: Use merge commits for integrating feature branches into `dev` (or `main` for hotfixes) to preserve history of the feature branch.
*   **Rebasing**: Use rebase for cleaning up your local commit history on a feature branch before opening a PR (e.g., to squash small commits into logical units). **Never rebase a branch that has already been pushed and shared with others.**

### **Commit Message Guidelines**

*   **Format**: `Type(Scope): Subject` (e.g., `feat(auth): implement user login`)
    *   **Type**: `feat` (feature), `fix` (bug fix), `docs` (documentation), `style` (formatting, no code change), `refactor` (refactoring production code), `test` (adding missing tests), `chore` (maintainance, build process, etc.).
    *   **Scope**: Optional, indicates the part of the codebase affected (e.g., `frontend`, `backend`, `auth`, `ui`).
    *   **Subject**: Concise, imperative mood, 50 characters max, no period at the end.
*   **Body**: Optional, provide more detailed explanation if necessary. Wrap at 72 characters. Explain *what* and *why*, not *how*.

### **Conflict Resolution**

*   **Pull Frequently**: Pull the latest changes from `dev` into your feature branch frequently to minimize merge conflicts.
*   **Resolve Locally**: Resolve conflicts on your local machine before pushing and opening a PR.
*   **Communicate**: If you encounter complex conflicts, communicate with the team to coordinate resolution.

## **Comprehensive Development Workflow**

This section outlines the step-by-step process for developing and integrating features or bug fixes, from story selection to deployment, ensuring quality and consistency across the Creator's Deal Hub project.

### **Workflow Steps**

1.  **Story Selection & Understanding (Product Manager/Product Owner/Developer)**
    *   **Roles**: Product Manager (`@pm`), Product Owner (`@po`), Developer (`@dev`)
    *   **Description**: PM/PO define and prioritize stories. Developer thoroughly understands requirements and acceptance criteria from `docs/prd/prd.md` and `docs/stories/`. Clarifications are sought if ambiguities exist.

2.  **Branch Creation (Developer)**
    *   **Role**: Developer (`@dev`)
    *   **Description**: Create a new feature or bugfix branch from `dev` following the Git Branch Policy (`docs/architecture/coding-standards.md`).
    *   **Command**: `git checkout dev && git pull origin dev && git checkout -b feature/my-new-feature`

3.  **Implementation (Developer)**
    *   **Role**: Developer (`@dev`)
    *   **Description**: Write code to fulfill story requirements, adhering to `docs/architecture/coding-standards.md`. This includes extracting HTML, converting to React components, and integrating necessary libraries (e.g., Shadcn UI).

4.  **Local Testing & Verification (Developer)**
    *   **Role**: Developer (`@dev`)
    *   **Description**: Write and run unit tests and integration tests locally, adhering to the guidelines in [Testing Strategy](./testing-strategy.md). Perform manual verification of the implemented feature.
    *   **Reference**: [Testing Strategy](./testing-strategy.md) (Unit Tests, Integration Tests sections).

5.  **Commit Changes (Developer)**
    *   **Role**: Developer (`@dev`)
    *   **Description**: Commit changes with clear, concise messages following `docs/architecture/coding-standards.md` guidelines.
    *   **Command**: `git add . && git commit -m "feat(scope): Implement feature"`

6.  **Pull Request (PR) Creation (Developer)**
    *   **Role**: Developer (`@dev`)
    *   **Description**: Push the feature branch to the remote repository and open a Pull Request from the feature branch to the `dev` branch.

7.  **Automated CI/CD Checks (System)**
    *   **Role**: System (Vercel CI/CD)
    *   **Description**: Upon PR creation, the CI/CD pipeline automatically runs linting, type checking, unit/integration tests, and the build process. A Vercel preview deployment is created.
    *   **Reference**: `docs/architecture/deployment-guide.md`.

8.  **Code Review (Developer/Architect/QA Test Architect)**
    *   **Roles**: Developer (`@dev`), Architect (`@architect`), QA Test Architect (`@qa`)
    *   **Description**: Review code for quality, adherence to standards, and correctness. Check Vercel preview deployment for visual and functional correctness. Provide feedback in the PR.

9.  **QA Testing (QA Test Architect)**
    *   **Role**: QA Test Architect (`@qa`)
    *   **Description**: Perform dedicated testing on the Vercel preview deployment, including functional, regression, and E2E tests as defined in the [Testing Strategy](./testing-strategy.md). Ensure the story meets all acceptance criteria and the "Definition of Done."
    *   **Reference**: [Testing Strategy](./testing-strategy.md) (End-to-End Tests section).

10. **Merge to `dev` (Developer)**
    *   **Role**: Developer (`@dev`)
    *   **Description**: Once all automated checks pass, code review is approved, and QA signs off, the Developer agent will merge the feature branch into the `dev` branch. Prefer `Squash and Merge` for feature branches.
    *   **Command**: `git checkout dev && git pull origin dev && git merge --squash feature/my-new-feature && git commit -m "feat(scope): Implement feature"` (example for squash merge)

10.5. **Switch to `dev` for Live Check (Developer)**
    *   **Role**: Developer (`@dev`)
    *   **Description**: After merging, the Developer agent will switch to the `dev` branch to perform a live check of the implemented feature in the development environment.
    *   **Command**: `git checkout dev`

11. **Deployment to Staging (System)**
    *   **Role**: System (Vercel CI/CD)
    *   **Description**: Merging to `dev` automatically triggers a deployment to the staging environment.
    *   **Reference**: `docs/architecture/deployment-guide.md`.

12. **Documentation Updates (Developer/Product Manager/Product Owner)**
    *   **Roles**: Developer (`@dev`), Product Manager (`@pm`), Product Owner (`@po`)
    *   **Description**: Update relevant architectural documents (`docs/architecture/`) if the story introduces new patterns or significant changes. Update story status in `docs/stories/`.

This comprehensive workflow ensures that each story is thoroughly implemented, tested, reviewed, and integrated into the codebase, maintaining high quality and consistency.
