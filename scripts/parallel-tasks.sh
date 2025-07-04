#!/bin/bash

# Parallel Task Execution for CDH

run_parallel_dev() {
    echo "Starting parallel development tasks..."
    
    # Run multiple tasks in parallel
    {
        echo "Task 1: Type checking..."
        npx tsc --noEmit
    } &
    
    {
        echo "Task 2: Linting..."
        npm run lint
    } &
    
    {
        echo "Task 3: Running tests..."
        npm run test
    } &
    
    # Wait for all background jobs
    wait
    echo "All development tasks completed!"
}

run_parallel_build() {
    echo "Starting parallel build tasks..."
    
    {
        echo "Task 1: Building application..."
        npm run build
    } &
    
    {
        echo "Task 2: Running tests..."
        npm run test
    } &
    
    {
        echo "Task 3: Generating types..."
        npm run generate:types
    } &
    
    wait
    echo "All build tasks completed!"
}

run_parallel_quality() {
    echo "Starting parallel quality checks..."
    
    {
        echo "Task 1: ESLint..."
        npm run lint
    } &
    
    {
        echo "Task 2: Prettier..."
        npm run format
    } &
    
    {
        echo "Task 3: TypeScript check..."
        npx tsc --noEmit
    } &
    
    {
        echo "Task 4: Test coverage..."
        npm run coverage
    } &
    
    wait
    echo "All quality checks completed!"
}

# Task queue management
declare -a task_queue=()

add_task() {
    task_queue+=("$1")
    echo "Added task: $1"
}

run_task_queue() {
    echo "Running ${#task_queue[@]} tasks in parallel..."
    
    for task in "${task_queue[@]}"; do
        {
            echo "Executing: $task"
            eval "$task"
        } &
    done
    
    wait
    echo "All queued tasks completed!"
    task_queue=()  # Clear queue
}

# Usage examples
case "${1:-menu}" in
    "dev")
        run_parallel_dev
        ;;
    "build")
        run_parallel_build
        ;;
    "quality")
        run_parallel_quality
        ;;
    "queue")
        shift
        for task in "$@"; do
            add_task "$task"
        done
        run_task_queue
        ;;
    "menu"|*)
        echo "Parallel Task Runner"
        echo "Usage:"
        echo "  $0 dev      - Run development tasks in parallel"
        echo "  $0 build    - Run build tasks in parallel"
        echo "  $0 quality  - Run quality checks in parallel"
        echo "  $0 queue 'task1' 'task2' - Run custom tasks in parallel"
        ;;
esac
