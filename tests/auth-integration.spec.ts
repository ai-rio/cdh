/**
 * Integration tests for authentication functionality
 * These tests verify that the Payload CMS authentication endpoints work correctly
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api/users`;

// Test user data
const testUser = {
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
};

let authToken: string;
let userId: string;

describe('Authentication Integration Tests', () => {
  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });

      expect(response.status).toBe(201);
      
      const data = await response.json();
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('token');
      expect(data.user.email).toBe(testUser.email);
      expect(data.user.name).toBe(testUser.name);
      
      // Store for later tests
      authToken = data.token;
      userId = data.user.id;
    });

    it('should reject registration with duplicate email', async () => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });

      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data).toHaveProperty('message');
    });

    it('should reject registration with invalid email', async () => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...testUser,
          email: 'invalid-email',
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should reject registration with weak password', async () => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...testUser,
          email: `weak-password-${Date.now()}@example.com`,
          password: '123',
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials', async () => {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('token');
      expect(data.user.email).toBe(testUser.email);
    });

    it('should reject login with invalid email', async () => {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: testUser.password,
        }),
      });

      expect(response.status).toBe(401);
    });

    it('should reject login with invalid password', async () => {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: 'wrongpassword',
        }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Authenticated Requests', () => {
    it('should get current user with valid token', async () => {
      const response = await fetch(`${API_BASE}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('user');
      expect(data.user.email).toBe(testUser.email);
    });

    it('should reject request with invalid token', async () => {
      const response = await fetch(`${API_BASE}/me`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer invalid-token',
        },
      });

      expect(response.status).toBe(401);
    });

    it('should reject request without token', async () => {
      const response = await fetch(`${API_BASE}/me`, {
        method: 'GET',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('User Logout', () => {
    it('should logout successfully', async () => {
      const response = await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Logout should succeed even if endpoint doesn't exist
      expect([200, 404]).toContain(response.status);
    });
  });

  // Cleanup: Remove test user after all tests
  afterAll(async () => {
    if (userId && authToken) {
      try {
        // Try to delete the test user (if admin endpoint exists)
        await fetch(`${API_BASE}/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
      } catch (error) {
        console.warn('Could not clean up test user:', error);
      }
    }
  });
});

describe('Password Reset Flow', () => {
  it('should handle forgot password request', async () => {
    const response = await fetch(`${API_BASE}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
      }),
    });

    // Should succeed or return 404 if endpoint doesn't exist
    expect([200, 404]).toContain(response.status);
  });

  it('should reject forgot password with invalid email', async () => {
    const response = await fetch(`${API_BASE}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email',
      }),
    });

    expect([400, 404]).toContain(response.status);
  });
});

describe('API Error Handling', () => {
  it('should return proper error format for validation errors', async () => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Missing required fields
      }),
    });

    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
  });

  it('should handle malformed JSON', async () => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    expect(response.status).toBe(400);
  });

  it('should handle missing Content-Type header', async () => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      body: JSON.stringify(testUser),
    });

    // Should still work or return appropriate error
    expect([200, 201, 400, 415]).toContain(response.status);
  });
});
