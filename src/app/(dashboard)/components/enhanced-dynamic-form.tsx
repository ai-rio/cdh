'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Settings, 
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import {
  Form,
  FormDescription,
} from "@/components/ui/form";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useCollaboration } from '@/app/(dashboard)/hooks/use-collaboration';
import { validateFieldConfig } from '@/lib/field-type-registry';

// Import all field components
import {
  TextField,
  TextareaField,
  EmailField,
  NumberField,
  DateField,
  CheckboxField,
  SelectField,
  RadioField,
  UploadField,
  RelationshipField,
  ArrayField,
  BlocksField,
  GroupField,
  TabsField,
  CollapsibleField,
  JsonField,
  CodeField,
  PointField,
  RichTextField
} from './form-fields';

import type { FieldConfig, DocumentChange } from '@/types';

interface EnhancedDynamicFormProps {
  fields: FieldConfig[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  onAutoSave?: (data: Record<string, any>) => Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  className?: string;
  collection?: string;
  documentId?: string;
  enableCollaboration?: boolean;
  enableAutoSave?: boolean;
  autoSaveInterval?: number; // in milliseconds
  showValidation?: boolean;
  showPreview?: boolean;
}

// Field component mapping
const FIELD_COMPONENTS = {
  text: TextField,
  textarea: TextareaField,
  email: EmailField,
  number: NumberField,
  date: DateField,
  checkbox: CheckboxField,
  select: SelectField,
  radio: RadioField,
  upload: UploadField,
  relationship: RelationshipField,
  array: ArrayField,
  blocks: BlocksField,
  group: GroupField,
  tabs: TabsField,
  collapsible: CollapsibleField,
  json: JsonField,
  code: CodeField,
  point: PointField,
  richText: RichTextField,
  row: GroupField, // Use group for row layout
  ui: GroupField, // Use group for UI components
} as const;

// Generate Zod schema from Payload fields
function generateZodSchema(fields: FieldConfig[]) {
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
      case 'radio':
        if (field.options && field.options.length > 0) {
          const values = field.options.map(opt => String(opt.value));
          if (field.hasMany) {
            fieldSchema = z.array(z.enum(values as [string, ...string[]]));
          } else {
            fieldSchema = z.enum(values as [string, ...string[]]);
          }
        } else {
          fieldSchema = field.hasMany ? z.array(z.string()) : z.string();
        }
        break;

      case 'date':
        fieldSchema = z.string().or(z.date());
        break;

      case 'relationship':
        if (field.hasMany) {
          fieldSchema = z.array(z.any());
        } else {
          fieldSchema = z.any();
        }
        break;

      case 'array':
        fieldSchema = z.array(z.any());
        if (field.minRows) fieldSchema = fieldSchema.min(field.minRows);
        if (field.maxRows) fieldSchema = fieldSchema.max(field.maxRows);
        break;

      case 'upload':
      case 'json':
      case 'code':
      case 'richText':
      case 'blocks':
      case 'group':
      case 'point':
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

// Group fields by category or tabs
function organizeFields(fields: FieldConfig[]) {
  const groups: Record<string, FieldConfig[]> = {};
  
  // Check if we have tab fields
  const tabField = fields.find(field => field.type === 'tabs');
  if (tabField && tabField.tabs) {
    // Organize by tabs
    tabField.tabs.forEach(tab => {
      groups[tab.label] = tab.fields || [];
    });
    
    // Add remaining fields to "General" tab
    const tabFieldNames = new Set(
      tabField.tabs.flatMap(tab => tab.fields?.map(f => f.name) || [])
    );
    const remainingFields = fields.filter(field => 
      field.type !== 'tabs' && !tabFieldNames.has(field.name)
    );
    
    if (remainingFields.length > 0) {
      groups['General'] = remainingFields;
    }
  } else {
    // Default grouping by field category
    fields.forEach(field => {
      if (field.admin?.hidden) return;
      
      const category = getFieldCategory(field);
      if (!groups[category]) groups[category] = [];
      groups[category].push(field);
    });
  }

  return groups;
}

function getFieldCategory(field: FieldConfig): string {
  const adminGroup = field.admin?.group;
  if (adminGroup) return adminGroup;

  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'email':
    case 'richText':
      return 'Content';
    case 'number':
    case 'date':
      return 'Data';
    case 'checkbox':
    case 'select':
    case 'radio':
      return 'Options';
    case 'upload':
      return 'Media';
    case 'relationship':
      return 'Relations';
    case 'array':
    case 'blocks':
    case 'group':
      return 'Complex';
    case 'json':
    case 'code':
    case 'point':
      return 'Advanced';
    default:
      return 'Other';
  }
}

export function EnhancedDynamicForm({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  onAutoSave,
  submitLabel = 'Save',
  isLoading = false,
  className,
  collection,
  documentId,
  enableCollaboration = false,
  enableAutoSave = false,
  autoSaveInterval = 30000, // 30 seconds
  showValidation = true,
  showPreview = false
}: EnhancedDynamicFormProps) {
  const [schema, setSchema] = useState<z.ZodObject<any>>();
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreviewMode, setShowPreviewMode] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Collaboration hook
  const collaboration = useCollaboration({
    enableRealTime: enableCollaboration,
    enablePresence: enableCollaboration,
    enableLocking: enableCollaboration && !!documentId
  });

  // Generate form schema
  useEffect(() => {
    const generatedSchema = generateZodSchema(fields);
    setSchema(generatedSchema);
  }, [fields]);

