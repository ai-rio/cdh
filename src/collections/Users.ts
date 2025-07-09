import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: false, // Disable email verification for now (can be enabled later)
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
    useAPIKey: false,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
  access: {
    create: () => true, // Allow public registration
    read: ({ req: { user } }) => {
      // Users can read their own profile, admins can read all
      if (user?.role === 'admin') return true;
      return user ? { id: { equals: user.id } } : false;
    },
    update: ({ req: { user } }) => {
      // Users can update their own profile, admins can update all
      if (user?.role === 'admin') return true;
      return user ? { id: { equals: user.id } } : false;
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete users
      return user?.role === 'admin';
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Creator', value: 'creator' },
        { label: 'Brand', value: 'brand' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'creator',
      required: true,
    },
    {
      name: 'profile',
      type: 'group',
      fields: [
        {
          name: 'bio',
          type: 'textarea',
          maxLength: 500,
        },
        {
          name: 'website',
          type: 'text',
          validate: (val) => {
            if (val && !/^https?:\/\/.+/.test(val)) {
              return 'Please enter a valid URL starting with http:// or https://';
            }
            return true;
          },
        },
        {
          name: 'socialMedia',
          type: 'group',
          fields: [
            {
              name: 'twitter',
              type: 'text',
            },
            {
              name: 'instagram',
              type: 'text',
            },
            {
              name: 'youtube',
              type: 'text',
            },
            {
              name: 'tiktok',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'emailNotifications',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'marketingEmails',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    // Email and password fields are automatically added by Payload
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Ensure email is lowercase
        if (data.email) {
          data.email = data.email.toLowerCase().trim();
        }
        
        // Ensure name is properly formatted
        if (data.name) {
          data.name = data.name.trim();
        }
        
        return data;
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Log user creation for analytics
        if (operation === 'create') {
          console.log(`New user registered: ${doc.email} (${doc.role})`);
        }
      },
    ],
  },
  timestamps: true,
}
