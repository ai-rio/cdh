'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar,
  Upload,
  Link,
  Hash,
  Type,
  ToggleLeft,
  List,
  FileText,
  Mail,
  Phone,
  Globe,
  CircleDot,
  PenTool,
  Layers,
  Package,
  FolderOpen
} from "lucide-react";

interface CollectionField {
  name: string;
  type: string;
  label?: string;
  required?: boolean;
  admin?: {
    readOnly?: boolean;
    hidden?: boolean;
    description?: string;
    placeholder?: string;
  };
  options?: Array<{
    label: string;
    value: string | number;
  }>;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  defaultValue?: any;
  validate?: (value: any) => boolean | string;
}

interface DynamicFormProps {
  fields: CollectionField[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
  className?: string;
}

// Generate Zod schema from Payload fields
function generateZodSchema(fields: CollectionField[]) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    if (field.admin?.readOnly || field.admin?.hidden) return;

    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
      case 'textarea':
        fieldSchema = z.string();
        if (field.minLength) fieldSchema = (fieldSchema as z.ZodString).min(field.minLength);
        if (field.maxLength) fieldSchema = (fieldSchema as z.ZodString).max(field.maxLength);
        break;

      case 'email':
        fieldSchema = z.string().email();
        break;

      case 'number':
        fieldSchema = z.number();
        if (field.min !== undefined) fieldSchema = (fieldSchema as z.ZodNumber).min(field.min);
        if (field.max !== undefined) fieldSchema = (fieldSchema as z.ZodNumber).max(field.max);
        break;

      case 'checkbox':
        fieldSchema = z.boolean();
        break;

      case 'select':
        if (field.options && field.options.length > 0) {
          const values = field.options.map(opt => opt.value);
          fieldSchema = z.enum(values as [string, ...string[]]);
        } else {
          fieldSchema = z.string();
        }
        break;

      case 'date':
        fieldSchema = z.string().or(z.date());
        break;

      case 'relationship':
        fieldSchema = z.string().or(z.number());
        break;

      case 'upload':
        fieldSchema = z.any();
        break;

      case 'json':
        fieldSchema = z.any();
        break;

      default:
        fieldSchema = z.string();
    }

    // Make field optional if not required
    if (!field.required) {
      fieldSchema = fieldSchema.optional();
    }

    schemaFields[field.name] = fieldSchema;
  });

  return z.object(schemaFields);
}

// Get field icon
function getFieldIcon(type: string) {
  switch (type) {
    case 'text': return <Type className="h-4 w-4" />;
    case 'textarea': return <FileText className="h-4 w-4" />;
    case 'email': return <Mail className="h-4 w-4" />;
    case 'number': return <Hash className="h-4 w-4" />;
    case 'checkbox': return <ToggleLeft className="h-4 w-4" />;
    case 'select': return <List className="h-4 w-4" />;
    case 'radio': return <CircleDot className="h-4 w-4" />;
    case 'date': return <Calendar className="h-4 w-4" />;
    case 'upload': return <Upload className="h-4 w-4" />;
    case 'relationship': return <Link className="h-4 w-4" />;
    case 'richText': return <PenTool className="h-4 w-4" />;
    case 'array': return <List className="h-4 w-4" />;
    case 'blocks': return <Layers className="h-4 w-4" />;
    case 'group': return <Package className="h-4 w-4" />;
    case 'url': return <Globe className="h-4 w-4" />;
    case 'phone': return <Phone className="h-4 w-4" />;
    default: return <Type className="h-4 w-4" />;
  }
}

