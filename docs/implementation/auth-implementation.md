# Authentication Implementation Documentation

This document describes the complete authentication system implementation for the Creator's Deal Hub platform, based on the requirements in `docs/stories/auth-modal-integration.md`.

## ✅ Implementation Status

### Completed Features

1. **AuthModal Component** (`src/app/(frontend)/components/AuthModal.tsx`)
   - ✅ Modal display with smooth transitions
   - ✅ Toggle between Sign In and Sign Up views
   - ✅ Form validation (client-side)
   - ✅ Accessibility features (keyboard navigation, ARIA labels)
   - ✅ Loading states and error handling
   - ✅ Responsive design

2. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - ✅ Global authentication state management
   - ✅ Session persistence with localStorage
   - ✅ Token management and validation
   - ✅ Automatic session restoration
   - ✅ Comprehensive error handling

3. **API Endpoints**
   - ✅ `POST /api/users` - User registration
   - ✅ `POST /api/users/login` - User authentication
   - ✅ `POST /api/users/logout` - User logout
   - ✅ `GET /api/users/me` - Get current user

4. **Users Collection** (`src/collections/Users.ts`)
   - ✅ Payload CMS authentication configuration
   - ✅ User roles (creator, brand, admin)
   - ✅ Profile fields and social media links
   - ✅ Security settings (login attempts, token expiration)

5. **Protected Routes**
   - ✅ Dashboard page with authentication checks
   - ✅ Automatic redirection for unauthenticated users
   - ✅ Loading states during authentication

6. **Integration Tests**
   - ✅ Comprehensive test suite covering all acceptance criteria
   - ✅ API integration testing
   - ✅ Error handling validation

## 🏗️ Architecture Overview

### Frontend Architecture

```
src/
├── contexts/
│   └── AuthContext.tsx          # Global auth state management
├── app/(frontend)/
│   ├── components/
│   │   ├── AuthModal.tsx        # Authentication modal UI
│   │   ├── Header.tsx           # Navigation with auth integration
│   │   └── CommandDeck.tsx      # Mobile menu with auth trigger
│   └── dashboard/
│       └── page.tsx             # Protected dashboard page
└── app/api/users/
    ├── route.ts                 # User registration endpoint
    ├── login/route.ts           # Login endpoint
    ├── logout/route.ts          # Logout endpoint
    └── me/route.ts              # Current user endpoint
```

### Backend Architecture

```
src/
├── collections/
│   └── Users.ts                 # Payload CMS user collection
├── payload.config.ts            # Payload configuration with CORS/CSRF
└── payload-types.ts             # Generated TypeScript types
```

## 🔐 Security Features

### Authentication Security
- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, and numbers
- **Account Lockout**: 5 failed attempts lock account for 10 minutes
- **Token Expiration**: JWT tokens expire after 2 hours
- **HTTP-Only Cookies**: Additional security layer for token storage
- **CORS/CSRF Protection**: Configured for secure cross-origin requests

### Data Protection
- **Input Validation**: Both client-side and server-side validation
- **SQL Injection Prevention**: Using Payload CMS ORM with parameterized queries
- **XSS Prevention**: Proper input sanitization and output encoding
- **Rate Limiting**: Built into Payload CMS authentication

## 📋 API Documentation

### User Registration
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (Success - 200)**:
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "creator"
  },
  "token": "jwt_token_here",
  "exp": 1609619861
}
```

### User Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (Success - 200)**:
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "creator"
  },
  "token": "jwt_token_here",
  "exp": 1609619861
}
```

### Get Current User
```http
GET /api/users/me
Authorization: Bearer jwt_token_here
```

### User Logout
```http
POST /api/users/logout
Authorization: Bearer jwt_token_here
```

**Response (Success - 200)**:
```json
{
  "message": "Logged out successfully",
  "success": true
}
```

**Note**: Logout primarily clears HTTP-only cookies and client-side tokens. Since JWTs are stateless, server-side token invalidation isn't required - tokens will expire naturally based on their expiration time.

## 🧪 Testing

### Running Tests
```bash
# Run all authentication tests
npm test -- --testPathPattern=AuthModal

# Run integration tests specifically
npm test -- AuthModal.integration.test.tsx
```

### Test Coverage
- ✅ Modal display and navigation
- ✅ Form validation (client-side)
- ✅ API integration
- ✅ Error handling
- ✅ Session management
- ✅ Security validation

## 👑 User Role Management

### Admin Promotion

The system includes tools for promoting users to admin role for full Payload CMS access:

