# Scripts Directory

This directory contains utility scripts for managing the Payload CMS system.

## Available Scripts

### User Promotion Script

**File:** `promote-user-to-admin.ts`

**Purpose:** Promote users to admin role for full Payload CMS access.

**Usage:**
```bash
# Promote user to admin
npm run promote-admin carlos@ai.rio.br

# Get user information
npm run user-info carlos@ai.rio.br

# List all admin users
npm run list-admins
```

**Features:**
- ✅ Safe user promotion with validation
- ✅ Detailed logging and error handling
- ✅ User information display
- ✅ Admin user listing
- ✅ Email format validation
- ✅ Duplicate admin check

**Requirements:**
- Payload CMS must be configured
- Database must be accessible
- User must exist in the system

**Security:**
- Only promotes existing users
- Validates email format
- Logs all operations
- No auto-creation of users

## Script Development Guidelines

### Adding New Scripts

1. **Create TypeScript file** in `/scripts/` directory
2. **Add npm script** in `package.json`
3. **Include error handling** and logging
4. **Document usage** in this README
5. **Test thoroughly** before deployment

### Best Practices

- Use TypeScript for type safety
- Include comprehensive error handling
- Provide clear logging output
- Validate all inputs
- Document all parameters
- Follow existing code patterns

### Dependencies

- **tsx**: TypeScript execution runtime
- **Payload CMS**: Local API access
- **Node.js**: Runtime environment

---

**Last Updated:** December 2024  
**Maintainer:** BMad Orchestrator Team