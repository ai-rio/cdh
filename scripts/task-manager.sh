#!/bin/bash

# CDH Project Task Manager

show_menu() {
    echo "=== CDH Task Manager ==="
    echo "1. Development Tasks"
    echo "2. Testing Tasks"
    echo "3. Build & Deploy Tasks"
    echo "4. Code Quality Tasks"
    echo "5. Database Tasks"
    echo "6. Custom Tasks"
    echo "7. View Task Status"
    echo "8. Exit"
    echo "======================="
}

development_tasks() {
    echo "Development Tasks:"
    echo "1. Start dev server"
    echo "2. Start dev server (safe mode)"
    echo "3. Generate types"
    echo "4. Generate import map"
    
    read -p "Select task (1-4): " choice
    case $choice in
        1) npm run dev ;;
        2) npm run devsafe ;;
        3) npm run generate:types ;;
        4) npm run generate:importmap ;;
        *) echo "Invalid choice" ;;
    esac
}

testing_tasks() {
    echo "Testing Tasks:"
    echo "1. Run all tests"
    echo "2. Run tests in watch mode"
    echo "3. Run tests with UI"
    echo "4. Generate coverage report"
    echo "5. Run E2E tests"
    echo "6. Open Cypress"
    
    read -p "Select task (1-6): " choice
    case $choice in
        1) npm run test ;;
        2) npm run test:watch ;;
        3) npm run test:ui ;;
        4) npm run coverage ;;
        5) npm run test:e2e ;;
        6) npm run cypress:open ;;
        *) echo "Invalid choice" ;;
    esac
}

build_tasks() {
    echo "Build & Deploy Tasks:"
    echo "1. Build for production"
    echo "2. Start production server"
    echo "3. Build and start"
    echo "4. Docker build (if applicable)"
    
    read -p "Select task (1-4): " choice
    case $choice in
        1) npm run build ;;
        2) npm run start ;;
        3) npm run build && npm run start ;;
        4) docker-compose build ;;
        *) echo "Invalid choice" ;;
    esac
}

quality_tasks() {
    echo "Code Quality Tasks:"
    echo "1. Run linter"
    echo "2. Format code"
    echo "3. Lint and format"
    echo "4. Type check"
    
    read -p "Select task (1-4): " choice
    case $choice in
        1) npm run lint ;;
        2) npm run format ;;
        3) npm run lint && npm run format ;;
        4) npx tsc --noEmit ;;
        *) echo "Invalid choice" ;;
    esac
}

database_tasks() {
    echo "Database Tasks:"
    echo "1. Start database (Docker)"
    echo "2. Run migrations"
    echo "3. Seed database"
    echo "4. Reset database"
    
    read -p "Select task (1-4): " choice
    case $choice in
        1) docker-compose up -d postgres ;;
        2) npm run payload -- migrate ;;
        3) npm run payload -- seed ;;
        4) echo "Reset database? (y/N)"; read confirm; [[ $confirm == "y" ]] && npm run payload -- migrate:reset ;;
        *) echo "Invalid choice" ;;
    esac
}

custom_tasks() {
    echo "Custom Tasks:"
    echo "1. Clean node_modules and reinstall"
    echo "2. Update dependencies"
    echo "3. Generate new collection"
    echo "4. Backup project"
    
    read -p "Select task (1-4): " choice
    case $choice in
        1) rm -rf node_modules package-lock.json && npm install ;;
        2) npm update ;;
        3) npm run generate:collection ;;
        4) tar -czf "../cdh-backup-$(date +%Y%m%d).tar.gz" . --exclude=node_modules --exclude=.next ;;
        *) echo "Invalid choice" ;;
    esac
}

task_status() {
    echo "=== Task Status ==="
    echo "Node.js: $(node --version)"
    echo "NPM: $(npm --version)"
    echo "Git Branch: $(git branch --show-current 2>/dev/null || echo 'Not a git repo')"
    echo "Git Status: $(git status --porcelain 2>/dev/null | wc -l) files changed"
    echo "Dev Server: $(pgrep -f 'next dev' > /dev/null && echo 'Running' || echo 'Stopped')"
    echo "Build Status: $([[ -d .next ]] && echo 'Built' || echo 'Not built')"
    echo "Tests: $(npm test 2>/dev/null | grep -c 'passed' || echo 'Unknown')"
    echo "=================="
}

# Main loop
while true; do
    show_menu
    read -p "Select option (1-8): " choice
    
    case $choice in
        1) development_tasks ;;
        2) testing_tasks ;;
        3) build_tasks ;;
        4) quality_tasks ;;
        5) database_tasks ;;
        6) custom_tasks ;;
        7) task_status ;;
        8) echo "Goodbye!"; exit 0 ;;
        *) echo "Invalid choice. Please try again." ;;
    esac
    
    echo
    read -p "Press Enter to continue..."
    clear
done
