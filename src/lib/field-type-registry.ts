import type { FieldConfig, ValidationRule } from '@/types';

export interface FieldTypeConfig {
  type: string;
  label: string;
  description: string;
  category: 'data' | 'presentational' | 'virtual';
  icon: string;
  defaultConfig: Partial<FieldConfig>;
  requiredProps: string[];
  optionalProps: string[];
  validationRules: ValidationRule[];
  supportedDatabases: string[];
  examples: FieldExample[];
}

interface FieldExample {
  name: string;
  description: string;
  config: FieldConfig;
}

// Complete registry of all Payload field types
export const FIELD_TYPE_REGISTRY: Record<string, FieldTypeConfig> = {
  // Data Fields
  text: {
    type: 'text',
    label: 'Text',
    description: 'Simple text input for short strings',
    category: 'data',
    icon: 'Type',
    defaultConfig: {
      type: 'text',
      name: '',
      label: '',
      required: false,
      unique: false,
      index: false,
      minLength: undefined,
      maxLength: undefined,
      hasMany: false
    },
    requiredProps: ['name', 'type'],
    optionalProps: [
      'label', 'required', 'unique', 'index', 'minLength', 'maxLength',
      'validate', 'saveToJWT', 'hooks', 'access', 'hidden', 'defaultValue',
      'localized', 'admin', 'custom', 'hasMany', 'minRows', 'maxRows'
    ],
    validationRules: [
      { field: 'minLength', type: 'number', min: 0 },
      { field: 'maxLength', type: 'number', min: 1 }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Basic Title Field',
        description: 'Simple title field with validation',
        config: {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          minLength: 3,
          maxLength: 100
        }
      }
    ]
  },

  textarea: {
    type: 'textarea',
    label: 'Textarea',
    description: 'Multi-line text input for longer content',
    category: 'data',
    icon: 'AlignLeft',
    defaultConfig: {
      type: 'textarea',
      name: '',
      label: '',
      required: false,
      minLength: undefined,
      maxLength: undefined,
      admin: {
        rows: 4
      }
    },
    requiredProps: ['name', 'type'],
    optionalProps: [
      'label', 'required', 'minLength', 'maxLength', 'validate',
      'index', 'saveToJWT', 'hooks', 'access', 'hidden', 'defaultValue',
      'localized', 'admin', 'custom'
    ],
    validationRules: [
      { field: 'minLength', type: 'number', min: 0 },
      { field: 'maxLength', type: 'number', min: 1 }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Description Field',
        description: 'Multi-line description with character limit',
        config: {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          maxLength: 500,
          admin: {
            rows: 6,
            placeholder: 'Enter a detailed description...'
          }
        }
      }
    ]
  },

  email: {
    type: 'email',
    label: 'Email',
    description: 'Email input with validation',
    category: 'data',
    icon: 'Mail',
    defaultConfig: {
      type: 'email',
      name: '',
      label: '',
      required: false,
      unique: false,
      index: false
    },
    requiredProps: ['name', 'type'],
    optionalProps: [
      'label', 'required', 'unique', 'index', 'validate', 'saveToJWT',
      'hooks', 'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom'
    ],
    validationRules: [
      { field: 'format', type: 'email' }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Contact Email',
        description: 'Required email field with unique constraint',
        config: {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          required: true,
          unique: true,
          index: true
        }
      }
    ]
  },

  number: {
    type: 'number',
    label: 'Number',
    description: 'Numeric input with validation',
    category: 'data',
    icon: 'Hash',
    defaultConfig: {
      type: 'number',
      name: '',
      label: '',
      required: false,
      min: undefined,
      max: undefined,
      hasMany: false
    },
    requiredProps: ['name', 'type'],
    optionalProps: [
      'label', 'required', 'min', 'max', 'validate', 'unique', 'index',
      'saveToJWT', 'hooks', 'access', 'hidden', 'defaultValue', 'localized',
      'admin', 'custom', 'hasMany', 'minRows', 'maxRows'
    ],
    validationRules: [
      { field: 'min', type: 'number' },
      { field: 'max', type: 'number' }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Price Field',
        description: 'Price field with min/max validation',
        config: {
          name: 'price',
          type: 'number',
          label: 'Price',
          required: true,
          min: 0,
          max: 999999.99
        }
      }
    ]
  },

  date: {
    type: 'date',
    label: 'Date',
    description: 'Date picker input',
    category: 'data',
    icon: 'Calendar',
    defaultConfig: {
      type: 'date',
      name: '',
      label: '',
      required: false,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'd MMM yyy h:mm a'
        }
      }
    },
    requiredProps: ['name', 'type'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom'
    ],
    validationRules: [
      { field: 'format', type: 'date' }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Event Date',
        description: 'Date field for event scheduling',
        config: {
          name: 'eventDate',
          type: 'date',
          label: 'Event Date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'MMM d, yyyy h:mm a'
            }
          }
        }
      }
    ]
  },

  checkbox: {
    type: 'checkbox',
    label: 'Checkbox',
    description: 'Boolean checkbox input',
    category: 'data',
    icon: 'Check',
    defaultConfig: {
      type: 'checkbox',
      name: '',
      label: '',
      required: false,
      defaultValue: false
    },
    requiredProps: ['name', 'type'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom'
    ],
    validationRules: [
      { field: 'defaultValue', type: 'boolean' }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Featured Toggle',
        description: 'Boolean field to mark items as featured',
        config: {
          name: 'featured',
          type: 'checkbox',
          label: 'Featured Item',
          defaultValue: false,
          admin: {
            position: 'sidebar'
          }
        }
      }
    ]
  },

  select: {
    type: 'select',
    label: 'Select',
    description: 'Dropdown selection field',
    category: 'data',
    icon: 'ChevronDown',
    defaultConfig: {
      type: 'select',
      name: '',
      label: '',
      required: false,
      options: [],
      hasMany: false
    },
    requiredProps: ['name', 'type', 'options'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom',
      'hasMany'
    ],
    validationRules: [
      { field: 'options', type: 'array', min: 1 }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Status Field',
        description: 'Status selection with predefined options',
        config: {
          name: 'status',
          type: 'select',
          label: 'Status',
          required: true,
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' }
          ]
        }
      }
    ]
  },

  radio: {
    type: 'radio',
    label: 'Radio',
    description: 'Radio button selection field',
    category: 'data',
    icon: 'Circle',
    defaultConfig: {
      type: 'radio',
      name: '',
      label: '',
      required: false,
      options: []
    },
    requiredProps: ['name', 'type', 'options'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom'
    ],
    validationRules: [
      { field: 'options', type: 'array', min: 1 }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Priority Field',
        description: 'Priority selection with radio buttons',
        config: {
          name: 'priority',
          type: 'radio',
          label: 'Priority',
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' }
          ]
        }
      }
    ]
  },

  upload: {
    type: 'upload',
    label: 'Upload',
    description: 'File upload field',
    category: 'data',
    icon: 'Upload',
    defaultConfig: {
      type: 'upload',
      name: '',
      label: '',
      required: false,
      relationTo: 'media'
    },
    requiredProps: ['name', 'type', 'relationTo'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom',
      'filterOptions'
    ],
    validationRules: [
      { field: 'relationTo', type: 'string' }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Featured Image',
        description: 'Upload field for featured image',
        config: {
          name: 'featuredImage',
          type: 'upload',
          label: 'Featured Image',
          relationTo: 'media',
          admin: {
            description: 'Upload a featured image for this post'
          }
        }
      }
    ]
  },

  relationship: {
    type: 'relationship',
    label: 'Relationship',
    description: 'Relationship to other collections',
    category: 'data',
    icon: 'Link',
    defaultConfig: {
      type: 'relationship',
      name: '',
      label: '',
      required: false,
      relationTo: '',
      hasMany: false
    },
    requiredProps: ['name', 'type', 'relationTo'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom',
      'hasMany', 'filterOptions', 'maxDepth'
    ],
    validationRules: [
      { field: 'relationTo', type: 'string' }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Author Relationship',
        description: 'Relationship to users collection',
        config: {
          name: 'author',
          type: 'relationship',
          label: 'Author',
          relationTo: 'users',
          required: true
        }
      }
    ]
  },

  richText: {
    type: 'richText',
    label: 'Rich Text',
    description: 'Rich text editor field',
    category: 'data',
    icon: 'FileText',
    defaultConfig: {
      type: 'richText',
      name: '',
      label: '',
      required: false
    },
    requiredProps: ['name', 'type'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom'
    ],
    validationRules: [],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Content Field',
        description: 'Rich text content editor',
        config: {
          name: 'content',
          type: 'richText',
          label: 'Content',
          required: true,
          admin: {
            description: 'Main content for the post'
          }
        }
      }
    ]
  },

  array: {
    type: 'array',
    label: 'Array',
    description: 'Array of repeatable fields',
    category: 'data',
    icon: 'List',
    defaultConfig: {
      type: 'array',
      name: '',
      label: '',
      required: false,
      fields: [],
      minRows: undefined,
      maxRows: undefined
    },
    requiredProps: ['name', 'type', 'fields'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom',
      'minRows', 'maxRows'
    ],
    validationRules: [
      { field: 'fields', type: 'array', min: 1 },
      { field: 'minRows', type: 'number', min: 0 },
      { field: 'maxRows', type: 'number', min: 1 }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Gallery Images',
        description: 'Array of image uploads',
        config: {
          name: 'gallery',
          type: 'array',
          label: 'Gallery',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true
            },
            {
              name: 'caption',
              type: 'text',
              label: 'Caption'
            }
          ]
        }
      }
    ]
  },

  blocks: {
    type: 'blocks',
    label: 'Blocks',
    description: 'Flexible content blocks',
    category: 'data',
    icon: 'Layers',
    defaultConfig: {
      type: 'blocks',
      name: '',
      label: '',
      required: false,
      blocks: [],
      minRows: undefined,
      maxRows: undefined
    },
    requiredProps: ['name', 'type', 'blocks'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom',
      'minRows', 'maxRows'
    ],
    validationRules: [
      { field: 'blocks', type: 'array', min: 1 },
      { field: 'minRows', type: 'number', min: 0 },
      { field: 'maxRows', type: 'number', min: 1 }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Page Builder',
        description: 'Flexible page content blocks',
        config: {
          name: 'content',
          type: 'blocks',
          label: 'Page Content',
          blocks: [
            {
              slug: 'textBlock',
              fields: [
                {
                  name: 'text',
                  type: 'richText',
                  required: true
                }
              ]
            },
            {
              slug: 'imageBlock',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true
                }
              ]
            }
          ]
        }
      }
    ]
  },

  group: {
    type: 'group',
    label: 'Group',
    description: 'Group of related fields',
    category: 'data',
    icon: 'Folder',
    defaultConfig: {
      type: 'group',
      name: '',
      label: '',
      required: false,
      fields: []
    },
    requiredProps: ['name', 'type', 'fields'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom'
    ],
    validationRules: [
      { field: 'fields', type: 'array', min: 1 }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Address Group',
        description: 'Grouped address fields',
        config: {
          name: 'address',
          type: 'group',
          label: 'Address',
          fields: [
            {
              name: 'street',
              type: 'text',
              label: 'Street',
              required: true
            },
            {
              name: 'city',
              type: 'text',
              label: 'City',
              required: true
            },
            {
              name: 'postalCode',
              type: 'text',
              label: 'Postal Code'
            }
          ]
        }
      }
    ]
  },

  tabs: {
    type: 'tabs',
    label: 'Tabs',
    description: 'Tabbed field organization',
    category: 'presentational',
    icon: 'Tabs',
    defaultConfig: {
      type: 'tabs',
      tabs: []
    },
    requiredProps: ['type', 'tabs'],
    optionalProps: [
      'admin', 'custom'
    ],
    validationRules: [
      { field: 'tabs', type: 'array', min: 1 }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Content Tabs',
        description: 'Organize content in tabs',
        config: {
          type: 'tabs',
          tabs: [
            {
              label: 'Content',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true
                },
                {
                  name: 'content',
                  type: 'richText'
                }
              ]
            },
            {
              label: 'SEO',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text'
                },
                {
                  name: 'metaDescription',
                  type: 'textarea'
                }
              ]
            }
          ]
        }
      }
    ]
  },

  collapsible: {
    type: 'collapsible',
    label: 'Collapsible',
    description: 'Collapsible field section',
    category: 'presentational',
    icon: 'ChevronDown',
    defaultConfig: {
      type: 'collapsible',
      label: '',
      fields: [],
      collapsed: false
    },
    requiredProps: ['type', 'fields'],
    optionalProps: [
      'label', 'admin', 'custom', 'collapsed'
    ],
    validationRules: [
      { field: 'fields', type: 'array', min: 1 }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Advanced Settings',
        description: 'Collapsible advanced options',
        config: {
          type: 'collapsible',
          label: 'Advanced Settings',
          collapsed: true,
          fields: [
            {
              name: 'customCSS',
              type: 'textarea',
              label: 'Custom CSS'
            },
            {
              name: 'customJS',
              type: 'textarea',
              label: 'Custom JavaScript'
            }
          ]
        }
      }
    ]
  },

  row: {
    type: 'row',
    label: 'Row',
    description: 'Horizontal field layout',
    category: 'presentational',
    icon: 'Columns',
    defaultConfig: {
      type: 'row',
      fields: []
    },
    requiredProps: ['type', 'fields'],
    optionalProps: [
      'admin', 'custom'
    ],
    validationRules: [
      { field: 'fields', type: 'array', min: 1 }
    ],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Name Row',
        description: 'First and last name in a row',
        config: {
          type: 'row',
          fields: [
            {
              name: 'firstName',
              type: 'text',
              label: 'First Name',
              admin: { width: '50%' }
            },
            {
              name: 'lastName',
              type: 'text',
              label: 'Last Name',
              admin: { width: '50%' }
            }
          ]
        }
      }
    ]
  },

  json: {
    type: 'json',
    label: 'JSON',
    description: 'JSON data field',
    category: 'data',
    icon: 'Code',
    defaultConfig: {
      type: 'json',
      name: '',
      label: '',
      required: false
    },
    requiredProps: ['name', 'type'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom'
    ],
    validationRules: [],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Settings JSON',
        description: 'JSON field for configuration data',
        config: {
          name: 'settings',
          type: 'json',
          label: 'Settings',
          admin: {
            description: 'JSON configuration data'
          }
        }
      }
    ]
  },

  code: {
    type: 'code',
    label: 'Code',
    description: 'Code editor field',
    category: 'data',
    icon: 'Terminal',
    defaultConfig: {
      type: 'code',
      name: '',
      label: '',
      required: false
    },
    requiredProps: ['name', 'type'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom'
    ],
    validationRules: [],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Custom CSS',
        description: 'Code field for CSS',
        config: {
          name: 'customCSS',
          type: 'code',
          label: 'Custom CSS',
          admin: {
            language: 'css'
          }
        }
      }
    ]
  },

  point: {
    type: 'point',
    label: 'Point',
    description: 'Geographic point coordinates',
    category: 'data',
    icon: 'MapPin',
    defaultConfig: {
      type: 'point',
      name: '',
      label: '',
      required: false
    },
    requiredProps: ['name', 'type'],
    optionalProps: [
      'label', 'required', 'validate', 'index', 'saveToJWT', 'hooks',
      'access', 'hidden', 'defaultValue', 'localized', 'admin', 'custom'
    ],
    validationRules: [],
    supportedDatabases: ['mongodb', 'postgres'],
    examples: [
      {
        name: 'Location Point',
        description: 'Geographic coordinates field',
        config: {
          name: 'location',
          type: 'point',
          label: 'Location',
          admin: {
            description: 'Click on the map to set coordinates'
          }
        }
      }
    ]
  },

  ui: {
    type: 'ui',
    label: 'UI',
    description: 'Custom UI component',
    category: 'presentational',
    icon: 'Layout',
    defaultConfig: {
      type: 'ui',
      name: ''
    },
    requiredProps: ['type', 'name'],
    optionalProps: [
      'admin', 'custom'
    ],
    validationRules: [],
    supportedDatabases: ['mongodb', 'postgres', 'sqlite'],
    examples: [
      {
        name: 'Custom Component',
        description: 'Custom React component',
        config: {
          type: 'ui',
          name: 'customComponent',
          admin: {
            components: {
              Field: 'CustomFieldComponent'
            }
          }
        }
      }
    ]
  }
};

