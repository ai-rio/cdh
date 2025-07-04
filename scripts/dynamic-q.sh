#!/bin/bash

# Dynamic Q system prompt based on context
get_dynamic_prompt() {
    local current_dir=$(basename "$PWD")
    local git_branch=$(git branch --show-current 2>/dev/null || echo "main")
    local file_context=""
    
    # Detect context based on current directory
    if [[ "$PWD" == *"/components"* ]]; then
        file_context="You are working on React components. Focus on reusable, accessible, and well-typed components."
    elif [[ "$PWD" == *"/pages"* ]] || [[ "$PWD" == *"/app"* ]]; then
        file_context="You are working on Next.js pages/routes. Focus on routing, SEO, and page-level optimizations."
    elif [[ "$PWD" == *"/tests"* ]]; then
        file_context="You are working on tests. Focus on comprehensive test coverage and maintainable test code."
    elif [[ "$PWD" == *"/docs"* ]]; then
        file_context="You are working on documentation. Focus on clear, comprehensive, and up-to-date documentation."
    else
        file_context="You are working on the CDH project."
    fi
    
    # Branch-specific context
    local branch_context=""
    if [[ "$git_branch" == *"feature"* ]]; then
        branch_context="You are working on a feature branch. Focus on implementing new functionality with proper testing."
    elif [[ "$git_branch" == *"fix"* ]] || [[ "$git_branch" == *"bug"* ]]; then
        branch_context="You are working on a bug fix. Focus on identifying root causes and implementing robust solutions."
    elif [[ "$git_branch" == *"refactor"* ]]; then
        branch_context="You are refactoring code. Focus on improving code quality while maintaining functionality."
    fi
    
    echo "CDH Project Assistant - $file_context $branch_context Always provide production-ready, well-tested solutions."
}

# Dynamic Q command
alias qd='q chat --system-prompt "$(get_dynamic_prompt)"'

echo "Dynamic Q assistant loaded. Use 'qd' for context-aware assistance."
