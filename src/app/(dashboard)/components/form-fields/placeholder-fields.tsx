// Placeholder implementations for remaining field types
// These can be enhanced later with more sophisticated implementations

'use client';

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Upload, 
  Circle, 
  Layers, 
  Folder, 
  Tabs, 
  ChevronDown,
  Code,
  MapPin,
  Layout
} from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { FieldConfig } from '@/types';
import type { Control } from 'react-hook-form';

interface FieldProps {
  field: FieldConfig;
  control: Control<any>;
  isLoading?: boolean;
  showValidation?: boolean;
}

// Email field (extends text field with email validation)
export function EmailField({ field, control, isLoading = false }: FieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <span>@</span>
            {field.label || field.name}
            {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
          </FormLabel>
          <FormControl>
            <Input
              {...formField}
              type="email"
              placeholder={field.admin?.placeholder || "Enter email address"}
              disabled={isLoading || field.admin?.readOnly}
              className={fieldState.error ? 'border-destructive' : ''}
            />
          </FormControl>
          {field.admin?.description && (
            <FormDescription>{field.admin.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Radio field
export function RadioField({ field, control, isLoading = false }: FieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="space-y-3">
          <FormLabel className="flex items-center gap-2">
            <Circle className="h-4 w-4" />
            {field.label || field.name}
            {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={formField.onChange}
              defaultValue={formField.value}
              disabled={isLoading || field.admin?.readOnly}
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={String(option.value)} id={String(option.value)} />
                  <label htmlFor={String(option.value)} className="text-sm font-medium">
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Upload field
export function UploadField({ field, control, isLoading = false }: FieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {field.label || field.name}
            {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
          </FormLabel>
          <FormControl>
            <Input
              type="file"
              onChange={(e) => formField.onChange(e.target.files?.[0])}
              disabled={isLoading || field.admin?.readOnly}
              accept={field.upload?.mimeTypes?.join(',')}
            />
          </FormControl>
          {field.admin?.description && (
            <FormDescription>{field.admin.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Blocks field
export function BlocksField({ field, control, isLoading = false }: FieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            {field.label || field.name}
            {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
            <Badge variant="outline" className="text-xs">Blocks</Badge>
          </FormLabel>
          <Card className="p-4">
            <div className="text-center text-muted-foreground">
              <Layers className="h-8 w-8 mx-auto mb-2" />
              <p>Blocks field implementation needed</p>
              <p className="text-xs">This would render a flexible content builder</p>
            </div>
          </Card>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Group field
export function GroupField({ field, control, isLoading = false }: FieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            {field.label || field.name}
            {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
            <Badge variant="outline" className="text-xs">Group</Badge>
          </FormLabel>
          <Card className="p-4 space-y-4">
            {field.fields?.map((subField) => (
              <div key={subField.name} className="text-sm">
                <strong>{subField.label || subField.name}</strong>: {subField.type}
                {/* Sub-fields would be rendered here recursively */}
              </div>
            ))}
          </Card>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Tabs field
export function TabsField({ field, control, isLoading = false }: FieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Tabs className="h-4 w-4" />
            Tabbed Fields
            <Badge variant="outline" className="text-xs">Tabs</Badge>
          </FormLabel>
          <Card className="p-4">
            <div className="text-center text-muted-foreground">
              <Tabs className="h-8 w-8 mx-auto mb-2" />
              <p>Tabs field implementation needed</p>
              <p className="text-xs">This would render tabbed field organization</p>
            </div>
          </Card>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Collapsible field
export function CollapsibleField({ field, control, isLoading = false }: FieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <Collapsible defaultOpen={!field.collapsed}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-0">
                <ChevronDown className="h-4 w-4" />
                {field.label || 'Collapsible Section'}
                <Badge variant="outline" className="text-xs">Collapsible</Badge>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <Card className="p-4 space-y-4">
                {field.fields?.map((subField) => (
                  <div key={subField.name} className="text-sm">
                    <strong>{subField.label || subField.name}</strong>: {subField.type}
                  </div>
                ))}
              </Card>
            </CollapsibleContent>
          </Collapsible>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// JSON field
export function JsonField({ field, control, isLoading = false }: FieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            {field.label || field.name}
            {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
            <Badge variant="outline" className="text-xs">JSON</Badge>
          </FormLabel>
          <FormControl>
            <Textarea
              {...formField}
              placeholder={field.admin?.placeholder || "Enter JSON data"}
              disabled={isLoading || field.admin?.readOnly}
              rows={6}
              className={`font-mono ${fieldState.error ? 'border-destructive' : ''}`}
              value={typeof formField.value === 'object' 
                ? JSON.stringify(formField.value, null, 2) 
                : formField.value || ''
              }
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  formField.onChange(parsed);
                } catch {
                  formField.onChange(e.target.value);
                }
              }}
            />
          </FormControl>
          {field.admin?.description && (
            <FormDescription>{field.admin.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Code field
export function CodeField({ field, control, isLoading = false }: FieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            {field.label || field.name}
            {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
            <Badge variant="outline" className="text-xs">
              {field.admin?.language || 'Code'}
            </Badge>
          </FormLabel>
          <FormControl>
            <Textarea
              {...formField}
              placeholder={field.admin?.placeholder || `Enter ${field.admin?.language || 'code'}`}
              disabled={isLoading || field.admin?.readOnly}
              rows={8}
              className={`font-mono text-sm ${fieldState.error ? 'border-destructive' : ''}`}
              value={formField.value || ''}
            />
          </FormControl>
          {field.admin?.description && (
            <FormDescription>{field.admin.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Point field (geographic coordinates)
export function PointField({ field, control, isLoading = false }: FieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => {
        const coordinates = formField.value || { latitude: '', longitude: '' };
        
        return (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {field.label || field.name}
              {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
              <Badge variant="outline" className="text-xs">Point</Badge>
            </FormLabel>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Latitude</label>
                <Input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={coordinates.latitude || ''}
                  onChange={(e) => formField.onChange({
                    ...coordinates,
                    latitude: parseFloat(e.target.value) || ''
                  })}
                  disabled={isLoading || field.admin?.readOnly}
                  className={fieldState.error ? 'border-destructive' : ''}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Longitude</label>
                <Input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={coordinates.longitude || ''}
                  onChange={(e) => formField.onChange({
                    ...coordinates,
                    longitude: parseFloat(e.target.value) || ''
                  })}
                  disabled={isLoading || field.admin?.readOnly}
                  className={fieldState.error ? 'border-destructive' : ''}
                />
              </div>
            </div>
            {field.admin?.description && (
              <FormDescription>{field.admin.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}