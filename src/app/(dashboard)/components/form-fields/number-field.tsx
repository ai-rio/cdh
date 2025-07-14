'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Hash, Plus, Minus } from "lucide-react";
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

interface NumberFieldProps {
  field: FieldConfig;
  control: Control<any>;
  isLoading?: boolean;
  showValidation?: boolean;
}

export function NumberField({ field, control, isLoading = false, showValidation = true }: NumberFieldProps) {
  const [inputValue, setInputValue] = useState('');

  const hasSteppers = field.admin?.showSteppers !== false;
  const step = field.admin?.step || 1;
  const precision = field.admin?.precision;

  const formatNumber = (value: number): string => {
    if (precision !== undefined) {
      return value.toFixed(precision);
    }
    return String(value);
  };

  const parseNumber = (value: string): number | undefined => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  };

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => {
        const currentValue = formField.value as number | undefined;

        const handleIncrement = () => {
          const current = currentValue || 0;
          const newValue = current + step;
          if (field.max === undefined || newValue <= field.max) {
            formField.onChange(newValue);
          }
        };

        const handleDecrement = () => {
          const current = currentValue || 0;
          const newValue = current - step;
          if (field.min === undefined || newValue >= field.min) {
            formField.onChange(newValue);
          }
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setInputValue(value);
          
          if (value === '') {
            formField.onChange(undefined);
            return;
          }

          const numValue = parseNumber(value);
          if (numValue !== undefined) {
            formField.onChange(numValue);
          }
        };

        return (
          <FormItem className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
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

            <div className="relative flex">
              {hasSteppers && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 rounded-r-none border-r-0"
                  onClick={handleDecrement}
                  disabled={
                    isLoading || 
                    field.admin?.readOnly || 
                    (field.min !== undefined && (currentValue || 0) <= field.min)
                  }
                >
                  <Minus className="h-3 w-3" />
                </Button>
              )}

              <FormControl>
                <Input
                  type="number"
                  placeholder={field.admin?.placeholder || `Enter ${field.label || field.name}`}
                  disabled={isLoading || field.admin?.readOnly}
                  min={field.min}
                  max={field.max}
                  step={step}
                  className={`${hasSteppers ? 'rounded-none' : ''} ${
                    fieldState.error ? 'border-destructive' : ''
                  }`}
                  value={currentValue !== undefined ? formatNumber(currentValue) : ''}
                  onChange={handleInputChange}
                />
              </FormControl>

              {hasSteppers && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 rounded-l-none border-l-0"
                  onClick={handleIncrement}
                  disabled={
                    isLoading || 
                    field.admin?.readOnly || 
                    (field.max !== undefined && (currentValue || 0) >= field.max)
                  }
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Field description */}
            {field.admin?.description && (
              <FormDescription className="text-sm">
                {field.admin.description}
              </FormDescription>
            )}

            {/* Range validation hints */}
            {showValidation && (field.min !== undefined || field.max !== undefined) && !fieldState.error && (
              <FormDescription className="text-xs">
                {field.min !== undefined && field.max !== undefined ? (
                  `Must be between ${field.min} and ${field.max}`
                ) : field.min !== undefined ? (
                  `Minimum value: ${field.min}`
                ) : (
                  `Maximum value: ${field.max}`
                )}
              </FormDescription>
            )}

            {/* Array info for hasMany fields */}
            {field.hasMany && (
              <FormDescription className="text-xs text-blue-600">
                This field accepts multiple values. Separate with commas or use the array controls.
              </FormDescription>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}