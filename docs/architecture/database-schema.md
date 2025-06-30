# Database Schema

## Overview

# This document details the concrete database schema for the Creator's Deal Hub, implemented using PostgreSQL. It translates the conceptual data models into specific table structures, defines relationships between entities, and outlines key indexes and constraints for optimal performance and data integrity. This schema supports the functionality of Payload CMS as the primary data management layer.

### Change Log

# | Date       | Version | Description                                       | Author  |
| ---------- | ------- | ------------------------------------------------- | ------- |
| 2025-06-25 | 0.1     | Initial draft based on data models and PostgreSQL | Winston |

## Database Type and Version

# - **Database System**: PostgreSQL

- **Version**: N/A (Leveraging Supabase's managed PostgreSQL service, which typically provides recent stable versions)

## Table Structures

### `users` table

Represents authenticated users of the system.SQL    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the user
        email VARCHAR(255) UNIQUE NOT NULL,           -- User's unique email address (login)
        password VARCHAR(255) NOT NULL,               -- Hashed password
        -- Payload CMS typically manages roles internally, or via a separate linking table for many-to-many
        -- For simplicity here, assuming a basic text array or similar if not a separate table in Payload default
        -- Payload default often uses a 'roles' field directly on the user, or a lookup table.
        -- Assuming a simple text array for roles if directly on table
        roles TEXT[],                                 -- Array of user roles (e.g., 'admin', 'user', 'creator')
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp of user creation
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  -- Timestamp of last update
    );
============================================================================================================================================================================================================================================================================================================

### `media` table

Stores metadata for uploaded media files.SQL    CREATE TABLE media (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the media item
        alt VARCHAR(255) NOT NULL,                     -- Alternative text for accessibility
        url VARCHAR(2048) NOT NULL,                    -- Publicly accessible URL
        filename VARCHAR(255) NOT NULL,                -- Original filename
        mime_type VARCHAR(100) NOT NULL,               -- MIME type of the file
        filesize BIGINT NOT NULL,                      -- Size of the file in bytes
        width INT,                                     -- Width of media (for images/videos)
        height INT,                                    -- Height of media (for images/videos)
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp of media upload
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp of last update
        -- Assuming owner relationship might be a user_id foreign key if managed outside of explicit Payload relationships
        -- For Payload collections, relationships are often inferred or managed via custom fields
        -- owner_id UUID,                                -- Foreign key to users table (if media is user-owned directly in DB)
        -- FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
    );
============================================================================================================================================================================================================================================================================================================

## Indexes and Constraints

# - **`users` table**:

  - `PRIMARY KEY (id)`: Ensures unique identification for each user.

  - `UNIQUE (email)`: Enforces unique email addresses for user accounts.

- **`media` table**:

  - `PRIMARY KEY (id)`: Ensures unique identification for each media item.

  - `INDEX (filename)`: Improves performance for lookups by filename.

  - `INDEX (mime_type)`: Improves performance for filtering by media type.

## Relationships and Foreign Keys

# Payload CMS handles relationships between collections internally, abstracting the direct foreign key management often seen in traditional SQL applications. However, conceptually, the relationships are as follows:* **`users` and `media`**: While not explicitly defined with a foreign key in the above simplified DDL for media (as Payload often manages this through its own `relationship` field type), a `media` item is typically "owned" by or associated with a `user`. If a direct database foreign key were needed, a `user_id` column would be added to the `media` table referencing `users.id`.

## Migration Patterns

# Payload CMS uses its own migration system to manage schema changes as collections evolve.* When a collection schema is modified in `payload.config.ts` or a collection file, Payload's CLI can generate a migration file.

* These migration files contain SQL (for PostgreSQL) or other database-specific commands to apply schema changes.

* Migrations are run using Payload CLI commands (e.g., `payload migrate`).

## Seed Data Requirements

# - **Admin User**: Initial seed data should include at least one administrator user for accessing the Payload CMS admin panel.

- **Sample Data**: For development and testing, sample data for various collections (e.g., dummy users, media items, placeholder deals) can be seeded to facilitate local development.

## Related Resources

# - [Data Models](./data-models.md)

- [Backend Architecture](./backend-architecture.md)
