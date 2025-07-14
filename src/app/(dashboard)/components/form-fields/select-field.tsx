'use client';

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import type { FieldConfig } from '@/types';
import type { Control } from 'react-hook-form';

interface SelectFieldProps {
  field: FieldConfig;
  control: Control<any>;
  isLoading?: boolean;
  showValidation?: boolean;
}

export function SelectField({ field, control, isLoading = false, showValidation = true }: SelectFieldProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const options = field.options || [];
  const isMultiple = field.hasMany === true;
  const isSearchable = options.length > 10 || field.admin?.searchable === true;

  // Filter options based on search term
  const filteredOptions = searchTerm
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(option.value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const getSelectedLabels = (selectedValues: string[] | string): string => {
    if (!selectedValues) return '';
    
    const values = Array.isArray(selectedValues) ? selectedValues : [selectedValues];
    const selectedOptions = options.filter(option => 
      values.includes(String(option.value))
    );
    
    if (selectedOptions.length === 0) return '';
    if (selectedOptions.length === 1) return selectedOptions[0].label;
    if (selectedOptions.length <= 3) {
      return selectedOptions.map(opt => opt.label).join(', ');
    }
    return `${selectedOptions.length} selected`;
  };

  // Single select component
  if (!isMultiple) {
    return (
      <FormField
        control={control}
        name={field.name}
        render={({ field: formField, fieldState }) => (
          <FormItem className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
              {field.label || field.name}
              {field.required && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  Required
                </Badge>
              )}
            </FormLabel>

            <Select
              onValueChange={formField.onChange}
              value={formField.value || ''}
              disabled={isLoading || field.admin?.readOnly}
            >
              <FormControl>
                <SelectTrigger className={fieldState.error ? 'border-destructive' : ''}>
                  <SelectValue 
                    placeholder={field.admin?.placeholder || `Select ${field.label || field.name}`}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isSearchable && (
                  <div className="p-2">
                    <Input
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-8"
                    />
                  </div>
                )}
                {filteredOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
                {filteredOptions.length === 0 && searchTerm && (
                  <div className="p-2 text-sm text-muted-foreground">
                    No options found
                  </div>
                )}
              </SelectContent>
            </Select>

            {field.admin?.description && (
              <FormDescription className="text-sm">
                {field.admin.description}
              </FormDescription>
            )}

            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Multiple select component
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => {
        const selectedValues: string[] = formField.value || [];

        const handleToggleOption = (optionValue: string) => {
          const newValues = selectedValues.includes(optionValue)
            ? selectedValues.filter(v => v !== optionValue)
            : [...selectedValues, optionValue];
          formField.onChange(newValues);
        };

        const handleClearAll = () => {
          formField.onChange([]);
        };

        return (
          <FormItem className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
              {field.label || field.name}
              {field.required && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  Required
                </Badge>
              )}
              <Badge variant="outline" className="text-xs px-1 py-0">
                Multiple
              </Badge>
            </FormLabel>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className={`justify-between h-auto min-h-[40px] ${
                      fieldState.error ? 'border-destructive' : ''
                    }`}
                    disabled={isLoading || field.admin?.readOnly}
                  >
                    <div className="flex flex-wrap gap-1">
                      {selectedValues.length === 0 ? (
                        <span className="text-muted-foreground">
                          {field.admin?.placeholder || `Select ${field.label || field.name}`}
                        </span>
                      ) : selectedValues.length <= 3 ? (
                        selectedValues.map(value => {
                          const option = options.find(opt => String(opt.value) === value);
                          return option ? (
                            <Badge key={value} variant="secondary" className="text-xs">
                              {option.label}
                            </Badge>
                          ) : null;
                        })
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {selectedValues.length} selected
                        </Badge>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                {isSearchable && (
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search options..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-8 pl-8"
                      />
                    </div>
                  </div>
                )}
                
                <div className="p-2">
                  {selectedValues.length > 0 && (
                    <div className="flex justify-between items-center mb-2 pb-2 border-b">
                      <span className="text-sm text-muted-foreground">
                        {selectedValues.length} selected
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAll}
                        className="h-6 px-2 text-xs"
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                  
                  <div className="max-h-[200px] overflow-y-auto space-y-1">
                    {filteredOptions.map((option) => {
                      const isSelected = selectedValues.includes(String(option.value));
                      return (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 p-1 rounded hover:bg-accent cursor-pointer"
                          onClick={() => handleToggleOption(String(option.value))}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleToggleOption(String(option.value))}
                          />
                          <span className="flex-1 text-sm">{option.label}</span>
                          {isSelected && <Check className="h-3 w-3 text-primary" />}
                        </div>
                      );
                    })}
                    
                    {filteredOptions.length === 0 && (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        {searchTerm ? 'No options found' : 'No options available'}
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {field.admin?.description && (
              <FormDescription className="text-sm">
                {field.admin.description}
              </FormDescription>
            )}

            {/* Multi-select info */}
            {showValidation && isMultiple && (
              <FormDescription className="text-xs">
                You can select multiple options. Click to toggle selection.
              </FormDescription>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}