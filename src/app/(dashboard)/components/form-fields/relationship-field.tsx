'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, Search, ExternalLink, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { FieldConfig } from '@/types';
import type { Control } from 'react-hook-form';

interface RelationshipFieldProps {
  field: FieldConfig;
  control: Control<any>;
  isLoading?: boolean;
  showValidation?: boolean;
}

// Mock data for demonstration - in real app this would come from API
const mockRelatedData = {
  users: [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  ],
  posts: [
    { id: '1', title: 'First Post', status: 'published' },
    { id: '2', title: 'Draft Post', status: 'draft' },
    { id: '3', title: 'Another Post', status: 'published' },
  ],
  media: [
    { id: '1', filename: 'image1.jpg', alt: 'Sample Image 1' },
    { id: '2', filename: 'image2.png', alt: 'Sample Image 2' },
    { id: '3', filename: 'document.pdf', alt: 'Sample Document' },
  ]
};

export function RelationshipField({ field, control, isLoading = false, showValidation = true }: RelationshipFieldProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<any[]>([]);

  const relationTo = field.relationTo as string;
  const isMultiple = field.hasMany === true;
  const maxDepth = field.maxDepth || 1;

  // Load available options based on relationTo
  useEffect(() => {
    const loadOptions = () => {
      // In a real app, this would be an API call
      const data = mockRelatedData[relationTo as keyof typeof mockRelatedData] || [];
      setAvailableOptions(data);
    };

    if (relationTo) {
      loadOptions();
    }
  }, [relationTo]);

  // Filter options based on search term
  const filteredOptions = searchTerm
    ? availableOptions.filter(option => {
        const searchableText = Object.values(option).join(' ').toLowerCase();
        return searchableText.includes(searchTerm.toLowerCase());
      })
    : availableOptions;

  const getDisplayText = (item: any): string => {
    // Common display fields to try
    const displayFields = ['name', 'title', 'label', 'filename', 'email'];
    for (const field of displayFields) {
      if (item[field]) return item[field];
    }
    return item.id || 'Unknown';
  };

  const getSecondaryText = (item: any): string => {
    // Secondary info fields
    const secondaryFields = ['email', 'status', 'description', 'alt'];
    for (const field of secondaryFields) {
      if (item[field] && item[field] !== getDisplayText(item)) {
        return item[field];
      }
    }
    return '';
  };

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => {
        const selectedValues = isMultiple 
          ? (formField.value || []) 
          : (formField.value ? [formField.value] : []);

        const selectedItems = selectedValues
          .map((val: any) => {
            if (typeof val === 'object') return val;
            return availableOptions.find(opt => opt.id === val);
          })
          .filter(Boolean);

        const handleSelect = (selectedId: string) => {
          const selectedItem = availableOptions.find(opt => opt.id === selectedId);
          if (!selectedItem) return;

          if (isMultiple) {
            const newValues = [...selectedValues, selectedItem];
            formField.onChange(newValues);
          } else {
            formField.onChange(selectedItem);
          }
          setIsSearchOpen(false);
        };

        const handleRemove = (itemToRemove: any) => {
          if (isMultiple) {
            const newValues = selectedValues.filter((val: any) => 
              (typeof val === 'object' ? val.id : val) !== itemToRemove.id
            );
            formField.onChange(newValues);
          } else {
            formField.onChange(null);
          }
        };

        const canSelectMore = isMultiple || selectedItems.length === 0;

        return (
          <FormItem className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <Link className="h-4 w-4 text-muted-foreground" />
              {field.label || field.name}
              {field.required && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  Required
                </Badge>
              )}
              <Badge variant="outline" className="text-xs px-1 py-0">
                → {relationTo}
              </Badge>
              {isMultiple && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  Multiple
                </Badge>
              )}
            </FormLabel>

            <div className="space-y-2">
              {/* Selected items */}
              {selectedItems.length > 0 && (
                <div className="space-y-2">
                  {selectedItems.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-center justify-between p-2 border rounded-lg bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {getDisplayText(item)}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => {
                              // In real app, this would open the related record
                              console.log('Open related record:', item);
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        {getSecondaryText(item) && (
                          <p className="text-xs text-muted-foreground truncate">
                            {getSecondaryText(item)}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleRemove(item)}
                        disabled={isLoading || field.admin?.readOnly}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Select/Search interface */}
              <FormControl>
                <div className="flex gap-2">
                  {availableOptions.length <= 10 ? (
                    // Simple select for small lists
                    <Select
                      onValueChange={handleSelect}
                      disabled={isLoading || field.admin?.readOnly || !canSelectMore}
                    >
                      <SelectTrigger className={fieldState.error ? 'border-destructive' : ''}>
                        <SelectValue 
                          placeholder={
                            canSelectMore 
                              ? `Select ${relationTo}` 
                              : `Maximum selections reached`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableOptions
                          .filter(opt => !selectedItems.some(selected => selected.id === opt.id))
                          .map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              <div>
                                <div className="font-medium">{getDisplayText(option)}</div>
                                {getSecondaryText(option) && (
                                  <div className="text-xs text-muted-foreground">
                                    {getSecondaryText(option)}
                                  </div>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    // Search dialog for large lists
                    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={`justify-start ${fieldState.error ? 'border-destructive' : ''}`}
                          disabled={isLoading || field.admin?.readOnly || !canSelectMore}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          {canSelectMore ? `Search ${relationTo}` : 'Maximum selections reached'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Select {relationTo}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder={`Search ${relationTo}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                          />
                          <div className="max-h-[300px] overflow-y-auto space-y-1">
                            {filteredOptions
                              .filter(opt => !selectedItems.some(selected => selected.id === opt.id))
                              .map((option) => (
                                <Button
                                  key={option.id}
                                  type="button"
                                  variant="ghost"
                                  className="w-full justify-start h-auto p-3"
                                  onClick={() => handleSelect(option.id)}
                                >
                                  <div className="text-left">
                                    <div className="font-medium">{getDisplayText(option)}</div>
                                    {getSecondaryText(option) && (
                                      <div className="text-xs text-muted-foreground">
                                        {getSecondaryText(option)}
                                      </div>
                                    )}
                                  </div>
                                </Button>
                              ))}
                            {filteredOptions.length === 0 && (
                              <div className="text-center py-4 text-muted-foreground">
                                No {relationTo} found
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </FormControl>
            </div>

            {/* Field description */}
            {field.admin?.description && (
              <FormDescription className="text-sm">
                {field.admin.description}
              </FormDescription>
            )}

            {/* Relationship info */}
            {showValidation && (
              <FormDescription className="text-xs">
                Links to records in the {relationTo} collection
                {maxDepth > 1 && ` (depth: ${maxDepth})`}
                {isMultiple && ' - Multiple selections allowed'}
              </FormDescription>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}