# Development Setup Guide - Dashboard Migration

## Overview

This guide provides step-by-step instructions for setting up the development environment for the Payload CMS Dashboard Integration project. **All commands must use `pnpm` as the package manager.**

## Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **pnpm**: Version 8.0.0 or higher
- **PostgreSQL**: Version 13 or higher
- **Git**: Latest version
- **Docker**: Optional, for containerized development

### System Requirements
- **RAM**: Minimum 8GB, recommended 16GB
- **Storage**: Minimum 10GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cdh
```

### 2. Install pnpm (if not already installed)
```bash
# Using npm
npm install -g pnpm

# Using Homebrew (macOS)
brew install pnpm

# Using Scoop (Windows)
scoop install pnpm

# Verify installation
pnpm --version
```

### 3. Install Dependencies
```bash
# Install all project dependencies
pnpm install

# Verify installation
pnpm list --depth=0
```

### 4. Environment Configuration

#### Create Environment Files
```bash
# Copy example environment file
cp .env.example .env

# Create local environment file
cp .env.example .env.local
```

#### Configure Environment Variables
Edit `.env` file with your configuration:

```bash
# Database Configuration
DATABASE_URI=postgresql://username:password@localhost:5432/payload_dev
POSTGRES_DB=payload_dev
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password

# Payload CMS Configuration
PAYLOAD_SECRET=your-super-secret-key-here
PAYLOAD_CONFIG_PATH=src/payload.config.ts

# Next.js Configuration
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Redis Configuration (for caching and real-time features)
REDIS_URL=redis://localhost:6379

# Email Configuration (optional)
RESEND_API_KEY=your-resend-api-key

# Development Settings
NODE_ENV=development
DEBUG=payload:*
```

### 5. Database Setup

#### Option A: Local PostgreSQL Installation
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Install PostgreSQL (macOS with Homebrew)
brew install postgresql
brew services start postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE payload_dev;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE payload_dev TO your_username;
\q
```

#### Option B: Docker PostgreSQL
```bash
# Create docker-compose.dev.yml
cat > docker-compose.dev.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: payload_dev
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF

# Start services
docker-compose -f docker-compose.dev.yml up -d
```

### 6. Initialize Database
```bash
# Run database migrations
pnpm payload migrate

# Seed initial data (optional)
pnpm payload seed
```

### 7. Development Server Setup

#### Start Development Server
```bash
# Start the development server
pnpm dev

# The application will be available at:
# - Frontend: http://localhost:3000
# - Payload Admin: http://localhost:3000/admin
```

#### Verify Setup
1. Open http://localhost:3000 in your browser
2. Navigate to http://localhost:3000/admin
3. Create your first admin user
4. Verify dashboard functionality

## Development Workflow

### Daily Development Commands
```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type checking
pnpm type-check

# Build for production (testing)
pnpm build
```

### Code Quality Commands
```bash
# Run all quality checks
pnpm quality-check

# Format code
pnpm format

# Check formatting
pnpm format:check

# Run security audit
pnpm audit
```

### Database Commands
```bash
# Reset database
pnpm db:reset

# Generate new migration
pnpm payload migrate:create

# Run migrations
pnpm payload migrate

# Rollback migration
pnpm payload migrate:rollback

# Seed database
pnpm payload seed
```

## IDE Configuration

### VS Code Setup
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  }
}
```

### Recommended VS Code Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

## Testing Setup

### Test Environment Configuration
```bash
# Create test environment file
cp .env.example .env.test

# Configure test database
DATABASE_URI=postgresql://username:password@localhost:5432/payload_test
NODE_ENV=test
```

### Run Tests
```bash
# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e

# Run all tests
pnpm test:all

# Run tests with coverage
pnpm test:coverage
```

## Debugging Setup

### Node.js Debugging
Add to `package.json` scripts:
```json
{
  "scripts": {
    "dev:debug": "NODE_OPTIONS='--inspect' next dev",
    "debug": "node --inspect-brk node_modules/.bin/next dev"
  }
}
```

### Browser Debugging
1. Install React Developer Tools
2. Install Redux DevTools (if using Redux)
3. Enable source maps in development

### Debug Commands
```bash
# Start with debugging enabled
pnpm dev:debug

# Debug specific test
pnpm test:debug src/lib/dashboard-service.test.ts
```

## Performance Monitoring Setup

### Development Performance Tools
```bash
# Install performance monitoring tools
pnpm add -D @next/bundle-analyzer
pnpm add -D webpack-bundle-analyzer

# Analyze bundle size
pnpm analyze

# Monitor memory usage
pnpm dev:memory
```

### Performance Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "analyze": "ANALYZE=true pnpm build",
    "dev:memory": "node --max-old-space-size=4096 node_modules/.bin/next dev"
  }
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. pnpm Installation Issues
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 2. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Test connection
psql -h localhost -U your_username -d payload_dev
```

#### 3. Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

#### 4. TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf .next
pnpm type-check

# Restart TypeScript server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

#### 5. Build Errors
```bash
# Clear build cache
rm -rf .next
pnpm build

# Check for dependency issues
pnpm audit
pnpm audit fix
```

### Debug Information Collection
```bash
# System information
node --version
pnpm --version
npm --version

# Project information
pnpm list --depth=0
pnpm outdated

# Environment check
echo $NODE_ENV
echo $DATABASE_URI
```

## Development Best Practices

### Code Organization
- Follow the established directory structure
- Use TypeScript for all new code
- Implement proper error handling
- Write comprehensive tests
- Document complex logic

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/story-01-dashboard-service

# Make commits with conventional format
git commit -m "feat: add dashboard service foundation"

# Push and create PR
git push origin feature/story-01-dashboard-service
```

### Testing Practices
- Write tests before implementing features (TDD)
- Maintain >80% code coverage
- Test error scenarios
- Use meaningful test descriptions

### Performance Considerations
- Monitor bundle size
- Optimize images and assets
- Use lazy loading for components
- Implement proper caching strategies

## Additional Resources

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Development Tools
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Payload Admin Panel](http://localhost:3000/admin)
- [Database Admin Tool](https://www.pgadmin.org/)

### Support Channels
- Project documentation in `/docs`
- Team Slack channel
- GitHub Issues for bug reports
- Weekly development sync meetings

## Next Steps

After completing the setup:
1. Review the [Epic Overview](../epic-overview.md)
2. Read individual story specifications
3. Set up your development branch
4. Start with Story 1: Core Dashboard Service
5. Follow the testing guidelines for each story

Remember to use `pnpm` for all package management operations and maintain the quality gates defined in each story.
