'use client';

import { useState, useRef, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Link,
  Quote,
  Code,
  Eye,
  Edit3
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { FieldConfig } from '@/types';
import type { Control } from 'react-hook-form';

interface RichTextFieldProps {
  field: FieldConfig;
  control: Control<any>;
  isLoading?: boolean;
  showValidation?: boolean;
}

export function RichTextField({ field, control, isLoading = false, showValidation = true }: RichTextFieldProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [selectedText, setSelectedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = textareaRef.current.value.substring(start, end);
      setSelectedText(text);
    }
  };

  const insertMarkdown = (before: string, after: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    
    // Update the field value
    const event = { target: { value: newText } };
    textarea.value = newText;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    // Set cursor position
    setTimeout(() => {
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  const formatActions = [
    {
      icon: Bold,
      label: 'Bold',
      action: () => insertMarkdown('**', '**'),
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => insertMarkdown('*', '*'),
      shortcut: 'Ctrl+I'
    },
    {
      icon: Underline,
      label: 'Underline',
      action: () => insertMarkdown('<u>', '</u>'),
      shortcut: 'Ctrl+U'
    },
    {
      icon: Code,
      label: 'Code',
      action: () => insertMarkdown('`', '`'),
      shortcut: 'Ctrl+`'
    },
    {
      icon: List,
      label: 'Bullet List',
      action: () => insertMarkdown('\n- ', ''),
      shortcut: 'Ctrl+L'
    },
    {
      icon: ListOrdered,
      label: 'Numbered List',
      action: () => insertMarkdown('\n1. ', ''),
      shortcut: 'Ctrl+Shift+L'
    },
    {
      icon: Quote,
      label: 'Quote',
      action: () => insertMarkdown('\n> ', ''),
      shortcut: 'Ctrl+Q'
    },
    {
      icon: Link,
      label: 'Link',
      action: () => insertMarkdown('[', '](url)'),
      shortcut: 'Ctrl+K'
    }
  ];

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (markdown: string): string => {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li>$1. $2</li>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br>');
  };

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => (
        <FormItem className="space-y-2">
          <FormLabel className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            {field.label || field.name}
            {field.required && (
              <Badge variant="destructive" className="text-xs px-1 py-0">
                Required
              </Badge>
            )}
            <Badge variant="outline" className="text-xs px-1 py-0">
              Rich Text
            </Badge>
          </FormLabel>

          <div className="border rounded-lg overflow-hidden">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
              {/* Toolbar */}
              <div className="border-b bg-muted/30 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {formatActions.map((action, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={action.action}
                        disabled={isLoading || field.admin?.readOnly}
                        title={`${action.label} (${action.shortcut})`}
                      >
                        <action.icon className="h-3 w-3" />
                      </Button>
                    ))}
                  </div>
                  
                  <TabsList className="grid w-[200px] grid-cols-2">
                    <TabsTrigger value="edit" className="flex items-center gap-1">
                      <Edit3 className="h-3 w-3" />
                      Edit
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="edit" className="m-0">
                <FormControl>
                  <Textarea
                    ref={textareaRef}
                    {...formField}
                    placeholder={field.admin?.placeholder || `Enter ${field.label || field.name} content...`}
                    disabled={isLoading || field.admin?.readOnly}
                    rows={12}
                    className={`border-0 rounded-none resize-none focus-visible:ring-0 ${
                      fieldState.error ? 'border-destructive' : ''
                    }`}
                    value={formField.value || ''}
                    onSelect={handleTextSelection}
                    onKeyDown={(e) => {
                      // Handle keyboard shortcuts
                      if (e.ctrlKey || e.metaKey) {
                        switch (e.key) {
                          case 'b':
                            e.preventDefault();
                            insertMarkdown('**', '**');
                            break;
                          case 'i':
                            e.preventDefault();
                            insertMarkdown('*', '*');
                            break;
                          case 'k':
                            e.preventDefault();
                            insertMarkdown('[', '](url)');
                            break;
                          case '`':
                            e.preventDefault();
                            insertMarkdown('`', '`');
                            break;
                        }
                      }
                    }}
                  />
                </FormControl>
              </TabsContent>

              <TabsContent value="preview" className="m-0">
                <div 
                  className="p-4 min-h-[300px] prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: markdownToHtml(formField.value || 'Nothing to preview...') 
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Field description */}
          {field.admin?.description && (
            <FormDescription className="text-sm">
              {field.admin.description}
            </FormDescription>
          )}

          {/* Markdown help */}
          {showValidation && (
            <FormDescription className="text-xs">
              Supports Markdown formatting. Use the toolbar buttons or keyboard shortcuts.
            </FormDescription>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}