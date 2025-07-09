#!/usr/bin/env tsx
/**
 * User Promotion Script for Payload CMS
 * 
 * This script promotes a user to admin role using Payload's Local API.
 * It can be used to grant admin access to specific users.
 * 
 * Usage:
 *   npm run promote-admin carlos@ai.rio.br
 *   or
 *   npx tsx scripts/promote-user-to-admin.ts carlos@ai.rio.br
 * 
 * Requirements:
 *   - Payload CMS must be properly configured
 *   - Database must be accessible
 *   - User must exist in the system
 */

import { config } from 'dotenv'
import { getPayload } from 'payload'
import payloadConfig from '@payload-config'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from project root
// Try .env.local first, then fallback to .env
const envLocalPath = path.resolve(__dirname, '../.env.local')
const envPath = path.resolve(__dirname, '../.env')

let result = config({ path: envLocalPath })
if (result.error) {
  result = config({ path: envPath })
}

// Debug environment loading
if (result.error) {
  console.log(`❌ Error loading .env file from ${envPath}:`, result.error.message)
} else {
  console.log(`✅ Environment loaded from ${envPath}`)
}

// Check if PAYLOAD_SECRET is available
if (!process.env.PAYLOAD_SECRET) {
  console.log('❌ PAYLOAD_SECRET not found in environment variables')
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('PAYLOAD')).join(', '))
} else {
  console.log('✅ PAYLOAD_SECRET found')
}

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

/**
 * Logs a message with color and timestamp
 */
function log(message: string, color: string = colors.reset) {
  const timestamp = new Date().toISOString()
  console.log(`${color}[${timestamp}] ${message}${colors.reset}`)
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Promotes a user to admin role
 */
async function promoteUserToAdmin(email: string): Promise<void> {
  try {
    log(`🚀 Starting admin promotion process for: ${email}`, colors.cyan)
    
    // Validate email format
    if (!isValidEmail(email)) {
      throw new Error(`Invalid email format: ${email}`)
    }
    
    // Initialize Payload
    log('📦 Initializing Payload CMS...', colors.blue)
    
    // Ensure we have the required environment variables
    if (!process.env.PAYLOAD_SECRET) {
      throw new Error('PAYLOAD_SECRET environment variable is required')
    }
    if (!process.env.DATABASE_URI) {
      throw new Error('DATABASE_URI environment variable is required')
    }
    
    const payload = await getPayload({ 
      config: payloadConfig
    })
    log('✅ Payload CMS initialized successfully', colors.green)
    
    // Find user by email
    log(`🔍 Searching for user with email: ${email}`, colors.blue)
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email.toLowerCase().trim()
        }
      },
      limit: 1
    })
    
    if (users.docs.length === 0) {
      throw new Error(`❌ User with email '${email}' not found in the system`)
    }
    
    const user = users.docs[0]
    log(`✅ User found: ${user.name} (ID: ${user.id})`, colors.green)
    log(`📋 Current role: ${user.role}`, colors.yellow)
    
    // Check if user is already an admin
    if (user.role === 'admin') {
      log(`ℹ️  User '${email}' is already an admin. No changes needed.`, colors.yellow)
      return
    }
    
    // Store original role for logging
    const originalRole = user.role
    
    // Update user role to admin
    log('🔄 Promoting user to admin role...', colors.blue)
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        role: 'admin'
      }
    })
    
    // Verify the update
    if (updatedUser.role === 'admin') {
      log(`🎉 SUCCESS! User '${email}' has been promoted to admin`, colors.green)
      log(`📊 Role changed: ${originalRole} → admin`, colors.green)
      log(`🔑 User now has full access to Payload CMS admin panel`, colors.green)
    } else {
      throw new Error('Role update failed - user role was not changed')
    }
    
  } catch (error) {
    log(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error occurred'}`, colors.red)
    throw error
  }
}

/**
 * Displays user information
 */
async function displayUserInfo(email: string): Promise<void> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email.toLowerCase().trim()
        }
      },
      limit: 1
    })
    
    if (users.docs.length === 0) {
      log(`❌ User with email '${email}' not found`, colors.red)
      return
    }
    
    const user = users.docs[0]
    
    log('👤 User Information:', colors.cyan)
    log(`   Name: ${user.name}`, colors.reset)
    log(`   Email: ${user.email}`, colors.reset)
    log(`   Role: ${user.role}`, colors.reset)
    log(`   ID: ${user.id}`, colors.reset)
    log(`   Created: ${new Date(user.createdAt).toLocaleString()}`, colors.reset)
    log(`   Updated: ${new Date(user.updatedAt).toLocaleString()}`, colors.reset)
    
  } catch (error) {
    log(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error occurred'}`, colors.red)
  }
}

/**
 * Lists all admin users
 */
async function listAdminUsers(): Promise<void> {
  try {
    log('🔍 Fetching all admin users...', colors.blue)
    const payload = await getPayload({ config: payloadConfig })
    
    const adminUsers = await payload.find({
      collection: 'users',
      where: {
        role: {
          equals: 'admin'
        }
      },
      limit: 100
    })
    
    if (adminUsers.docs.length === 0) {
      log('⚠️  No admin users found in the system', colors.yellow)
      return
    }
    
    log(`👥 Found ${adminUsers.docs.length} admin user(s):`, colors.green)
    adminUsers.docs.forEach((user, index) => {
      log(`   ${index + 1}. ${user.name} (${user.email}) - ID: ${user.id}`, colors.reset)
    })
    
  } catch (error) {
    log(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error occurred'}`, colors.red)
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)
  
  // Display help if no arguments or help flag
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.bright}🔧 Payload CMS User Promotion Script${colors.reset}
`)
    console.log('Usage:')
    console.log('  npm run promote-admin <email>           # Promote user to admin')
    console.log('  npm run promote-admin --info <email>    # Display user information')
    console.log('  npm run promote-admin --list-admins     # List all admin users')
    console.log('\nExamples:')
    console.log('  npm run promote-admin carlos@ai.rio.br')
    console.log('  npm run promote-admin --info carlos@ai.rio.br')
    console.log('  npm run promote-admin --list-admins')
    console.log('\nTarget User: carlos@ai.rio.br')
    return
  }
  
  try {
    // Handle different command options
    if (args.includes('--list-admins')) {
      await listAdminUsers()
    } else if (args.includes('--info')) {
      const emailIndex = args.indexOf('--info') + 1
      if (emailIndex >= args.length) {
        throw new Error('Email address required after --info flag')
      }
      await displayUserInfo(args[emailIndex])
    } else {
      // Default: promote user to admin
      const email = args[0]
      if (!email) {
        throw new Error('Email address is required')
      }
      await promoteUserToAdmin(email)
    }
    
  } catch (error) {
    log(`💥 Script failed: ${error instanceof Error ? error.message : 'Unknown error'}`, colors.red)
    process.exit(1)
  }
}

// Execute main function if script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Unhandled error:', error)
    process.exit(1)
  })
}

// Export functions for potential reuse
export {
  promoteUserToAdmin,
  displayUserInfo,
  listAdminUsers
}