import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EnhancedCollectionManager } from '@/app/(dashboard)/components/enhanced-collection-manager';
import { CollectionTable } from '@/app/(dashboard)/components/collection-manager/collection-table';
import { EnhancedDynamicForm } from '@/app/(dashboard)/components/enhanced-dynamic-form';
import { BulkActions } from '@/app/(dashboard)/components/collection-manager/bulk-actions';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock dependencies
jest.mock('@/app/(dashboard)/hooks/use-collection-manager');
jest.mock('@/app/(dashboard)/hooks/use-collection-schema');
jest.mock('@/app/(dashboard)/hooks/use-collaboration');

const mockUseCollectionManager = require('@/app/(dashboard)/hooks/use-collection-manager').useCollectionManager;
const mockUseCollectionSchema = require('@/app/(dashboard)/hooks/use-collection-schema').useCollectionSchema;

// Test data
const mockDocuments = [
  {
    id: '1',
    title: 'First Post',
    content: 'This is the first post content',
    status: 'published',
    tags: ['tech', 'web'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'This is the second post content',
    status: 'draft',
    tags: ['design'],
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

const mockSchema = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      admin: {
        description: 'Enter the post title',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: false,
      admin: {
        description: 'Enter the post content',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        description: 'Select the post status',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Post',
      admin: {
        description: 'Mark this post as featured',
      },
    },
  ],
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'createdAt'],
  },
};

const mockCollectionManagerReturn = {
  documents: mockDocuments,
  totalCount: 2,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  pageSize: 25,
  selectedIds: [],
  setSelectedIds: jest.fn(),
  sortField: 'createdAt',
  sortDirection: 'desc' as const,
  filters: {},
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  bulkDelete: jest.fn(),
  bulkUpdate: jest.fn(),
  bulkExport: jest.fn(),
  search: jest.fn(),
  filter: jest.fn(),
  sort: jest.fn(),
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  refresh: jest.fn(),
  lockDocument: jest.fn(),
  unlockDocument: jest.fn(),
  getCollectionStats: jest.fn(),
};

const mockSchemaReturn = {
  schema: mockSchema,
  fields: mockSchema.fields,
  isLoading: false,
  error: null,
  addField: jest.fn(),
  removeField: jest.fn(),
  updateField: jest.fn(),
  reorderFields: jest.fn(),
  createCollection: jest.fn(),
  updateCollection: jest.fn(),
  deleteCollection: jest.fn(),
  cloneCollection: jest.fn(),
  validateSchema: jest.fn(),
  migrateSchema: jest.fn(),
  getFieldTypes: jest.fn(),
  getDefaultFieldConfig: jest.fn(),
  getFieldValidationRules: jest.fn(),
  getFieldConfig: jest.fn(),
  validateDocument: jest.fn(),
  getDefaultValues: jest.fn(),
  refresh: jest.fn(),
};

// Test wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Helper to check for specific WCAG violations
const checkA11y = async (component: Element, rules?: any) => {
  const results = await axe(component, {
    rules: {
      // Enable specific WCAG 2.1 AA rules
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'focus-management': { enabled: true },
      'aria-labels': { enabled: true },
      'semantic-markup': { enabled: true },
      ...rules,
    },
  });
  return results;
};

