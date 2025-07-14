'use client';

import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlignLeft, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { FieldConfig } from '@/types';
import type { Control } from 'react-hook-form';

interface TextareaFieldProps {
  field: FieldConfig;
  control: Control<any>;
  isLoading?: boolean;
  showValidation?: boolean;
}

export function TextareaField({ field, control, isLoading = false, showValidation = true }: TextareaFieldProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const rows = field.admin?.rows || 4;
  const expandedRows = Math.max(rows * 2, 8);
  const showCharCount = field.maxLength && field.maxLength > 100;

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => (
        <FormItem className="space-y-2">
          <FormLabel className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4 text-muted-foreground" />
            {field.label || field.name}
            {field.required && (
              <Badge variant="destructive" className="text-xs px-1 py-0">
                Required
              </Badge>
            )}
          </FormLabel>

          <div className="relative">
            <FormControl>
              <Textarea
                {...formField}
                placeholder={field.admin?.placeholder || `Enter ${field.label || field.name}`}
                disabled={isLoading || field.admin?.readOnly}
                maxLength={field.maxLength}
                rows={isExpanded ? expandedRows : rows}
                className={`resize-none transition-all duration-200 ${
                  fieldState.error ? 'border-destructive' : ''
                }`}
                value={formField.value || ''}
                onChange={(e) => {
                  formField.onChange(e);
                  setCharCount(e.target.value.length);
                }}
              />
            </FormControl>

            {/* Expand/Collapse button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
              disabled={isLoading}
            >
              {isExpanded ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Character count */}
          {showCharCount && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span></span>
              <span className={charCount > field.maxLength! ? 'text-destructive' : ''}>
                {charCount}/{field.maxLength}
              </span>
            </div>
          )}

          {/* Field description */}
          {field.admin?.description && (
            <FormDescription className="text-sm">
              {field.admin.description}
            </FormDescription>
          )}

          {/* Validation hints */}
          {showValidation && (field.minLength || field.maxLength) && !fieldState.error && (
            <FormDescription className="text-xs">
              {field.minLength && field.maxLength ? (
                `Must be between ${field.minLength} and ${field.maxLength} characters`
              ) : field.minLength ? (
                `Minimum ${field.minLength} characters`
              ) : (
                `Maximum ${field.maxLength} characters`
              )}
            </FormDescription>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}