```bash
# Promote carlos@ai.rio.br to admin
npm run promote-admin carlos@ai.rio.br

# Check user information
npm run user-info carlos@ai.rio.br

# List all admin users
npm run list-admins
```

### User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **creator** | Content creators | Create and manage own content |
| **brand** | Brand managers | Manage brand content and users |
| **admin** | System administrators | Full Payload CMS access |

### Admin Access

Once promoted to admin, users gain:
- Full access to `/admin` Payload CMS panel
- All collection management (CRUD operations)
- User management and role assignments
- System configuration access

For detailed user promotion guide, see: [User Promotion Documentation](./admin/USER_PROMOTION.md)

## 🚀 Usage Examples

### Using AuthContext in Components
```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, login, logout, isLoading, error } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>Please log in</div>

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Protecting Routes
```tsx
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedPage() {
  const { user, isLoading, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, isInitialized, router])

  if (!isInitialized || isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // Will redirect
  }

  return <div>Protected content</div>
}
```

## 🔧 Configuration

### Environment Variables
```env
# Required
PAYLOAD_SECRET=your_secret_key_here
DATABASE_URI=postgresql://user:pass@localhost:5432/dbname

# Optional
ALLOWED_ORIGINS=https://yourdomain.com,https://anotherdomain.com
NODE_ENV=production
```

### Payload Configuration
The authentication system is configured in `src/payload.config.ts` with:
- CORS settings for secure cross-origin requests
- CSRF protection
- Database adapter configuration

## 🐛 Troubleshooting

### Common Issues

1. **"Network error" during login/registration**
   - Check if API endpoints are running
   - Verify CORS configuration
   - Check browser console for detailed errors

2. **Session not persisting**
   - Verify localStorage is available
   - Check if cookies are being set correctly
   - Ensure HTTPS in production

3. **Authentication modal not opening**
   - Check if AuthProvider wraps the application
   - Verify modal state management in Header/CommandDeck

4. **Database connection issues**
   - Verify DATABASE_URI environment variable
   - Check PostgreSQL connection
   - Ensure database migrations are run

5. **"payload.logout is not a function" error**
   - This has been fixed in the current implementation
   - JWT logout is handled by clearing cookies and client-side tokens
   - No server-side token invalidation is needed for stateless JWTs

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=payload:*
```

## 📈 Performance Considerations

- **Token Validation**: Cached in memory to reduce database calls
- **Session Restoration**: Only validates token on app initialization
- **Lazy Loading**: Authentication modal loads only when needed
- **Optimistic Updates**: UI updates immediately, with rollback on errors

## 🔮 Future Enhancements

