# Backend Architecture

## Overview

# This document outlines the backend architecture of the Creator's Deal Hub, primarily powered by Payload CMS. It details the service organization, data flow, API design principles, and communication patterns. The goal is to provide a clear blueprint for backend development, ensuring scalability, maintainability, and efficient interaction with the frontend and external services.

### Change Log

# | Date       | Version | Description                              | Author  |
| ---------- | ------- | ---------------------------------------- | ------- |
| 2025-06-25 | 0.1     | Initial draft based on Payload CMS setup | Winston |

## Service Layer Organization

# The backend is built around Payload CMS, which acts as both the data store interface and the API layer. Logic is primarily organized around Payload's concept of "Collections."* **Collections (`src/collections/`)**: These are the core data models and represent the primary entities in the system (e.g., `Users.ts`, `Media.ts`). Each collection defines its schema, access control, and hooks.

  - **Schema Definition**: Defines fields, types, and validation rules for each data entity.

  - **Access Control**: Handled via Payload's `access` properties, controlling read, create, update, and delete permissions.

  - **Hooks**: Custom logic executed at various points in the lifecycle of a document (e.g., `beforeChange`, `afterRead`).

* **Payload Config (`src/payload.config.ts`)**: The central configuration file that registers all collections, plugins, and defines global settings for the CMS.

* **API Routes (`src/app/(payload)/api/`)**: Payload CMS automatically generates REST and GraphQL APIs for registered collections/route.ts, src/app/(payload)/api/graphql/route.ts]. Custom API routes can also be defined if needed.

* **Email Service (Resend)**: Integrated for all transactional and marketing email communications. Email sending will primarily be triggered via:
  - **Payload Hooks**: For events directly related to data changes within Payload CMS (e.g., `afterChange` hook on a 'users' collection for registration emails, or a 'waitlist' collection for confirmation emails).
  - **Custom Next.js API Routes**: For form submissions (e.g., contact forms, newsletter sign-ups) that are not directly tied to Payload collection changes, or for more complex email logic.

## Controller/Route Patterns

# Payload CMS abstracts traditional controller/route patterns by automatically generating API endpoints for each collection.* **Auto-generated Endpoints**: For each collection (e.g., `Users`), REST endpoints are automatically available (e.g., `/api/users`, `/api/users/{id}`).

* **Custom Routes**: For specialized logic not covered by standard CRUD operations, custom routes can be defined within Next.js API routes that interact with Payload's local API. Example: `src/app/(payload)/my-route/route.ts`.

* **Authentication Routes**: Handled by Payload CMS, providing endpoints for user login, logout, and token management.

## Middleware Architecture

# Payload CMS integrates with Next.js, and middleware can be applied at different layers:* **Next.js Middleware**: For global concerns like authentication, logging, or request modification, Next.js middleware (not explicitly shown in provided structure but standard for Next.js) can be used.

* **Payload Hooks**: Act as a form of "middleware" specific to data operations, allowing logic to run before or after database interactions.

* **Express Middleware (Payload Internal)**: Payload CMS is built on Express.js, allowing for custom Express middleware to be configured within `payload.config.ts` for more granular control over API requests.

## Authentication/Authorization Patterns

# Authentication and authorization are primarily managed by Payload CMS.* **User Collection**: The `Users` collection (`src/collections/Users.ts`) defines the user schema and authentication settings.

* **Password Hashing**: Handled automatically by Payload for user passwords.

* **JWT-based Authentication**: Payload CMS uses JSON Web Tokens (JWTs) for session management.

* **Access Control**: Defined at the collection and field level, controlling which users can access or modify data.

* **Payload UI Access**: The Payload admin panel is protected by Payload's authentication system.

## Request/Response Flow

# 1. **Client Request**: Frontend (Next.js) sends a request to the Payload CMS API (e.g., `/api/posts`).

2. **Next.js Route Handler**: The request is routed through Next.js's App Router system (`src/app/(payload)/api/[...slug]/route.ts`)/route.ts].

3. **Payload Processing**: Payload CMS receives the request, applies any configured middleware or hooks, and processes it based on the requested collection/endpoint.

4. **Database Interaction**: Payload interacts with the PostgreSQL database via `@payloadcms/db-postgres` to retrieve or store data.

5. **Response**: Payload formats the response (JSON by default) and sends it back through Next.js to the client.

## Background Job Processing

# - Currently, no explicit background job processing system is identified in the core structure. For future needs, external services (e.g., AWS Lambda, dedicated worker services) or Payload's own `onInit` hooks for scheduled tasks could be considered.

## Service Communication Patterns

# - **RESTful APIs**: Primary communication method between frontend and backend, and potentially between different backend services if microservices were introduced.

- **GraphQL**: Payload CMS also exposes a GraphQL API for more flexible data querying.

- **Direct Local API Calls (Server-side)**: Next.js server components or API routes can directly interact with Payload's local API instance without making HTTP requests, which is more efficient for server-to-server communication within the same application instance.

## Related Resources

# - [Technology Stack](./tech-stack.md)

- [Data Models](./data-models.md) (to be created)

- [Database Schema](./database-schema.md) (to be created)

- [REST API Specification](./rest-api-spec.md) (to be created)

- [Unified Project Structure](./unified-project-structure.md)
