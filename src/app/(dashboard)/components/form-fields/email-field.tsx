'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, Check, X } from "lucide-react";
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

interface EmailFieldProps {
  field: FieldConfig;
  control: Control<any>;
  isLoading?: boolean;
  showValidation?: boolean;
}

export function EmailField({ field, control, isLoading = false, showValidation = true }: EmailFieldProps) {
  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => {
        // Update email validation when value changes
        useEffect(() => {
          if (formField.value) {
            setIsValidEmail(validateEmail(formField.value));
          } else {
            setIsValidEmail(null);
          }
        }, [formField.value]);

        return (
          <FormItem className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {field.label || field.name}
              {field.required && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  Required
                </Badge>
              )}
              {field.unique && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  Unique
                </Badge>
              )}
              {field.index && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  Indexed
                </Badge>
              )}
            </FormLabel>

            <div className="relative">
              <FormControl>
                <Input
                  {...formField}
                  type="email"
                  placeholder={field.admin?.placeholder || "Enter email address"}
                  disabled={isLoading || field.admin?.readOnly}
                  className={`pr-8 ${
                    fieldState.error ? 'border-destructive' : 
                    isValidEmail === true ? 'border-green-500' :
                    isValidEmail === false ? 'border-orange-500' : ''
                  }`}
                  value={formField.value || ''}
                  autoComplete="email"
                />
              </FormControl>

              {/* Email validation indicator */}
              {formField.value && isValidEmail !== null && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {isValidEmail ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-orange-500" />
                  )}
                </div>
              )}
            </div>

            {/* Field description */}
            {field.admin?.description && (
              <FormDescription className="text-sm">
                {field.admin.description}
              </FormDescription>
            )}

            {/* Email format hint */}
            {showValidation && formField.value && isValidEmail === false && !fieldState.error && (
              <FormDescription className="text-xs text-orange-600">
                Please enter a valid email address (e.g., user@example.com)
              </FormDescription>
            )}

            {/* Unique field info */}
            {field.unique && showValidation && !fieldState.error && (
              <FormDescription className="text-xs">
                This email address must be unique across all records
              </FormDescription>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}