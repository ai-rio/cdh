#!/bin/bash

# CDH Project Q CLI Initialization
echo "Initializing Q CLI for CDH project..."

# Set project-specific environment variables
export Q_PROJECT="CDH"
export Q_STACK="Next.js,React,TypeScript,Tailwind,PayloadCMS"
export Q_CONTEXT_FILE=".q-context.md"

# Project-specific system prompt
export Q_SYSTEM_PROMPT="You are working on the CDH (Creator Dashboard Hub) project - a Next.js application for creator business management. 

Tech Stack: Next.js 15.3.0, React 19.1.0, TypeScript 5.7.3, Tailwind CSS 4.1.10, Payload CMS 3.43.0

Key Principles:
1. Write clean, maintainable TypeScript code
2. Use functional React components with hooks
3. Follow Tailwind CSS best practices
4. Ensure accessibility compliance
5. Optimize for performance
6. Consider mobile-first responsive design
7. Implement proper error handling
8. Write comprehensive tests

Always provide complete, working code examples and explain your reasoning."

# Create project-specific Q command
alias qcdh='q chat --context-file=.q-context.md'

echo "CDH Q CLI environment initialized!"
echo "Use 'qcdh' for project-aware assistance"
