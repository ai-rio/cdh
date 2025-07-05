import { getPayload } from 'payload';
import config from '@/payload.config';
import { postgresAdapter } from '@payloadcms/db-postgres';

// In-memory database setup for testing
let testPayload: any = null;

export async function createTestDatabase() {
  try {
    // Initialize Payload with test configuration
    const payloadConfig = await config;
    testPayload = await getPayload({ 
      config: {
        ...(payloadConfig as any),
        // Override database settings for testing
        db: postgresAdapter({
          pool: {
            connectionString: process.env.TEST_DATABASE_URI || 'postgresql://user:password@localhost:5432/test_db_for_tests',
          },
          allowIDOnCreate: true,
        }),
      }
    });
    
    console.log('Test database created successfully');
    return testPayload;
  } catch (error) {
    console.error('Failed to create test database:', error);
    throw error;
  }
}

export async function cleanupTestDatabase() {
  try {
    if (testPayload) {
      // Clean up any test data
      // This would typically involve clearing collections
      // For now, we'll just reset the payload instance
      testPayload = null;
    }
    console.log('Test database cleaned up successfully');
  } catch (error) {
    console.error('Failed to cleanup test database:', error);
    throw error;
  }
}

export function getTestPayload() {
  return testPayload;
}

// Helper function to seed test data if needed
export async function seedTestData() {
  if (!testPayload) {
    throw new Error('Test database not initialized');
  }
  
  // Add any test data seeding logic here
  // For example:
  // await testPayload.create({
  //   collection: 'users',
  //   data: { email: 'test@example.com', password: 'test123' }
  // });
  
  console.log('Test data seeded successfully');
}

// Helper function to clear specific collections
export async function clearCollection(collectionSlug: string) {
  if (!testPayload) {
    throw new Error('Test database not initialized');
  }
  
  try {
    const docs = await testPayload.find({
      collection: collectionSlug,
      limit: 1000
    });
    
    for (const doc of docs.docs) {
      await testPayload.delete({
        collection: collectionSlug,
        id: doc.id
      });
    }
    
    console.log(`Collection ${collectionSlug} cleared successfully`);
  } catch (error) {
    console.error(`Failed to clear collection ${collectionSlug}:`, error);
    throw error;
  }
}