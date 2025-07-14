'use client';

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
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

interface CheckboxFieldProps {
  field: FieldConfig;
  control: Control<any>;
  isLoading?: boolean;
  showValidation?: boolean;
}

export function CheckboxField({ field, control, isLoading = false, showValidation = true }: CheckboxFieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={formField.value || false}
              onCheckedChange={formField.onChange}
              disabled={isLoading || field.admin?.readOnly}
              className={fieldState.error ? 'border-destructive' : ''}
            />
          </FormControl>
          <div className="space-y-1 leading-none flex-1">
            <FormLabel className="flex items-center gap-2 cursor-pointer">
              <Check className="h-4 w-4 text-muted-foreground" />
              {field.label || field.name}
              {field.required && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  Required
                </Badge>
              )}
            </FormLabel>
            
            {field.admin?.description && (
              <FormDescription className="text-sm">
                {field.admin.description}
              </FormDescription>
            )}

            {/* Default value info */}
            {showValidation && field.defaultValue !== undefined && (
              <FormDescription className="text-xs">
                Default: {field.defaultValue ? 'Checked' : 'Unchecked'}
              </FormDescription>
            )}

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}