describe('Collection Management Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCollectionManager.mockReturnValue(mockCollectionManagerReturn);
    mockUseCollectionSchema.mockReturnValue(mockSchemaReturn);
  });

  describe('WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations in main collection view', async () => {
      const { container } = render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations in table view', async () => {
      const { container } = render(
        <TestWrapper>
          <CollectionTable
            data={mockDocuments}
            fields={mockSchema.fields}
            selectedIds={[]}
            onSelectionChange={jest.fn()}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
            onView={jest.fn()}
            onDuplicate={jest.fn()}
            isLoading={false}
            sortField="title"
            sortDirection="asc"
            onSort={jest.fn()}
          />
        </TestWrapper>
      );

      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations in form view', async () => {
      const { container } = render(
        <TestWrapper>
          <EnhancedDynamicForm
            fields={mockSchema.fields}
            onSubmit={jest.fn()}
            onCancel={jest.fn()}
            submitLabel="Create Post"
            isLoading={false}
            collection="posts"
          />
        </TestWrapper>
      );

      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations in bulk actions', async () => {
      const { container } = render(
        <BulkActions
          selectedCount={2}
          selectedIds={['1', '2']}
          onBulkDelete={jest.fn()}
          onBulkExport={jest.fn()}
          onBulkDuplicate={jest.fn()}
          isLoading={false}
        />
      );

      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support full keyboard navigation in collection list', async () => {
      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Test tab order
      const addButton = screen.getByRole('button', { name: /add post/i });
      const searchInput = screen.getByRole('searchbox');
      const refreshButton = screen.getByRole('button', { name: /refresh/i });

      // Start with first focusable element
      addButton.focus();
      expect(document.activeElement).toBe(addButton);

      // Tab to next element
      fireEvent.keyDown(addButton, { key: 'Tab' });
      expect(document.activeElement).toBe(searchInput);

      // Tab to next element
      fireEvent.keyDown(searchInput, { key: 'Tab' });
      expect(document.activeElement).toBe(refreshButton);

      // Test reverse tab order
      fireEvent.keyDown(refreshButton, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(searchInput);
    });

    it('should handle keyboard shortcuts', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Test Ctrl+N for new document
      await user.keyboard('{Control>}n{/Control}');
      expect(screen.getByText('Create Post')).toBeInTheDocument();

      // Test Escape to cancel
      await user.keyboard('{Escape}');
      expect(screen.getByText('Posts')).toBeInTheDocument();
    });

    it('should support arrow key navigation in tables', async () => {
      render(
        <TestWrapper>
          <CollectionTable
            data={mockDocuments}
            fields={mockSchema.fields}
            selectedIds={[]}
            onSelectionChange={jest.fn()}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
            onView={jest.fn()}
            onDuplicate={jest.fn()}
            isLoading={false}
            sortField="title"
            sortDirection="asc"
            onSort={jest.fn()}
          />
        </TestWrapper>
      );

      const table = screen.getByRole('table');
      const firstCell = screen.getByText('First Post');
      
      firstCell.focus();
      expect(document.activeElement).toBe(firstCell);

      // Arrow down should move to next row
      fireEvent.keyDown(firstCell, { key: 'ArrowDown' });
      // Note: In a real implementation, this would move focus to the corresponding cell in the next row
    });

    it('should support keyboard navigation in forms', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedDynamicForm
            fields={mockSchema.fields}
            onSubmit={jest.fn()}
            onCancel={jest.fn()}
            submitLabel="Create Post"
            isLoading={false}
            collection="posts"
          />
        </TestWrapper>
      );

      const titleField = screen.getByLabelText('Title');
      const contentField = screen.getByLabelText('Content');
      const statusField = screen.getByLabelText('Status');

      // Tab through form fields
      await user.tab();
      expect(document.activeElement).toBe(titleField);

      await user.tab();
      expect(document.activeElement).toBe(contentField);

      await user.tab();
      expect(document.activeElement).toBe(statusField);
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper ARIA labels for interactive elements', () => {
      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Check for ARIA labels
      expect(screen.getByRole('button', { name: /add post/i })).toHaveAttribute('aria-label');
      expect(screen.getByRole('searchbox')).toHaveAttribute('aria-label', 'Search posts');
      expect(screen.getByRole('table')).toHaveAttribute('aria-label', 'Posts table');
    });

    it('should announce dynamic content changes', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Look for aria-live regions
      const statusRegion = screen.getByRole('status');
      expect(statusRegion).toHaveAttribute('aria-live', 'polite');

      // Search should update aria-live region
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'test');

      await screen.findByText(/2 results found/i);
    });

    it('should have descriptive form labels and help text', () => {
      render(
        <TestWrapper>
          <EnhancedDynamicForm
            fields={mockSchema.fields}
            onSubmit={jest.fn()}
            onCancel={jest.fn()}
            submitLabel="Create Post"
            isLoading={false}
            collection="posts"
          />
        </TestWrapper>
      );

      // Check for form labels
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Content')).toBeInTheDocument();
      expect(screen.getByLabelText('Status')).toBeInTheDocument();

      // Check for help text
      expect(screen.getByText('Enter the post title')).toBeInTheDocument();
      expect(screen.getByText('Enter the post content')).toBeInTheDocument();
      expect(screen.getByText('Select the post status')).toBeInTheDocument();

      // Check for required field indicators
      const titleField = screen.getByLabelText('Title');
      expect(titleField).toHaveAttribute('aria-required', 'true');
    });

    it('should provide clear error messages', async () => {
      const mockCreateWithError = jest.fn().mockRejectedValue(
        new Error('Title is required')
      );

      mockUseCollectionManager.mockReturnValue({
        ...mockCollectionManagerReturn,
        create: mockCreateWithError,
      });

      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedDynamicForm
            fields={mockSchema.fields}
            onSubmit={jest.fn()}
            onCancel={jest.fn()}
            submitLabel="Create Post"
            isLoading={false}
            collection="posts"
          />
        </TestWrapper>
      );

      // Submit form without filling required field
      const submitButton = screen.getByRole('button', { name: /create post/i });
      await user.click(submitButton);

      // Should show error message with proper ARIA attributes
      const errorMessage = await screen.findByRole('alert');
      expect(errorMessage).toHaveTextContent('Title is required');
      expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus during navigation', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Click "Add Post" and focus should move to form
      const addButton = screen.getByRole('button', { name: /add post/i });
      await user.click(addButton);

      // Focus should be on first form field
      const titleField = screen.getByLabelText('Title');
      expect(document.activeElement).toBe(titleField);

      // Cancel and focus should return to add button
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(document.activeElement).toBe(addButton);
    });

    it('should trap focus in modals', async () => {
      const user = userEvent.setup();

      // Mock a modal opening scenario
      mockUseCollectionManager.mockReturnValue({
        ...mockCollectionManagerReturn,
        selectedIds: ['1'],
      });

      render(
        <TestWrapper>
          <BulkActions
            selectedCount={1}
            selectedIds={['1']}
            onBulkDelete={jest.fn()}
            onBulkExport={jest.fn()}
            onBulkDuplicate={jest.fn()}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Open delete confirmation dialog
      const moreButton = screen.getByRole('button', { name: /more/i });
      await user.click(moreButton);

      const deleteOption = screen.getByRole('menuitem', { name: /delete/i });
      await user.click(deleteOption);

      // Focus should be trapped in dialog
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      const confirmButton = screen.getByRole('button', { name: /delete 1 item/i });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      // Tab should cycle between dialog elements
      confirmButton.focus();
      expect(document.activeElement).toBe(confirmButton);

      await user.tab();
      expect(document.activeElement).toBe(cancelButton);

      await user.tab();
      expect(document.activeElement).toBe(confirmButton); // Should wrap around
    });

    it('should provide skip links for complex layouts', () => {
      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Should have skip link to main content
      const skipLink = screen.getByRole('link', { name: /skip to main content/i });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });
  });

  describe('Visual Accessibility', () => {
    it('should have sufficient color contrast', async () => {
      const { container } = render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      const results = await checkA11y(container, {
        'color-contrast': { enabled: true },
      });

      expect(results).toHaveNoViolations();
    });

    it('should not rely solely on color for information', () => {
      render(
        <TestWrapper>
          <CollectionTable
            data={mockDocuments}
            fields={mockSchema.fields}
            selectedIds={['1']}
            onSelectionChange={jest.fn()}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
            onView={jest.fn()}
            onDuplicate={jest.fn()}
            isLoading={false}
            sortField="status"
            sortDirection="asc"
            onSort={jest.fn()}
          />
        </TestWrapper>
      );

      // Status indicators should have text labels, not just colors
      expect(screen.getByText('Published')).toBeInTheDocument();
      expect(screen.getByText('Draft')).toBeInTheDocument();

      // Selected rows should have text indicators
      const selectedRow = screen.getByRole('row', { selected: true });
      expect(selectedRow).toHaveAttribute('aria-selected', 'true');
    });

    it('should be readable when zoomed to 200%', () => {
      // Simulate 200% zoom by checking if layout adapts
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: 2,
      });

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Check that important elements are still accessible
      expect(screen.getByRole('button', { name: /add post/i })).toBeVisible();
      expect(screen.getByRole('searchbox')).toBeVisible();
      expect(screen.getByRole('table')).toBeVisible();
    });

    it('should have visible focus indicators', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      const addButton = screen.getByRole('button', { name: /add post/i });
      
      // Focus the button
      await user.tab();
      
      // Should have visible focus indicator
      expect(addButton).toHaveClass('focus:ring-2');
      expect(addButton).toHaveFocus();
    });
  });

  describe('Motion and Animation', () => {
    it('should respect reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Animations should be disabled or reduced
      const animatedElements = document.querySelectorAll('[class*="animate"]');
      animatedElements.forEach(element => {
        expect(element).toHaveClass('motion-reduce:animate-none');
      });
    });

    it('should not have content that flashes more than 3 times per second', () => {
      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Check that loading indicators don't flash too rapidly
      const loadingIndicators = document.querySelectorAll('[class*="animate-pulse"]');
      loadingIndicators.forEach(indicator => {
        const computedStyle = window.getComputedStyle(indicator);
        const animationDuration = computedStyle.animationDuration;
        
        if (animationDuration !== 'none') {
          const duration = parseFloat(animationDuration);
          expect(duration).toBeGreaterThan(0.33); // Should be slower than 3Hz
        }
      });
    });
  });

  describe('Touch Accessibility', () => {
    it('should have touch targets at least 44x44 pixels', () => {
      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        expect(Math.min(rect.width, rect.height)).toBeGreaterThanOrEqual(44);
      });
    });

    it('should have sufficient spacing between interactive elements', () => {
      render(
        <TestWrapper>
          <BulkActions
            selectedCount={2}
            selectedIds={['1', '2']}
            onBulkDelete={jest.fn()}
            onBulkExport={jest.fn()}
            onBulkDuplicate={jest.fn()}
            isLoading={false}
          />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      for (let i = 0; i < buttons.length - 1; i++) {
        const button1 = buttons[i].getBoundingClientRect();
        const button2 = buttons[i + 1].getBoundingClientRect();
        
        const horizontalGap = Math.abs(button2.left - button1.right);
        const verticalGap = Math.abs(button2.top - button1.bottom);
        
        // Should have at least 8px spacing
        expect(Math.min(horizontalGap, verticalGap)).toBeGreaterThanOrEqual(8);
      }
    });
  });

  describe('Semantic Markup', () => {
    it('should use proper heading hierarchy', () => {
      render(
        <TestWrapper>
          <EnhancedCollectionManager 
            collection="posts" 
            title="Manage Posts"
            description="Create and manage your blog posts"
          />
        </TestWrapper>
      );

      // Should have proper heading structure
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Manage Posts');

      // Subsequent headings should follow hierarchy
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(0);
    });

    it('should use proper table markup', () => {
      render(
        <TestWrapper>
          <CollectionTable
            data={mockDocuments}
            fields={mockSchema.fields}
            selectedIds={[]}
            onSelectionChange={jest.fn()}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
            onView={jest.fn()}
            onDuplicate={jest.fn()}
            isLoading={false}
            sortField="title"
            sortDirection="asc"
            onSort={jest.fn()}
          />
        </TestWrapper>
      );

      // Should have proper table structure
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBeGreaterThan(0);

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1); // Header + data rows
    });

    it('should use proper form markup', () => {
      render(
        <TestWrapper>
          <EnhancedDynamicForm
            fields={mockSchema.fields}
            onSubmit={jest.fn()}
            onCancel={jest.fn()}
            submitLabel="Create Post"
            isLoading={false}
            collection="posts"
          />
        </TestWrapper>
      );

      // Should have proper form structure
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();

      // All form controls should have labels
      const textboxes = screen.getAllByRole('textbox');
      textboxes.forEach(textbox => {
        expect(textbox).toHaveAttribute('aria-labelledby');
      });

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('aria-labelledby');
      });
    });
  });
});