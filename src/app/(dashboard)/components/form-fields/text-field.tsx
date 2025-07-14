'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Type, Eye, EyeOff } from "lucide-react";
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

interface TextFieldProps {
  field: FieldConfig;
  control: Control<any>;
  isLoading?: boolean;
  showValidation?: boolean;
}

export function TextField({ field, control, isLoading = false, showValidation = true }: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const isPassword = field.admin?.style?.inputType === 'password';
  const showCharCount = field.maxLength && field.maxLength > 50;

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => (
        <FormItem className="space-y-2">
          <FormLabel className="flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
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
          </FormLabel>

          <div className="relative">
            <FormControl>
              <Input
                {...formField}
                type={isPassword && !showPassword ? 'password' : 'text'}
                placeholder={field.admin?.placeholder || `Enter ${field.label || field.name}`}
                disabled={isLoading || field.admin?.readOnly}
                maxLength={field.maxLength}
                minLength={field.minLength}
                className={`${isPassword ? 'pr-10' : ''} ${
                  fieldState.error ? 'border-destructive' : ''
                }`}
                value={formField.value || ''}
                onChange={(e) => {
                  formField.onChange(e);
                  setCharCount(e.target.value.length);
                }}
              />
            </FormControl>

            {isPassword && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            )}
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