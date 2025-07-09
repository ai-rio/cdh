const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URI
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // List all tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n📋 Tables in database:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Check if users table exists and show its structure
    const userTableExists = tables.rows.some(row => row.table_name === 'users');
    
    if (userTableExists) {
      console.log('\n👤 Users table structure:');
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        ORDER BY ordinal_position;
      `);
      
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });

      // Show existing users
      console.log('\n👥 Existing users:');
      const users = await client.query('SELECT id, name, email, role FROM users LIMIT 10');
      if (users.rows.length === 0) {
        console.log('  No users found');
      } else {
        users.rows.forEach(user => {
          console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`);
        });
      }
    } else {
      console.log('\n❌ Users table does not exist');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase();
