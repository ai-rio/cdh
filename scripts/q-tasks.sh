#!/bin/bash

# Q CLI Task Integration

# AI-assisted task management
qtask() {
    local task_type="$1"
    shift
    local description="$*"
    
    case "$task_type" in
        "analyze")
            q chat "Analyze the current CDH project status and suggest priority tasks. Current directory: $(pwd)"
            ;;
        "debug")
            q chat "Help me debug this issue: $description. Please suggest systematic troubleshooting steps."
            ;;
        "optimize")
            q chat "Review the CDH project and suggest performance optimizations: $description"
            ;;
        "test")
            q chat "Help me create comprehensive tests for: $description"
            ;;
        "refactor")
            q chat "Suggest refactoring improvements for: $description"
            ;;
        "deploy")
            q chat "Guide me through deploying the CDH project. Current setup: Next.js with Payload CMS"
            ;;
        "security")
            q chat "Perform a security review of the CDH project and suggest improvements"
            ;;
        "plan")
            q chat "Help me plan development tasks for: $description. Break it down into actionable steps."
            ;;
        *)
            echo "Q Task Assistant"
            echo "Usage: qtask <type> [description]"
            echo ""
            echo "Types:"
            echo "  analyze  - Analyze project and suggest tasks"
            echo "  debug    - Get debugging assistance"
            echo "  optimize - Get optimization suggestions"
            echo "  test     - Get testing guidance"
            echo "  refactor - Get refactoring suggestions"
            echo "  deploy   - Get deployment guidance"
            echo "  security - Get security review"
            echo "  plan     - Plan development tasks"
            ;;
    esac
}

# Task execution with AI monitoring
qrun() {
    local task="$1"
    shift
    local args="$*"
    
    echo "Executing task: $task $args"
    echo "Getting AI guidance..."
    
    # Get AI advice before running
    q chat "I'm about to run '$task $args' in my CDH project. Any warnings or suggestions?"
    
    echo "Proceeding with task execution..."
    
    # Execute the task
    if command -v "$task" > /dev/null; then
        "$task" $args
        local exit_code=$?
        
        if [ $exit_code -eq 0 ]; then
            echo "Task completed successfully!"
            q chat "Task '$task $args' completed successfully. What should I do next?"
        else
            echo "Task failed with exit code: $exit_code"
            q chat "Task '$task $args' failed with exit code $exit_code. How should I troubleshoot this?"
        fi
    else
        echo "Task '$task' not found"
        q chat "I tried to run '$task' but it's not found. What's the correct command for: $args"
    fi
}

# Smart task suggestions based on project state
qsuggest() {
    echo "Analyzing project state for task suggestions..."
    
    local git_status=$(git status --porcelain 2>/dev/null | wc -l)
    local build_exists=$([[ -d .next ]] && echo "yes" || echo "no")
    local tests_exist=$(find . -name "*.test.*" -o -name "*.spec.*" | wc -l)
    
    q chat "Based on the CDH project state: $git_status files changed, build exists: $build_exists, $tests_exist test files found. What tasks should I prioritize?"
}

# Load task aliases
alias qtask=qtask
alias qrun=qrun
alias qsuggest=qsuggest

echo "Q CLI task integration loaded:"
echo "  qtask <type> [desc] - Get AI task assistance"
echo "  qrun <command>      - Execute with AI guidance"
echo "  qsuggest           - Get AI task suggestions"
