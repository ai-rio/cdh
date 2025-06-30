# Data Models

## Overview

# This document defines the core data models (entities) for the Creator's Deal Hub, encompassing both frontend and backend requirements. It details their purpose, key attributes, relationships, and provides corresponding TypeScript interfaces for consistent type-safe development across the full stack. These models are implemented as Payload CMS collections, serving as the primary data storage and management mechanism.

### Change Log

# | Date       | Version | Description                                         | Author  |
| ---------- | ------- | --------------------------------------------------- | ------- |
| 2025-06-25 | 0.1     | Initial draft based on existing collections and PRD | Winston |

## Core Data Models

### User

**Purpose:** Represents authenticated users within the Creator's Deal Hub, including both creators and administrators. It stores authentication credentials and basic profile information.**Key Attributes:*** `id`: `string` - Unique identifier for the user.

* `email`: `string` - User's unique email address (used for login).

* `password`: `string` - Hashed password for authentication.

* `roles`: `array<string>` - Defines the user's permission levels (e.g., 'admin', 'user', 'creator').

* `createdAt`: `Date` - Timestamp of user creation.

* `updatedAt`: `Date` - Timestamp of last update to user record.**TypeScript Interface:**TypeScript    interface User {
      id: string;
      email: string;
      password?: string; // Optional for client-side or when not directly exposing
      roles: ('admin' | 'user' | 'creator')[];
      createdAt: string; // Payload's default timestamp format
      updatedAt: string; // Payload's default timestamp format
    }**Relationships:*** Can own multiple `Media` items (1:n relationship with Media, inferred from typical CMS usage).

* Can be related to `Deals` (if a 'creator' role is tied to managing deals, a future consideration based on PRD).***
====================================================================================================================

### Media

**Purpose:** Manages uploaded media files (images, videos, documents) within the Payload CMS. It stores metadata about the files and their public URLs.**Key Attributes:*** `id`: `string` - Unique identifier for the media item.

* `alt`: `string` - Alternative text for accessibility and SEO.

* `url`: `string` - Publicly accessible URL of the media file.

* `filename`: `string` - Original filename of the uploaded file.

* `mimeType`: `string` - MIME type of the file (e.g., 'image/jpeg', 'video/mp4').

* `filesize`: `number` - Size of the file in bytes.

* `width`: `number` - Width of the media (for images/videos).

* `height`: `number` - Height of the media (for images/videos).

* `createdAt`: `Date` - Timestamp of media upload.

* `updatedAt`: `Date` - Timestamp of last update to media record.**TypeScript Interface:**TypeScript    interface Media {
      id: string;
      alt: string;
      url: string;
      filename: string;
      mimeType: string;
      filesize: number;
      width?: number;
      height?: number;
      createdAt: string;
      updatedAt: string;
    }**Relationships:*** Can be associated with various content types (e.g., used within a `Deal` or `Post` if these collections existed).

* Owned by a `User` (1:n relationship with User, inferred from common CMS patterns).***
=======================================================================================

## Future Data Models (Based on PRD and Research)

# Based on the `prd.md` and your `Influencer App Research Framework`, the following data models will likely be required in future enhancements:* **Deal/Collaboration**: To manage brand deals, including products, requirements, deadlines, payment status, and commissions.

  - **Attributes**: `brandName`, `productDetails`, `requirements`, `deadline`, `paymentStatus`, `commissionRate`, `invoiceId`.

  - **Relationships**: Related to `User` (creator), possibly `Invoice`.

* **Invoice**: For generating professional invoices related to brand deals.

  - **Attributes**: `invoiceNumber`, `issueDate`, `dueDate`, `amount`, `status`, `lineItems`, `creatorDetails`, `brandDetails`.

  - **Relationships**: Related to `Deal`, `User`.

* **Contact/Brand**: To track key contacts and brands for collaborations.

  - **Attributes**: `name`, `email`, `company`, `contactPerson`, `notes`, `authenticityScore` (if integrating with future AI feature).

  - **Relationships**: Related to `Deal`.

* **Post/Content**: To manage content pieces, possibly including details for cross-platform repurposing.

  - **Attributes**: `title`, `description`, `originalPlatform`, `repurposedFormats`, `status`, `analytics`.

  - **Relationships**: Related to `User`, `Media`.

* **Transaction/Expense**: For tracking income streams and expenses for tax preparation.

  - **Attributes**: `amount`, `type` (`income`/`expense`), `category`, `date`, `description`, `sourcePlatform`, `taxDeductible` (`boolean`), `deductionExplanation`.

  - **Relationships**: Related to `User`.

## Related Resources

# - [Backend Architecture](./backend-architecture.md)

- [Database Schema](./database-schema.md) (to be created)

- [REST API Specification](./rest-api-spec.md) (to be created)
