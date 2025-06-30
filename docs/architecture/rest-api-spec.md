# REST API Specification

## Overview

# This document provides the OpenAPI 3.0 specification for the Creator's Deal Hub's REST API. It details the available endpoints, their HTTP methods, request and response schemas, and authentication requirements. This specification is crucial for frontend development and any external integrations, ensuring a clear contract for interacting with the backend services provided by Payload CMS.Payload CMS automatically generates REST endpoints for its collections, and this document will reflect those auto-generated APIs.

### Change Log

# | Date       | Version | Description                                            | Author  |
| ---------- | ------- | ------------------------------------------------------ | ------- |
| 2025-06-25 | 0.1     | Initial draft based on Payload CMS auto-generated APIs | Winston |

## OpenAPI 3.0 Specification

YAML    openapi: 3.0.0
    info:
      title: Creator's Deal Hub API
      version: 1.0.0
      description: API for managing Creator's Deal Hub data, powered by Payload CMS.

    servers:
      - url: /api
        description: Primary API server (relative path for Next.js API routes)

    components:
      securitySchemes:
        bearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
          description: JWT authentication token obtained after successful login.

      schemas:
        User:
          type: object
          properties:
            id:
              type: string
              format: uuid
              description: Unique identifier for the user.
            email:
              type: string
              format: email
              description: User's email address.
            roles:
              type: array
              items:
                type: string
                enum: [admin, user, creator]
              description: Roles assigned to the user.
            createdAt:
              type: string
              format: date-time
              description: Date and time of user creation.
            updatedAt:
              type: string
              format: date-time
              description: Date and time of last update.
          required:
            - id
            - email
            - roles

        Media:
          type: object
          properties:
            id:
              type: string
              format: uuid
              description: Unique identifier for the media item.
            alt:
              type: string
              description: Alternative text for accessibility.
            url:
              type: string
              format: uri
              description: Publicly accessible URL of the media file.
            filename:
              type: string
              description: Original filename of the uploaded file.
            mimeType:
              type: string
              description: MIME type of the file.
            filesize:
              type: number
              format: int64
              description: Size of the file in bytes.
            width:
              type: number
              format: integer
              description: Width of the media (for images/videos).
            height:
              type: number
              format: integer
              description: Height of the media (for images/videos).
            createdAt:
              type: string
              format: date-time
              description: Date and time of media creation.
            updatedAt:
              type: string
              format: date-time
              description: Date and time of last update.
          required:
            - id
            - alt
            - url
            - filename
            - mimeType
            - filesize

    paths:
      /users/login:
        post:
          summary: Authenticate user and get a JWT token.
          requestBody:
            required: true
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    email:
                      type: string
                      format: email
                    password:
                      type: string
                  required:
                    - email
                    - password
          responses:
            '200':
              description: Successful login. Returns user data and token.
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      token:
                        type: string
                      user:
                        $ref: '#/components/schemas/User'
            '401':
              description: Unauthorized (invalid credentials).

      /users/logout:
        post:
          summary: Invalidate user's JWT token.
          security:
            - bearerAuth: []
          responses:
            '200':
              description: Successfully logged out.
            '401':
              description: Unauthorized (missing or invalid token).

      /users/me:
        get:
          summary: Get current authenticated user's profile.
          security:
            - bearerAuth: []
          responses:
            '200':
              description: User profile data.
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/User'
            '401':
              description: Unauthorized (missing or invalid token).

      /users:
        get:
          summary: Retrieve a list of users.
          security:
            - bearerAuth: []
          parameters:
            - in: query
              name: depth
              schema:
                type: integer
                default: 2
              description: Depth of nested relations to fetch.
            - in: query
              name: limit
              schema:
                type: integer
                default: 10
              description: Maximum number of documents to return.
            - in: query
              name: page
              schema:
                type: integer
                default: 1
              description: Page number for pagination.
          responses:
            '200':
              description: A list of users.
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      docs:
                        type: array
                        items:
                          $ref: '#/components/schemas/User'
                      totalDocs:
                        type: integer
                      limit:
                        type: integer
                      totalPages:
                        type: integer
                      page:
                        type: integer
                      pagingCounter:
                        type: integer
                      hasPrevPage:
                        type: boolean
                      hasNextPage:
                        type: boolean
                      prevPage:
                        type: integer
                        nullable: true
                      nextPage:
                        type: integer
                        nullable: true
            '401':
              description: Unauthorized.
        post:
          summary: Create a new user.
          security:
            - bearerAuth: []
          requestBody:
            required: true
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/User'
          responses:
            '201':
              description: User created successfully.
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/User'
            '401':
              description: Unauthorized.
            '409':
              description: Conflict (e.g., email already exists).

      /users/{id}:
        get:
          summary: Retrieve a single user by ID.
          security:
            - bearerAuth: []
          parameters:
            - in: path
              name: id
              schema:
                type: string
                format: uuid
              required: true
              description: ID of the user to retrieve.
          responses:
            '200':
              description: User data.
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/User'
            '404':
              description: User not found.
            '401':
              description: Unauthorized.
        patch:
          summary: Update a user by ID.
          security:
            - bearerAuth: []
          parameters:
            - in: path
              name: id
              schema:
                type: string
                format: uuid
              required: true
              description: ID of the user to update.
          requestBody:
            required: true
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/User'
          responses:
            '200':
              description: User updated successfully.
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/User'
            '401':
              description: Unauthorized.
            '404':
              description: User not found.
        delete:
          summary: Delete a user by ID.
          security:
            - bearerAuth: []
          parameters:
            - in: path
              name: id
              schema:
                type: string
                format: uuid
              required: true
              description: ID of the user to delete.
          responses:
            '200':
              description: User deleted successfully.
            '401':
              description: Unauthorized.
            '404':
              description: User not found.

      /media:
        get:
          summary: Retrieve a list of media items.
          security:
            - bearerAuth: []
          parameters:
            - in: query
              name: depth
              schema:
                type: integer
                default: 2
              description: Depth of nested relations to fetch.
            - in: query
              name: limit
              schema:
                type: integer
                default: 10
              description: Maximum number of documents to return.
            - in: query
              name: page
              schema:
                type: integer
                default: 1
              description: Page number for pagination.
          responses:
            '200':
              description: A list of media items.
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      docs:
                        type: array
                        items:
                          $ref: '#/components/schemas/Media'
                      totalDocs:
                        type: integer
                      limit:
                        type: integer
                      totalPages:
                        type: integer
                      page:
                        type: integer
                      pagingCounter:
                        type: integer
                      hasPrevPage:
                        type: boolean
                      hasNextPage:
                        type: boolean
                      prevPage:
                        type: integer
                        nullable: true
                      nextPage:
                        type: integer
                        nullable: true
            '401':
              description: Unauthorized.
        post:
          summary: Upload a new media item.
          security:
            - bearerAuth: []
          requestBody:
            required: true
            content:
              multipart/form-data:
                schema:
                  type: object
                  properties:
                    file:
                      type: string
                      format: binary
                    alt:
                      type: string
          responses:
            '201':
              description: Media item uploaded successfully.
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/Media'
            '401':
              description: Unauthorized.
            '400':
              description: Bad request (e.g., invalid file format).

      /media/{id}:
        get:
          summary: Retrieve a single media item by ID.
          security:
            - bearerAuth: []
          parameters:
            - in: path
              name: id
              schema:
                type: string
                format: uuid
              required: true
              description: ID of the media item to retrieve.
          responses:
            '200':
              description: Media data.
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/Media'
            '404':
              description: Media item not found.
            '401':
              description: Unauthorized.
        patch:
          summary: Update a media item by ID.
          security:
            - bearerAuth: []
          parameters:
            - in: path
              name: id
              schema:
                type: string
                format: uuid
              required: true
              description: ID of the media item to update.
          requestBody:
            required: true
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/Media'
          responses:
            '200':
              description: Media item updated successfully.
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/Media'
            '401':
              description: Unauthorized.
            '404':
              description: Media item not found.
        delete:
          summary: Delete a media item by ID.
          security:
            - bearerAuth: []
          parameters:
            - in: path
              name: id
              schema:
                type: string
                format: uuid
              required: true
              description: ID of the media item to delete.
          responses:
            '200':
              description: Media item deleted successfully.
            '401':
              description: Unauthorized.
            '404':
              description: Media item not found.
======================================================================================================================================================================================================================================================================================================================================================
