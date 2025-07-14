'use client';

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

interface DateFieldProps {
  field: FieldConfig;
  control: Control<any>;
  isLoading?: boolean;
  showValidation?: boolean;
}

export function DateField({ field, control, isLoading = false, showValidation = true }: DateFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  const pickerAppearance = field.admin?.date?.pickerAppearance || 'dayAndTime';
  const displayFormat = field.admin?.date?.displayFormat || 'PPP';
  const timeFormat = field.admin?.date?.timeFormat || '24h';

  const showDatePicker = pickerAppearance === 'dayOnly' || pickerAppearance === 'dayAndTime';
  const showTimePicker = pickerAppearance === 'timeOnly' || pickerAppearance === 'dayAndTime';

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => {
        const selectedDate = formField.value ? new Date(formField.value) : undefined;

        const handleDateSelect = (date: Date | undefined) => {
          if (date) {
            // If we have a time component, preserve it
            if (selectedDate && showTimePicker) {
              date.setHours(selectedDate.getHours());
              date.setMinutes(selectedDate.getMinutes());
            }
            formField.onChange(date.toISOString());
          } else {
            formField.onChange(undefined);
          }
          if (pickerAppearance === 'dayOnly') {
            setIsOpen(false);
          }
        };

        const handleTimeChange = (time: string) => {
          const [hours, minutes] = time.split(':').map(Number);
          const newDate = selectedDate ? new Date(selectedDate) : new Date();
          newDate.setHours(hours);
          newDate.setMinutes(minutes);
          formField.onChange(newDate.toISOString());
        };

        const formatDisplayValue = (date: Date | undefined): string => {
          if (!date) return '';
          
          try {
            switch (pickerAppearance) {
              case 'dayOnly':
                return format(date, 'PP');
              case 'timeOnly':
                return format(date, timeFormat === '12h' ? 'p' : 'HH:mm');
              case 'dayAndTime':
                return format(date, displayFormat);
              case 'monthOnly':
                return format(date, 'MMMM yyyy');
              default:
                return format(date, displayFormat);
            }
          } catch {
            return formField.value;
          }
        };

        return (
          <FormItem className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {field.label || field.name}
              {field.required && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  Required
                </Badge>
              )}
              <Badge variant="outline" className="text-xs px-1 py-0">
                {pickerAppearance}
              </Badge>
            </FormLabel>

            <div className="flex gap-2">
              {/* Date picker */}
              {showDatePicker && (
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`justify-start text-left font-normal ${
                          !selectedDate && 'text-muted-foreground'
                        } ${fieldState.error ? 'border-destructive' : ''}`}
                        disabled={isLoading || field.admin?.readOnly}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate ? formatDisplayValue(selectedDate) : (
                          field.admin?.placeholder || `Pick ${field.label || field.name}`
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) =>
                        date < new Date("1900-01-01") || date > new Date("2100-01-01")
                      }
                      initialFocus
                    />
                    
                    {/* Time picker within calendar */}
                    {showTimePicker && pickerAppearance === 'dayAndTime' && (
                      <div className="p-3 border-t">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <Input
                            type="time"
                            value={selectedDate ? format(selectedDate, 'HH:mm') : ''}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            className="w-auto"
                            step="60"
                          />
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              )}

              {/* Standalone time picker */}
              {showTimePicker && pickerAppearance === 'timeOnly' && (
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={selectedDate ? format(selectedDate, 'HH:mm') : ''}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      disabled={isLoading || field.admin?.readOnly}
                      className={fieldState.error ? 'border-destructive' : ''}
                      step="60"
                    />
                  </div>
                </FormControl>
              )}

              {/* Month picker */}
              {pickerAppearance === 'monthOnly' && (
                <FormControl>
                  <Input
                    type="month"
                    value={selectedDate ? format(selectedDate, 'yyyy-MM') : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        const date = new Date(e.target.value + '-01');
                        formField.onChange(date.toISOString());
                      } else {
                        formField.onChange(undefined);
                      }
                    }}
                    disabled={isLoading || field.admin?.readOnly}
                    className={fieldState.error ? 'border-destructive' : ''}
                  />
                </FormControl>
              )}
            </div>

            {/* Field description */}
            {field.admin?.description && (
              <FormDescription className="text-sm">
                {field.admin.description}
              </FormDescription>
            )}

            {/* Format info */}
            {showValidation && (
              <FormDescription className="text-xs">
                Format: {displayFormat} {showTimePicker && `(${timeFormat} time)`}
              </FormDescription>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}