'use client';

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  List, 
  Plus, 
  Trash2, 
  GripVertical,
  ChevronUp,
  ChevronDown
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
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';
import type { FieldConfig } from '@/types';
import type { Control } from 'react-hook-form';

interface ArrayFieldProps {
  field: FieldConfig;
  control: Control<any>;
  isLoading?: boolean;
  showValidation?: boolean;
  renderField?: (field: FieldConfig, index: number, control: Control<any>) => React.ReactNode;
}

export function ArrayField({ 
  field, 
  control, 
  isLoading = false, 
  showValidation = true,
  renderField
}: ArrayFieldProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItemExpansion = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => {
        const values: any[] = formField.value || [];

        const addItem = () => {
          const defaultValue = field.fields?.reduce((acc, subField) => {
            acc[subField.name] = subField.defaultValue || '';
            return acc;
          }, {} as any) || '';
          
          formField.onChange([...values, defaultValue]);
          
          // Expand the newly added item
          setExpandedItems(prev => new Set([...prev, values.length]));
        };

        const removeItem = (index: number) => {
          const newValues = values.filter((_, i) => i !== index);
          formField.onChange(newValues);
          
          // Clean up expanded state
          const newExpanded = new Set(expandedItems);
          newExpanded.delete(index);
          // Adjust indices for items after the removed one
          const adjustedExpanded = new Set<number>();
          newExpanded.forEach(i => {
            if (i < index) {
              adjustedExpanded.add(i);
            } else if (i > index) {
              adjustedExpanded.add(i - 1);
            }
          });
          setExpandedItems(adjustedExpanded);
        };

        const moveItem = (fromIndex: number, toIndex: number) => {
          const newValues = [...values];
          const [removed] = newValues.splice(fromIndex, 1);
          newValues.splice(toIndex, 0, removed);
          formField.onChange(newValues);
        };

        const onDragEnd = (result: DropResult) => {
          if (!result.destination) return;
          moveItem(result.source.index, result.destination.index);
        };

        const updateItem = (index: number, value: any) => {
          const newValues = [...values];
          newValues[index] = value;
          formField.onChange(newValues);
        };

        const canAddMore = !field.maxRows || values.length < field.maxRows;
        const hasMinimum = !field.minRows || values.length >= field.minRows;

        return (
          <FormItem className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <List className="h-4 w-4 text-muted-foreground" />
              {field.label || field.name}
              {field.required && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  Required
                </Badge>
              )}
              <Badge variant="outline" className="text-xs px-1 py-0">
                Array ({values.length})
              </Badge>
            </FormLabel>

            <FormControl>
              <div className="space-y-3">
                {/* Array items */}
                {values.length > 0 && (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={field.name}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {values.map((item, index) => (
                            <Draggable
                              key={`${field.name}-${index}`}
                              draggableId={`${field.name}-${index}`}
                              index={index}
                              isDragDisabled={isLoading || field.admin?.readOnly}
                            >
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`p-3 ${
                                    snapshot.isDragging ? 'shadow-lg' : ''
                                  } ${fieldState.error ? 'border-destructive' : ''}`}
                                >
                                  <div className="flex items-start gap-2">
                                    {/* Drag handle */}
                                    <div
                                      {...provided.dragHandleProps}
                                      className="flex flex-col gap-1 pt-2 cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">
                                            Item {index + 1}
                                          </span>
                                          {field.fields && field.fields.length > 1 && (
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0"
                                              onClick={() => toggleItemExpansion(index)}
                                            >
                                              {expandedItems.has(index) ? (
                                                <ChevronUp className="h-3 w-3" />
                                              ) : (
                                                <ChevronDown className="h-3 w-3" />
                                              )}
                                            </Button>
                                          )}
                                        </div>
                                        
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                          onClick={() => removeItem(index)}
                                          disabled={isLoading || field.admin?.readOnly || !hasMinimum}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>

                                      {/* Field content */}
                                      <div className={`space-y-3 ${
                                        field.fields && field.fields.length > 1 && !expandedItems.has(index) 
                                          ? 'hidden' 
                                          : ''
                                      }`}>
                                        {field.fields ? (
                                          // Multiple fields (object array)
                                          field.fields.map((subField) => (
                                            <div key={subField.name}>
                                              {renderField ? (
                                                renderField(subField, index, control)
                                              ) : (
                                                <div className="text-sm text-muted-foreground">
                                                  Custom field renderer needed for {subField.type}
                                                </div>
                                              )}
                                            </div>
                                          ))
                                        ) : (
                                          // Simple array (primitive values)
                                          <div>
                                            {renderField ? (
                                              renderField(
                                                { 
                                                  name: `${field.name}.${index}`,
                                                  type: 'text',
                                                  label: `Value ${index + 1}`
                                                },
                                                index,
                                                control
                                              )
                                            ) : (
                                              <input
                                                type="text"
                                                value={item || ''}
                                                onChange={(e) => updateItem(index, e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md"
                                                placeholder={`Enter value ${index + 1}`}
                                                disabled={isLoading || field.admin?.readOnly}
                                              />
                                            )}
                                          </div>
                                        )}
                                      </div>

                                      {/* Collapsed preview for complex objects */}
                                      {field.fields && field.fields.length > 1 && !expandedItems.has(index) && (
                                        <div className="text-sm text-muted-foreground truncate">
                                          {Object.entries(item || {})
                                            .filter(([key, value]) => value)
                                            .map(([key, value]) => `${key}: ${value}`)
                                            .join(', ') || 'Empty item'}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}

                {/* Add button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  disabled={isLoading || field.admin?.readOnly || !canAddMore}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add {field.label || field.name} Item
                </Button>

                {/* Empty state */}
                {values.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <List className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No items added yet</p>
                    <p className="text-xs">Click "Add Item" to get started</p>
                  </div>
                )}
              </div>
            </FormControl>

            {/* Field description */}
            {field.admin?.description && (
              <FormDescription className="text-sm">
                {field.admin.description}
              </FormDescription>
            )}

            {/* Array constraints info */}
            {showValidation && (field.minRows || field.maxRows) && (
              <FormDescription className="text-xs">
                {field.minRows && field.maxRows ? (
                  `Must have between ${field.minRows} and ${field.maxRows} items`
                ) : field.minRows ? (
                  `Must have at least ${field.minRows} item${field.minRows > 1 ? 's' : ''}`
                ) : (
                  `Maximum ${field.maxRows} item${field.maxRows > 1 ? 's' : ''}`
                )}
              </FormDescription>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}