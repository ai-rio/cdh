const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.resolve(__dirname, '../.env.local') });

const { getPayload } = require('payload');
const payloadConfig = require('../src/payload.config.ts').default;

async function createAdminUser() {
  try {
    console.log('🚀 Creating admin user...');
    console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? 'Found' : 'Missing');
    console.log('DATABASE_URI:', process.env.DATABASE_URI ? 'Found' : 'Missing');
    
    const payload = await getPayload({ config: payloadConfig });
    
    // Check if admin user already exists
    const existingAdmins = await payload.find({
      collection: 'users',
      where: {
        role: {
          equals: 'admin'
        }
      },
      limit: 1
    });
    
    if (existingAdmins.docs.length > 0) {
      console.log('✅ Admin user already exists:', existingAdmins.docs[0].email);
      return;
    }
    
    // Create admin user
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'AdminPassword123!',
        role: 'admin'
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: AdminPassword123!');
    console.log('ID:', adminUser.id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
}

createAdminUser();