  // Validate field configurations
  useEffect(() => {
    const errors: Record<string, string[]> = {};
    fields.forEach(field => {
      const validation = validateFieldConfig(field);
      if (!validation.valid) {
        errors[field.name] = validation.errors.map(e => e.message);
      }
    });
    setFieldErrors(errors);
  }, [fields]);

  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: initialData,
  });

  // Watch for changes
  const watchedValues = form.watch();
  
  useEffect(() => {
    const hasChanges = JSON.stringify(watchedValues) !== JSON.stringify(initialData);
    setHasUnsavedChanges(hasChanges);
  }, [watchedValues, initialData]);

  // Auto-save functionality
  useEffect(() => {
    if (!enableAutoSave || !onAutoSave || !hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(async () => {
      try {
        setIsAutoSaving(true);
        await onAutoSave(form.getValues());
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsAutoSaving(false);
      }
    }, autoSaveInterval);

    return () => clearTimeout(autoSaveTimer);
  }, [enableAutoSave, onAutoSave, hasUnsavedChanges, autoSaveInterval, form]);

  // Collaboration: Subscribe to changes
  useEffect(() => {
    if (!enableCollaboration || !collection) return;

    const subscription = collaboration.subscribeToChanges(collection, (change: DocumentChange) => {
      if (change.documentId === documentId && change.userId !== collaboration.activeUsers[0]?.user?.id) {
        // Handle remote changes
        console.log('Remote change received:', change);
        // In a real implementation, you'd update the form values carefully
      }
    });

    return () => subscription.unsubscribe();
  }, [enableCollaboration, collection, documentId, collaboration]);

  // Handle form submission
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      await onSubmit(data);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      form.reset(data); // Reset with new data as baseline
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Render field based on type
  const renderField = useCallback((field: FieldConfig, index?: number) => {
    const FieldComponent = FIELD_COMPONENTS[field.type as keyof typeof FIELD_COMPONENTS];
    
    if (!FieldComponent) {
      return (
        <div key={field.name} className="p-4 border border-dashed rounded-lg">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm">Unsupported field type: <code>{field.type}</code></p>
            <p className="text-xs">Field: {field.name}</p>
          </div>
        </div>
      );
    }

    // Show field errors from validation
    const hasFieldErrors = fieldErrors[field.name]?.length > 0;

    return (
      <div key={field.name} className="space-y-2">
        {hasFieldErrors && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Field Configuration Error</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside text-sm">
                {fieldErrors[field.name].map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <FieldComponent
          field={field}
          control={form.control}
          isLoading={isLoading}
          showValidation={showValidation}
          renderField={field.type === 'array' ? renderField : undefined}
        />
      </div>
    );
  }, [form.control, isLoading, showValidation, fieldErrors]);

  // Organize fields
  const groupedFields = organizeFields(fields);
  const hasMultipleGroups = Object.keys(groupedFields).length > 1;

  if (!schema) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading form...
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        {/* Header with status and actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {collection ? `Edit ${collection}` : 'Form'}
            </h2>
            
            {/* Status indicators */}
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-amber-600">
                  Unsaved changes
                </Badge>
              )}
              
              {isAutoSaving && (
                <Badge variant="outline" className="text-blue-600">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Auto-saving...
                </Badge>
              )}
              
              {lastSaved && !hasUnsavedChanges && (
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Saved {lastSaved.toLocaleTimeString()}
                </Badge>
              )}
              
              {enableCollaboration && collaboration.activeUsers.length > 1 && (
                <Badge variant="outline" className="text-purple-600">
                  {collaboration.activeUsers.length} collaborators
                </Badge>
              )}
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            {showPreview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreviewMode(!showPreviewMode)}
              >
                {showPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreviewMode ? 'Edit' : 'Preview'}
              </Button>
            )}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => form.reset()}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Form content */}
        {showPreviewMode ? (
          // Preview mode
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Form Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(form.getValues(), null, 2)}
              </pre>
            </CardContent>
          </Card>
        ) : hasMultipleGroups ? (
          // Tabbed interface for multiple groups
          <Tabs defaultValue={Object.keys(groupedFields)[0]} className="space-y-6">
            <TabsList className="grid w-full grid-cols-auto">
              {Object.keys(groupedFields).map((groupName) => (
                <TabsTrigger key={groupName} value={groupName}>
                  {groupName}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {groupedFields[groupName].length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(groupedFields).map(([groupName, groupFields]) => (
              <TabsContent key={groupName} value={groupName}>
                <Card>
                  <CardHeader>
                    <CardTitle>{groupName}</CardTitle>
                    {groupName !== 'General' && (
                      <FormDescription>
                        Configure {groupName.toLowerCase()} settings
                      </FormDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {groupFields.map(renderField)}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          // Single group interface
          <div className="space-y-6">
            {Object.entries(groupedFields).map(([groupName, groupFields]) => (
              <Card key={groupName}>
                <CardHeader>
                  <CardTitle>{groupName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {groupFields.map(renderField)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Separator className="my-6" />

        {/* Form actions */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {enableAutoSave && onAutoSave && (
              <span>Auto-save enabled ({autoSaveInterval / 1000}s)</span>
            )}
          </div>
          
          <div className="flex gap-2">
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
            
            <Button 
              type="submit" 
              disabled={isLoading || isAutoSaving}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {submitLabel}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default EnhancedDynamicForm;