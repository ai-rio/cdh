// Export all field components for easy importing
export { TextField } from './text-field';
export { TextareaField } from './textarea-field';
export { EmailField } from './email-field';
export { NumberField } from './number-field';
export { DateField } from './date-field';
export { CheckboxField } from './checkbox-field';
export { SelectField } from './select-field';
export { RelationshipField } from './relationship-field';
export { ArrayField } from './array-field';
export { RichTextField } from './rich-text-field';

// Import placeholder components
export { 
  RadioField,
  UploadField,
  BlocksField,
  GroupField,
  TabsField,
  CollapsibleField,
  JsonField,
  CodeField,
  PointField
} from './placeholder-fields';

// Field type mapping
export const FIELD_COMPONENTS = {
  text: 'TextField',
  textarea: 'TextareaField',
  email: 'EmailField',
  number: 'NumberField',
  date: 'DateField',
  checkbox: 'CheckboxField',
  select: 'SelectField',
  radio: 'RadioField',
  upload: 'UploadField',
  relationship: 'RelationshipField',
  array: 'ArrayField',
  blocks: 'BlocksField',
  group: 'GroupField',
  tabs: 'TabsField',
  collapsible: 'CollapsibleField',
  json: 'JsonField',
  code: 'CodeField',
  point: 'PointField',
  richText: 'RichTextField',
  row: 'GroupField', // Use group field for row layout
  ui: 'GroupField', // Use group field for UI components
} as const;

export type FieldComponentType = keyof typeof FIELD_COMPONENTS;