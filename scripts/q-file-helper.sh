#!/bin/bash

# Q CLI file selection helpers

# Select and analyze a component
qcomp() {
    echo "Available components:"
    find src/components -name "*.tsx" | nl
    echo -n "Enter component number to analyze: "
    read choice
    
    file=$(find src/components -name "*.tsx" | sed -n "${choice}p")
    if [[ -n "$file" ]]; then
        echo "Analyzing: $file"
        q chat "Please review this React component for best practices, performance, and potential improvements: $file"
    else
        echo "Invalid selection"
    fi
}

# Select and analyze a page
qpage() {
    echo "Available pages:"
    find src/app -name "page.tsx" | nl
    echo -n "Enter page number to analyze: "
    read choice
    
    file=$(find src/app -name "page.tsx" | sed -n "${choice}p")
    if [[ -n "$file" ]]; then
        echo "Analyzing: $file"
        q chat "Please review this Next.js page for SEO, performance, and best practices: $file"
    else
        echo "Invalid selection"
    fi
}

# Select multiple files for comparison
qcompare() {
    echo "Select first file:"
    find src -name "*.tsx" -o -name "*.ts" | nl
    echo -n "Enter first file number: "
    read choice1
    
    echo -n "Enter second file number: "
    read choice2
    
    file1=$(find src -name "*.tsx" -o -name "*.ts" | sed -n "${choice1}p")
    file2=$(find src -name "*.tsx" -o -name "*.ts" | sed -n "${choice2}p")
    
    if [[ -n "$file1" && -n "$file2" ]]; then
        echo "Comparing: $file1 vs $file2"
        q chat "Please compare these two files and suggest improvements: $file1 and $file2"
    else
        echo "Invalid selection"
    fi
}

# Quick file search and select
qfind() {
    local pattern="$1"
    if [[ -z "$pattern" ]]; then
        echo "Usage: qfind <pattern>"
        echo "Example: qfind '*.tsx'"
        return 1
    fi
    
    echo "Files matching '$pattern':"
    find . -name "$pattern" -type f | nl
    echo -n "Enter file number to analyze: "
    read choice
    
    file=$(find . -name "$pattern" -type f | sed -n "${choice}p")
    if [[ -n "$file" ]]; then
        echo "Selected: $file"
        q chat "Please analyze this file: $file"
    else
        echo "Invalid selection"
    fi
}

echo "Q CLI file helpers loaded:"
echo "  qcomp    - Select and analyze a component"
echo "  qpage    - Select and analyze a page"
echo "  qcompare - Compare two files"
echo "  qfind    - Find and analyze files by pattern"
