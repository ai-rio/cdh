# User Promotion Guide

## Overview

This guide explains how to promote users to admin role in the Payload CMS system, specifically for granting full administrative access to users like `carlos@ai.rio.br`.

## Quick Start

### Promote carlos@ai.rio.br to Admin

```bash
# Promote user to admin role
npm run promote-admin carlos@ai.rio.br

# Verify the promotion
npm run user-info carlos@ai.rio.br

# List all admin users
npm run list-admins
```

## Available Commands

### 1. Promote User to Admin

```bash
npm run promote-admin <email>
```

**Example:**
```bash
npm run promote-admin carlos@ai.rio.br
```

**What it does:**
- Finds the user by email address
- Updates their role from current role to 'admin'
- Grants full access to Payload CMS admin panel
- Provides detailed logging of the process

### 2. Display User Information

```bash
npm run user-info <email>
```

**Example:**
```bash
npm run user-info carlos@ai.rio.br
```

**What it shows:**
- User's name, email, and current role
- User ID and timestamps
- Complete user profile information

### 3. List All Admin Users

```bash
npm run list-admins
```

**What it shows:**
- All users with 'admin' role
- Their names, emails, and user IDs
- Total count of admin users

## User Roles in the System

The system supports three user roles:

| Role | Description | Permissions |
|------|-------------|-------------|
| **Creator** | Content creators | Can create and manage their own content |
| **Brand** | Brand managers | Can manage brand-related content and users |
| **Admin** | System administrators | Full access to all Payload CMS features |

## Admin Permissions

When a user is promoted to admin, they gain access to:

### Payload CMS Admin Panel
- Full access to `/admin` route
- All collection management (CRUD operations)
- User management and role assignments
- System configuration and settings

### API Access
- Full REST API access to all endpoints
- GraphQL API with admin privileges
- Local API access for server-side operations

### Content Management
- Create, read, update, delete all content
- Manage media and file uploads
- Access to all collections and fields

## Security Considerations

### Access Control
- Admin promotion is logged and auditable
- Role changes are tracked with timestamps
- Only existing users can be promoted (no auto-creation)

### Best Practices
1. **Verify user identity** before promotion
2. **Use principle of least privilege** - only promote when necessary
3. **Regular audit** of admin users
4. **Document** all admin promotions for compliance

## Troubleshooting

### Common Issues

#### User Not Found
```
❌ User with email 'user@example.com' not found in the system
```

**Solution:**
- Verify the email address is correct
- Check if the user has registered in the system
- Use exact email format (case-sensitive)

#### User Already Admin
```
ℹ️ User 'user@example.com' is already an admin. No changes needed.
```

**Solution:**
- This is informational - no action needed
- User already has admin privileges

#### Database Connection Issues
```
❌ ERROR: Database connection failed
```

**Solution:**
- Check database connection settings
- Ensure PostgreSQL is running
- Verify environment variables

### Script Execution Issues

#### Permission Denied
```bash
# Make script executable
chmod +x scripts/promote-user-to-admin.ts
```

#### TypeScript Compilation Errors
```bash
# Ensure tsx is installed
npm install tsx --save-dev

# Or use direct execution
npx tsx scripts/promote-user-to-admin.ts carlos@ai.rio.br
```

## Technical Implementation

### Script Location
```
scripts/promote-user-to-admin.ts
```

### Dependencies
- **Payload CMS**: Local API for user management
- **tsx**: TypeScript execution runtime
- **PostgreSQL**: Database for user storage

### Database Schema
The script interacts with the `users` table:

```sql
-- User role update
UPDATE users 
SET role = 'admin', 
    "updatedAt" = NOW() 
WHERE email = 'carlos@ai.rio.br';
```

### API Endpoints Used
- `payload.find()` - Search for user by email
- `payload.update()` - Update user role

## Monitoring and Logging

### Script Output
The promotion script provides detailed logging:

```
🚀 Starting admin promotion process for: carlos@ai.rio.br
📦 Initializing Payload CMS...
✅ Payload CMS initialized successfully
🔍 Searching for user with email: carlos@ai.rio.br
✅ User found: Carlos Silva (ID: 123)
📋 Current role: creator
🔄 Promoting user to admin role...
🎉 SUCCESS! User 'carlos@ai.rio.br' has been promoted to admin
📊 Role changed: creator → admin
🔑 User now has full access to Payload CMS admin panel
```

### Audit Trail
All role changes are automatically logged in:
- User update timestamps
- Payload CMS audit logs
- Application logs (if configured)

## Integration with Authentication System

### Current Implementation Status
Based on the audit against `auth-modal-integration.md`:

✅ **Fully Implemented:**
- User registration and authentication
- Role-based access control (RBAC)
- JWT token management
- Session management
- Security features

✅ **Enhanced Features:**
- Comprehensive testing suite
- Production-ready security
- Advanced user management

⚠️ **Configuration Note:**
- Email verification is currently disabled
- Can be enabled in `Users.ts` configuration

## Next Steps After Promotion

### For carlos@ai.rio.br
1. **Login to admin panel**: Navigate to `/admin`
2. **Verify access**: Check all admin features are available
3. **Test permissions**: Try creating/editing content
4. **Review settings**: Familiarize with admin interface

### For System Administrators
1. **Monitor usage**: Track admin activities
2. **Regular audits**: Review admin user list
3. **Security updates**: Keep system updated
4. **Backup procedures**: Ensure data protection

## Related Documentation

- [Authentication Implementation](../AUTH_IMPLEMENTATION.md)
- [User Story: Auth Modal Integration](../stories/auth-modal-integration.md)
- [Backend Architecture](../backend-architecture.md)
- [Payload CMS Configuration](../../src/collections/Users.ts)

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Maintainer:** BMad Orchestrator Team