// Helper functions
export function getFieldTypeConfig(type: string): FieldTypeConfig | null {
  return FIELD_TYPE_REGISTRY[type] || null;
}

export function getAllFieldTypes(): FieldTypeConfig[] {
  return Object.values(FIELD_TYPE_REGISTRY);
}

export function getFieldTypesByCategory(category: 'data' | 'presentational' | 'virtual'): FieldTypeConfig[] {
  return Object.values(FIELD_TYPE_REGISTRY).filter(config => config.category === category);
}

export function validateFieldConfig(config: FieldConfig): { valid: boolean; errors: string[] } {
  const typeConfig = getFieldTypeConfig(config.type);
  if (!typeConfig) {
    return { valid: false, errors: [`Unknown field type: ${config.type}`] };
  }

  const errors: string[] = [];

  // Check required properties
  for (const prop of typeConfig.requiredProps) {
    if (!(prop in config) || config[prop as keyof FieldConfig] === undefined) {
      errors.push(`Missing required property: ${prop}`);
    }
  }

  // Validate against rules
  for (const rule of typeConfig.validationRules) {
    const value = config[rule.field as keyof FieldConfig];
    if (value !== undefined) {
      switch (rule.type) {
        case 'number':
          if (typeof value !== 'number') {
            errors.push(`${rule.field} must be a number`);
          } else if (rule.min !== undefined && value < rule.min) {
            errors.push(`${rule.field} must be at least ${rule.min}`);
          } else if (rule.max !== undefined && value > rule.max) {
            errors.push(`${rule.field} must be at most ${rule.max}`);
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(`${rule.field} must be a boolean`);
          }
          break;
        case 'email':
          if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(`${rule.field} must be a valid email format`);
          }
          break;
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function getDefaultFieldConfig(type: string): Partial<FieldConfig> | null {
  const typeConfig = getFieldTypeConfig(type);
  return typeConfig ? { ...typeConfig.defaultConfig } : null;
}