export function DynamicForm({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isLoading = false,
  className
}: DynamicFormProps) {
  const [schema, setSchema] = useState<z.ZodObject<any>>();

  // Generate form schema
  useEffect(() => {
    const generatedSchema = generateZodSchema(fields);
    setSchema(generatedSchema);
  }, [fields]);

  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: initialData,
  });

  // Handle form submission
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Group fields by type for better organization
  const groupedFields = fields.reduce((groups, field) => {
    if (field.admin?.hidden || field.admin?.readOnly) return groups;

    const category = getFieldCategory(field.type);
    if (!groups[category]) groups[category] = [];
    groups[category].push(field);
    return groups;
  }, {} as Record<string, CollectionField[]>);

  function getFieldCategory(type: string): string {
    switch (type) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'url':
      case 'phone':
        return 'Text Fields';
      case 'number':
        return 'Numeric Fields';
      case 'checkbox':
      case 'select':
        return 'Selection Fields';
      case 'date':
        return 'Date Fields';
      case 'upload':
        return 'Media Fields';
      case 'relationship':
        return 'Relationship Fields';
      case 'json':
        return 'Advanced Fields';
      default:
        return 'Other Fields';
    }
  }

  // Render field based on type
  function renderField(field: CollectionField) {
    const fieldProps = {
      placeholder: field.admin?.placeholder || `Enter ${field.label || field.name}`,
      disabled: isLoading,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {getFieldIcon(field.type)}
                  {field.label || field.name}
                  {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...formField}
                    {...fieldProps}
                    rows={4}
                    value={formField.value as string || ''}
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

      case 'number':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {getFieldIcon(field.type)}
                  {field.label || field.name}
                  {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    {...fieldProps}
                    type="number"
                    min={field.min}
                    max={field.max}
                    value={formField.value as number || ''}
                    onChange={(e) => formField.onChange(Number(e.target.value))}
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

      case 'checkbox':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={formField.value as boolean || false}
                    onCheckedChange={formField.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center gap-2">
                    {getFieldIcon(field.type)}
                    {field.label || field.name}
                    {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </FormLabel>
                  {field.admin?.description && (
                    <FormDescription>{field.admin.description}</FormDescription>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'select':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {getFieldIcon(field.type)}
                  {field.label || field.name}
                  {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                </FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value as string || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={fieldProps.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.admin?.description && (
                  <FormDescription>{field.admin.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'date':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {getFieldIcon(field.type)}
                  {field.label || field.name}
                  {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    {...fieldProps}
                    type="datetime-local"
                    value={formField.value as string || ''}
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

      case 'upload':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {getFieldIcon(field.type)}
                  {field.label || field.name}
                  {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      formField.onChange(file);
                    }}
                    disabled={isLoading}
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

      case 'radio':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel className="flex items-center gap-2">
                  {getFieldIcon(field.type)}
                  {field.label || field.name}
                  {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col space-y-2">
                    {field.options?.map((option: any) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`${field.name}-${option.value}`}
                          name={field.name}
                          value={option.value}
                          checked={formField.value === option.value}
                          onChange={() => formField.onChange(option.value)}
                          disabled={isLoading}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`${field.name}-${option.value}`} className="text-sm">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                {field.admin?.description && (
                  <FormDescription>{field.admin.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'richText':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {getFieldIcon(field.type)}
                  {field.label || field.name}
                  {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...formField}
                    {...fieldProps}
                    rows={8}
                    value={formField.value as string || ''}
                    placeholder="Rich text content..."
                    className="min-h-[200px]"
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

      case 'array':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => {
              const arrayValue = (formField.value as any[]) || [];
              
              return (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    {getFieldIcon(field.type)}
                    {field.label || field.name}
                    {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {arrayValue.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={item || ''}
                            onChange={(e) => {
                              const newArray = [...arrayValue];
                              newArray[index] = e.target.value;
                              formField.onChange(newArray);
                            }}
                            placeholder={`Item ${index + 1}`}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newArray = arrayValue.filter((_, i) => i !== index);
                              formField.onChange(newArray);
                            }}
                            disabled={isLoading}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formField.onChange([...arrayValue, ''])}
                        disabled={isLoading}
                      >
                        Add Item
                      </Button>
                    </div>
                  </FormControl>
                  {field.admin?.description && (
                    <FormDescription>{field.admin.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );

      case 'group':
        return (
          <Card key={field.name} className="p-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {getFieldIcon(field.type)}
                {field.label || field.name}
                {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
              </CardTitle>
              {field.admin?.description && (
                <p className="text-sm text-muted-foreground">{field.admin.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {field.fields?.map((subField: CollectionField) => 
                renderField(subField)
              )}
            </CardContent>
          </Card>
        );

      case 'blocks':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => {
              const blocksValue = (formField.value as any[]) || [];
              
              return (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    {getFieldIcon(field.type)}
                    {field.label || field.name}
                    {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {blocksValue.map((block, index) => (
                        <Card key={index} className="p-4">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm">
                              Block {index + 1} {block.blockType && `(${block.blockType})`}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newBlocks = blocksValue.filter((_, i) => i !== index);
                                formField.onChange(newBlocks);
                              }}
                              disabled={isLoading}
                            >
                              Remove
                            </Button>
                          </CardHeader>
                          <CardContent>
                            <Textarea
                              value={typeof block === 'object' ? JSON.stringify(block, null, 2) : block}
                              onChange={(e) => {
                                try {
                                  const newBlocks = [...blocksValue];
                                  newBlocks[index] = JSON.parse(e.target.value);
                                  formField.onChange(newBlocks);
                                } catch {
                                  const newBlocks = [...blocksValue];
                                  newBlocks[index] = e.target.value;
                                  formField.onChange(newBlocks);
                                }
                              }}
                              rows={4}
                              placeholder="Block content (JSON or text)"
                              disabled={isLoading}
                            />
                          </CardContent>
                        </Card>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formField.onChange([...blocksValue, { blockType: 'default', content: '' }])}
                        disabled={isLoading}
                      >
                        Add Block
                      </Button>
                    </div>
                  </FormControl>
                  {field.admin?.description && (
                    <FormDescription>{field.admin.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );

      default:
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {getFieldIcon(field.type)}
                  {field.label || field.name}
                  {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    {...fieldProps}
                    type={field.type === 'email' ? 'email' : 'text'}
                    value={formField.value as string || ''}
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
  }

  if (!schema) {
    return <div>Loading form...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        <div className="space-y-6">
          {Object.entries(groupedFields).map(([category, categoryFields]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryFields.map(renderField)}
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default DynamicForm;