### Planned Features
- [ ] Social login integration (Google, Apple, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Password strength meter
- [ ] Remember me functionality
- [ ] Email verification
- [ ] Password reset flow

### Security Improvements
- [ ] Rate limiting on frontend
- [ ] CAPTCHA integration
- [ ] Advanced threat detection
- [ ] Audit logging

## 📚 References

- [Payload CMS Authentication Documentation](https://payloadcms.com/docs/authentication/overview)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
# Authentication System Documentation

## Overview

The Creator's Deal Hub authentication system is built on top of Payload CMS and provides secure user registration, login, and session management. This document outlines the implementation, API endpoints, and usage patterns.

## Architecture

### Components

1. **AuthContext** (`/src/contexts/AuthContext.tsx`)
   - React context for global authentication state
   - Handles login, registration, logout, and session persistence
   - Provides loading states and error handling

2. **AuthModal** (`/src/app/(frontend)/components/AuthModal.tsx`)
   - Modal component for user authentication
   - Supports both sign-in and sign-up flows
   - Includes form validation and accessibility features

3. **Users Collection** (`/src/collections/Users.ts`)
   - Payload CMS collection configuration
   - Defines user schema, access controls, and validation rules

4. **Auth Service** (`/src/lib/auth-service.ts`)
   - Utility service for API communication
   - Handles HTTP requests and error processing

5. **Dashboard** (`/src/app/(frontend)/dashboard/page.tsx`)
   - Protected route for authenticated users
   - Displays user profile and quick actions

## API Endpoints

All authentication endpoints are automatically generated by Payload CMS:

### Registration
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "creator",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here",
  "exp": 1640995200
}
```

### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "creator"
  },
  "token": "jwt_token_here",
  "exp": 1640995200
}
```

### Get Current User
```
GET /api/users/me
Authorization: Bearer jwt_token_here
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "creator",
    "profile": {
      "bio": "Content creator focused on tech reviews",
      "website": "https://johndoe.com"
    }
  }
}
```

### Logout
```
POST /api/users/logout
Authorization: Bearer jwt_token_here
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

### Password Reset (Future Implementation)
```
POST /api/users/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

```
POST /api/users/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "NewSecurePassword123!"
}
```

## Usage Examples

### Using AuthContext in Components

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      // User is now logged in, redirect or update UI
    } catch (err) {
      // Error is already set in context
      console.error('Login failed:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Using Auth Service Directly

```tsx
import { authService } from '@/lib/auth-service';

async function handleRegistration(name: string, email: string, password: string) {
  try {
    const response = await authService.register(name, email, password);
    console.log('User registered:', response.user);
    
    // Store token securely
    localStorage.setItem('auth_token', response.token);
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
}
```

### Protected Route Pattern

```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content for {user.name}</div>;
}
```

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Session Management
- JWT tokens with 2-hour expiration
- Automatic token refresh (future implementation)
- Secure token storage in localStorage
- Session persistence across browser refreshes

### Rate Limiting
- Maximum 5 login attempts per user
- 10-minute lockout after failed attempts
- Protection against brute force attacks

### Access Controls
- Users can only read/update their own profiles
- Admin users have full access to all user data
- Public registration is enabled
- Role-based permissions (creator, brand, admin)

## Error Handling

### Client-Side Validation
- Email format validation
- Password strength requirements
- Required field validation
- Real-time form feedback

### Server-Side Error Responses
- `400 Bad Request` - Invalid data or validation errors
- `401 Unauthorized` - Invalid credentials or expired token
- `409 Conflict` - Email already exists
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server-side issues

### Error Message Examples
```json
{
  "message": "Invalid email or password"
}
```

```json
{
  "message": "An account with this email already exists"
}
```

## Testing

### Running Authentication Tests
```bash
npm run test tests/auth-integration.test.ts
```

### Test Coverage
- User registration flow
- Login/logout functionality
- Protected route access
- Error handling scenarios
- API endpoint validation

## Configuration

### Environment Variables
```env
# Required
PAYLOAD_SECRET=your_secret_key_here
DATABASE_URI=postgresql://user:password@localhost:5432/dbname

# Optional
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Payload Configuration
```typescript
// payload.config.ts
export default buildConfig({
  collections: [Users, Media],
  admin: {
    user: Users.slug,
  },
  // ... other config
});
```

## Troubleshooting

### Common Issues

1. **"Network error" during authentication**
   - Check if the development server is running
   - Verify API endpoints are accessible
   - Check browser network tab for failed requests

2. **"Invalid response from server"**
   - Ensure Payload CMS is properly configured
   - Check database connection
   - Verify Users collection is set up correctly

3. **Session not persisting**
   - Check localStorage for auth_token
   - Verify AuthProvider wraps the entire app
   - Check for JavaScript errors in console

4. **Registration fails with validation errors**
   - Ensure password meets requirements
   - Check email format
   - Verify all required fields are provided

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=payload:*
```

## Future Enhancements

### Planned Features
- [ ] Email verification for new accounts
- [ ] Two-factor authentication (2FA)
- [ ] Social login integration (Google, Apple, etc.)
- [ ] Password reset via email
- [ ] Remember me functionality
- [ ] Session timeout warnings
- [ ] Account deletion/deactivation
- [ ] Audit logging for security events

### Social Login Integration
```typescript
// Future implementation
const handleGoogleLogin = async () => {
  const response = await authService.socialLogin('google', googleToken);
  // Handle response
};
```

### Email Verification Flow
```typescript
// Future implementation
const handleEmailVerification = async (token: string) => {
  await authService.verifyEmail(token);
  // Update UI to show verified status
};
```

## Best Practices

### Security
1. Always use HTTPS in production
2. Store tokens securely (consider HTTP-only cookies)
3. Implement proper CORS policies
4. Regular security audits and updates
5. Monitor for suspicious login patterns

### User Experience
1. Provide clear error messages
2. Show loading states during authentication
3. Implement proper form validation
4. Offer password strength indicators
5. Support keyboard navigation

### Development
1. Use TypeScript for type safety
2. Write comprehensive tests
3. Follow consistent error handling patterns
4. Document API changes
5. Monitor authentication metrics

## Support

For issues related to authentication:
1. Check this documentation first
2. Review the test files for examples
3. Check the browser console for errors
4. Verify environment configuration
5. Contact the development team

## Changelog

### v1.0.0 (Current)
- Initial authentication system implementation
- User registration and login
- JWT token management
- Protected routes
- Role-based access control
- Form validation and error handling
- Session persistence
- Comprehensive test suite
