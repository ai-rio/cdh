#!/bin/bash

# Interactive file selector
select_file() {
    local search_pattern="${1:-*}"
    local search_dir="${2:-.}"
    
    echo "Select a file:"
    
    # Create array of files
    files=()
    while IFS= read -r -d '' file; do
        files+=("$file")
    done < <(find "$search_dir" -name "$search_pattern" -type f -print0)
    
    if [ ${#files[@]} -eq 0 ]; then
        echo "No files found matching pattern: $search_pattern"
        return 1
    fi
    
    # Display menu
    PS3="Enter choice (1-${#files[@]}): "
    select file in "${files[@]}" "Cancel"; do
        if [[ "$file" == "Cancel" ]]; then
            echo "Selection cancelled"
            return 1
        elif [[ -n "$file" ]]; then
            echo "Selected: $file"
            export SELECTED_FILE="$file"
            return 0
        else
            echo "Invalid selection. Please try again."
        fi
    done
}

# Usage examples:
# select_file "*.tsx"           # Select TypeScript React files
# select_file "*.ts" "src/"     # Select TypeScript files in src/
# select_file "*test*"          # Select test files
