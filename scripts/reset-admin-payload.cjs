const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function resetAdminPasswordPayload() {
  try {
    console.log('🔄 Resetting admin password using Payload CMS method...');
    
    // Import Payload dynamically
    const { getPayload } = require('payload');
    const payloadConfig = require('../src/payload.config.ts').default;
    
    const payload = await getPayload({ config: payloadConfig });
    
    // Find the admin user
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'carlos@ai.rio.br'
        }
      },
      limit: 1
    });
    
    if (users.docs.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }
    
    const adminUser = users.docs[0];
    console.log(`📋 Found admin user: ${adminUser.name} (${adminUser.email})`);
    
    // Update the user with a new password
    const updatedUser = await payload.update({
      collection: 'users',
      id: adminUser.id,
      data: {
        password: 'AdminPassword123!'
      }
    });
    
    console.log('✅ Admin password updated successfully using Payload CMS!');
    console.log('📧 Email: carlos@ai.rio.br');
    console.log('🔑 Password: AdminPassword123!');
    
    // Also reset login attempts directly in database
    const client = new Client({
      connectionString: process.env.DATABASE_URI
    });
    
    await client.connect();
    await client.query(`
      UPDATE users 
      SET login_attempts = 0, lock_until = NULL
      WHERE email = 'carlos@ai.rio.br'
    `);
    await client.end();
    
    console.log('🔓 Login attempts reset');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔄 Trying direct database approach...');
    
    // Fallback to direct database update
    const bcrypt = require('bcrypt');
    const client = new Client({
      connectionString: process.env.DATABASE_URI
    });
    
    try {
      await client.connect();
      
      // Hash password with bcrypt
      const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
      
      // Update password and reset login attempts
      const result = await client.query(`
        UPDATE users 
        SET hash = $1, login_attempts = 0, lock_until = NULL, updated_at = NOW()
        WHERE email = 'carlos@ai.rio.br'
        RETURNING id, name, email
      `, [hashedPassword]);
      
      if (result.rows.length > 0) {
        console.log('✅ Password updated via direct database access');
        console.log('📧 Email: carlos@ai.rio.br');
        console.log('🔑 Password: AdminPassword123!');
      }
      
      await client.end();
    } catch (dbError) {
      console.error('❌ Database error:', dbError.message);
    }
  }
}

resetAdminPasswordPayload();
