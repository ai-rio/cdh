'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import type { FieldConfig } from '@/types';

interface CollectionTableProps {
  data: any[];
  fields: FieldConfig[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
  onDuplicate?: (item: any) => void;
  isLoading?: boolean;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  displayFields?: string[];
}

export function CollectionTable({
  data,
  fields,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  isLoading = false,
  sortField,
  sortDirection,
  onSort,
  displayFields
}: CollectionTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Determine which fields to display
  const visibleFields = useMemo(() => {
    if (displayFields) {
      return fields.filter(field => displayFields.includes(field.name));
    }
    
    // Default visible fields logic
    const adminColumns = fields.find(f => f.admin?.defaultColumns)?.admin?.defaultColumns;
    if (adminColumns) {
      return fields.filter(field => adminColumns.includes(field.name));
    }
    
    // Fallback: show first few fields, prioritize important ones
    const priorityFields = ['id', 'title', 'name', 'email', 'status', 'createdAt'];
    const sorted = fields.sort((a, b) => {
      const aIndex = priorityFields.indexOf(a.name);
      const bIndex = priorityFields.indexOf(b.name);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
    
    return sorted.slice(0, 6); // Show first 6 fields
  }, [fields, displayFields]);

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(data.map(item => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  // Handle individual selection
  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, itemId]);
    } else {
      onSelectionChange(selectedIds.filter(id => id !== itemId));
    }
  };

  // Handle sorting
  const handleSort = (fieldName: string) => {
    if (!onSort) return;
    
    if (sortField === fieldName) {
      // Toggle direction
      onSort(fieldName, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, start with asc
      onSort(fieldName, 'asc');
    }
  };

  // Format cell value based on field type
  const formatCellValue = (value: any, field: FieldConfig): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">—</span>;
    }

    switch (field.type) {
      case 'checkbox':
        return (
          <Badge variant={value ? 'default' : 'secondary'}>
            {value ? 'Yes' : 'No'}
          </Badge>
        );
      
      case 'date':
        try {
          const date = new Date(value);
          return format(date, 'MMM d, yyyy');
        } catch {
          return String(value);
        }
      
      case 'email':
        return (
          <a 
            href={`mailto:${value}`} 
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </a>
        );
      
      case 'upload':
        if (typeof value === 'object' && value.filename) {
          return (
            <div className="flex items-center gap-1">
              <span className="truncate max-w-[150px]">{value.filename}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </div>
          );
        }
        return String(value);
      
      case 'relationship':
        if (typeof value === 'object') {
          const displayValue = value.name || value.title || value.email || value.id;
          return (
            <Badge variant="outline" className="max-w-[150px] truncate">
              {displayValue}
            </Badge>
          );
        }
        return String(value);
      
      case 'select':
        return (
          <Badge variant="secondary">
            {field.options?.find(opt => opt.value === value)?.label || value}
          </Badge>
        );
      
      case 'richText':
        // Strip HTML and truncate
        const textContent = String(value).replace(/<[^>]*>/g, '');
        return (
          <span className="truncate max-w-[200px]" title={textContent}>
            {textContent.length > 50 ? `${textContent.slice(0, 50)}...` : textContent}
          </span>
        );
      
      case 'array':
        if (Array.isArray(value)) {
          return (
            <Badge variant="outline">
              {value.length} item{value.length !== 1 ? 's' : ''}
            </Badge>
          );
        }
        return String(value);
      
      case 'json':
        return (
          <Badge variant="outline" className="font-mono text-xs">
            JSON ({Object.keys(value || {}).length} keys)
          </Badge>
        );
      
      default:
        const stringValue = String(value);
        return (
          <span 
            className="truncate max-w-[200px]" 
            title={stringValue.length > 30 ? stringValue : undefined}
          >
            {stringValue.length > 30 ? `${stringValue.slice(0, 30)}...` : stringValue}
          </span>
        );
    }
  };

  // Get sort icon
  const getSortIcon = (fieldName: string) => {
    if (sortField !== fieldName) {
      return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-3 w-3" />
      : <ArrowDown className="h-3 w-3" />;
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < data.length;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Selection column */}
            <TableHead className="w-[50px]">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isPartiallySelected}
                onCheckedChange={handleSelectAll}
                disabled={isLoading || data.length === 0}
              />
            </TableHead>
            
            {/* Field columns */}
            {visibleFields.map((field) => (
              <TableHead 
                key={field.name}
                className={onSort ? 'cursor-pointer hover:bg-muted/50' : ''}
                onClick={() => handleSort(field.name)}
              >
                <div className="flex items-center gap-2">
                  <span>{field.label || field.name}</span>
                  {onSort && getSortIcon(field.name)}
                </div>
              </TableHead>
            ))}
            
            {/* Actions column */}
            <TableHead className="w-[50px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                </TableCell>
                {visibleFields.map((field) => (
                  <TableCell key={field.name}>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </TableCell>
                ))}
                <TableCell>
                  <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                </TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            // Empty state
            <TableRow>
              <TableCell 
                colSpan={visibleFields.length + 2} 
                className="h-24 text-center text-muted-foreground"
              >
                No data found.
              </TableCell>
            </TableRow>
          ) : (
            // Data rows
            data.map((item) => (
              <TableRow
                key={item.id}
                className={`cursor-pointer transition-colors ${
                  selectedIds.includes(item.id) ? 'bg-muted/50' : ''
                } ${hoveredRow === item.id ? 'bg-muted/30' : ''}`}
                onMouseEnter={() => setHoveredRow(item.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onView?.(item)}
              >
                {/* Selection checkbox */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                  />
                </TableCell>
                
                {/* Data cells */}
                {visibleFields.map((field) => (
                  <TableCell key={field.name} className="max-w-[200px]">
                    {formatCellValue(item[field.name], field)}
                  </TableCell>
                ))}
                
                {/* Actions dropdown */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDuplicate && (
                        <DropdownMenuItem onClick={() => onDuplicate(item)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                      )}
                      {(onEdit || onDuplicate) && onDelete && <DropdownMenuSeparator />}
                      {onDelete && (
                        <DropdownMenuItem 
                          onClick={() => onDelete(item)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}