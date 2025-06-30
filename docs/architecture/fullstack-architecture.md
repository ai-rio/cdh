# Fullstack Architecture

## Overview

This document provides a comprehensive overview of the Creator's Deal Hub's fullstack architecture, detailing the high-level design, core architectural patterns, and how various components interact to form a cohesive system. It serves as a foundational guide for understanding the entire application landscape.

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
| 2025-06-26 | 0.1 | Initial draft | Winston |
| 2025-06-26 | 0.2 | Comprehensive outline of fullstack architecture | Winston |

## 1. High-Level System Overview

The Creator's Deal Hub is a modern web application designed to empower content creators. It follows a client-server architecture, with a Next.js frontend serving as the primary user interface and a Payload CMS instance providing the backend API and content management capabilities, backed by a PostgreSQL database.

```mermaid
graph TD
    User[User] --> Frontend[Next.js Frontend]
    Frontend --> |REST/GraphQL API| Backend[Payload CMS Backend]
    Backend --> |PostgreSQL| Database[Supabase PostgreSQL]
    Backend --> |File Storage| CloudStorage[Cloud Storage (e.g., S3 via Payload)]
    Frontend --> |External APIs (Future)| ExternalServices[Third-Party Services]
    Backend --> |External APIs (Future)| ExternalServices

    subgraph Deployment
        Frontend & Backend --> Vercel[Vercel Deployment]
        Database --> Supabase[Supabase Managed Service]
    end

    style Frontend fill:#ADD8E6,stroke:#3178C6,stroke-width:2px
    style Backend fill:#ADD8E6,stroke:#3178C6,stroke-width:2px
    style Database fill:#ADD8E6,stroke:#3178C6,stroke-width:2px
    style CloudStorage fill:#ADD8E6,stroke:#3178C6,stroke-width:2px
    style ExternalServices fill:#ADD8E6,stroke:#3178C6,stroke-width:2px
    style Vercel fill:#D3D3D3,stroke:#696969,stroke-width:1px
    style Supabase fill:#D3D3D3,stroke:#696969,stroke-width:1px
```

## 2. Architectural Patterns

### 2.1. Client-Server Architecture

*   **Client**: The Next.js frontend, responsible for rendering the user interface and handling user interactions.
*   **Server**: The Payload CMS backend, which exposes REST and GraphQL APIs for data management and business logic.

### 2.2. API-Driven Development

*   The frontend communicates with the backend exclusively through well-defined REST and GraphQL APIs provided by Payload CMS. This decouples the frontend and backend, allowing independent development and scaling.

### 2.3. Component-Based Architecture (Frontend)

*   The Next.js frontend is built using reusable React components, promoting modularity, maintainability, and reusability across the application. Shadcn UI components are heavily utilized for consistent UI elements.

### 2.4. Headless CMS (Backend)

*   Payload CMS acts as a headless CMS, providing content management capabilities and exposing data via APIs without dictating the frontend presentation layer.

## 3. Data Flow

Data flows through the system in a clear, unidirectional manner for most operations:

1.  **User Interaction**: A user interacts with the Next.js frontend (e.g., fills a form, clicks a button).
2.  **Frontend Request**: The frontend sends an API request (REST or GraphQL) to the Payload CMS backend.
3.  **Backend Processing**: The Payload CMS backend receives the request, validates it, applies business logic (via hooks), and interacts with the PostgreSQL database.
4.  **Database Interaction**: Payload CMS performs CRUD (Create, Read, Update, Delete) operations on the Supabase PostgreSQL database.
5.  **Backend Response**: The Payload CMS backend sends a response back to the Next.js frontend.
6.  **Frontend Update**: The frontend receives the response and updates the UI accordingly.

## 4. Technology Stack Integration

*   **Next.js & React**: The core of the frontend, providing server-side rendering, static site generation, and client-side interactivity. It consumes data from the Payload CMS API.
*   **Payload CMS**: Built on Node.js and Express.js, it serves as the backend framework, API generator, and content management system. It directly integrates with PostgreSQL.
*   **PostgreSQL (via Supabase)**: The primary relational database for storing all application data. Supabase provides a managed service, simplifying database operations.
*   **Tailwind CSS**: Used across the frontend for utility-first styling, ensuring a consistent and responsive design, including customization of Shadcn UI components.
*   **Three.js & GSAP**: Integrated into the frontend for advanced 3D graphics and animations, enhancing the user experience.
*   **Chart.js**: Used on the frontend for dynamic data visualization.

## 5. Scalability and Performance Considerations

*   **Next.js Optimizations**: Leveraging SSR, SSG, and image optimization features of Next.js for fast page loads and efficient resource delivery.
*   **Vercel Global CDN**: Vercel automatically distributes frontend assets globally, reducing latency for users worldwide.
*   **Payload CMS API**: Designed to be performant, with built-in caching mechanisms and efficient database interactions.
*   **Supabase Scalability**: Supabase's managed PostgreSQL service is designed to scale with application demands, handling increased data loads and concurrent connections.
*   **Component-Level Optimization**: Frontend components are optimized to minimize re-renders and ensure smooth animations (e.g., careful use of `use client`, memoization).

## 6. Security Overview

*   **Authentication & Authorization**: Handled primarily by Payload CMS, utilizing JWT-based authentication and granular access control at the collection and field levels.
*   **Data Security**: Supabase provides robust security features for PostgreSQL, including encryption at rest and in transit. Payload CMS also handles secure password hashing.
*   **Input Validation**: Both frontend (client-side) and backend (Payload CMS) implement input validation to prevent common vulnerabilities like XSS and SQL injection.
*   **Environment Variables**: Sensitive credentials are managed securely through environment variables, not hardcoded in the codebase.
*   **Deployment Security**: Vercel's platform provides built-in security features for deployed applications, including DDoS protection and SSL/TLS encryption.

## Related Resources

*   [Technology Stack](../tech-stack.md)
*   [Unified Project Structure](../unified-project-structure.md)
*   [Backend Architecture](../backend-architecture.md)
*   [Frontend Architecture](../frontend-architecture.md)
*   [External APIs](../external-apis.md)
*   [Deployment Guide](../deployment-guide.md)
