#!/bin/bash

# Task Scheduler for CDH Project

TASK_LOG="logs/task-scheduler.log"
TASK_CONFIG="scripts/scheduled-tasks.conf"

# Ensure log directory exists
mkdir -p logs

log_task() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$TASK_LOG"
}

# Scheduled task definitions
daily_tasks() {
    log_task "Starting daily tasks"
    
    # Update dependencies check
    npm outdated > logs/outdated-deps.log 2>&1
    
    # Run full test suite
    npm run test > logs/daily-tests.log 2>&1
    
    # Generate fresh types
    npm run generate:types > logs/type-generation.log 2>&1
    
    # Code quality check
    npm run lint > logs/daily-lint.log 2>&1
    
    log_task "Daily tasks completed"
}

weekly_tasks() {
    log_task "Starting weekly tasks"
    
    # Full build test
    npm run build > logs/weekly-build.log 2>&1
    
    # Coverage report
    npm run coverage > logs/weekly-coverage.log 2>&1
    
    # E2E tests
    npm run test:e2e > logs/weekly-e2e.log 2>&1
    
    # Backup project
    tar -czf "logs/weekly-backup-$(date +%Y%m%d).tar.gz" . \
        --exclude=node_modules --exclude=.next --exclude=logs/*.tar.gz
    
    log_task "Weekly tasks completed"
}

pre_commit_tasks() {
    log_task "Starting pre-commit tasks"
    
    # Quick quality checks
    npm run lint --silent || { log_task "Lint failed"; exit 1; }
    npm run format --silent || { log_task "Format failed"; exit 1; }
    npx tsc --noEmit || { log_task "Type check failed"; exit 1; }
    npm run test --silent || { log_task "Tests failed"; exit 1; }
    
    log_task "Pre-commit tasks passed"
}

watch_tasks() {
    log_task "Starting file watcher"
    
    # Watch for file changes and run appropriate tasks
    while true; do
        # Check for TypeScript file changes
        if find src -name "*.ts" -o -name "*.tsx" -newer logs/last-ts-check 2>/dev/null | grep -q .; then
            touch logs/last-ts-check
            log_task "TypeScript files changed, running type check"
            npx tsc --noEmit > logs/watch-typecheck.log 2>&1 &
        fi
        
        # Check for test file changes
        if find src -name "*.test.*" -o -name "*.spec.*" -newer logs/last-test-check 2>/dev/null | grep -q .; then
            touch logs/last-test-check
            log_task "Test files changed, running tests"
            npm run test > logs/watch-tests.log 2>&1 &
        fi
        
        sleep 5
    done
}

# Task status monitoring
task_status() {
    echo "=== Task Scheduler Status ==="
    echo "Last daily run: $(grep 'daily tasks completed' "$TASK_LOG" | tail -1 | cut -d']' -f1 | tr -d '[')"
    echo "Last weekly run: $(grep 'weekly tasks completed' "$TASK_LOG" | tail -1 | cut -d']' -f1 | tr -d '[')"
    echo "Active watchers: $(pgrep -f 'task-scheduler.sh watch' | wc -l)"
    echo "Log file size: $(du -h "$TASK_LOG" 2>/dev/null | cut -f1 || echo '0B')"
    echo "Recent errors: $(grep -c 'failed\|error' "$TASK_LOG" 2>/dev/null || echo '0')"
    echo "============================"
}

# Main command handler
case "${1:-help}" in
    "daily")
        daily_tasks
        ;;
    "weekly")
        weekly_tasks
        ;;
    "pre-commit")
        pre_commit_tasks
        ;;
    "watch")
        watch_tasks
        ;;
    "status")
        task_status
        ;;
    "logs")
        tail -n 20 "$TASK_LOG" 2>/dev/null || echo "No logs found"
        ;;
    "help"|*)
        echo "CDH Task Scheduler"
        echo "Usage:"
        echo "  $0 daily      - Run daily maintenance tasks"
        echo "  $0 weekly     - Run weekly comprehensive tasks"
        echo "  $0 pre-commit - Run pre-commit validation"
        echo "  $0 watch      - Start file watcher for auto-tasks"
        echo "  $0 status     - Show scheduler status"
        echo "  $0 logs       - Show recent task logs"
        ;;
esac
