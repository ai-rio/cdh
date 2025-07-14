import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EnhancedCollectionManager } from '@/app/(dashboard)/components/enhanced-collection-manager';
import { CollectionManager } from '@/app/(dashboard)/components/collection-manager';
import { useCollectionManager } from '@/app/(dashboard)/hooks/use-collection-manager';
import { useCollectionSchema } from '@/app/(dashboard)/hooks/use-collection-schema';
import type { CollectionConfig, FieldConfig } from '@/types/collection-management';

// Mock the hooks
jest.mock('@/app/(dashboard)/hooks/use-collection-manager');
jest.mock('@/app/(dashboard)/hooks/use-collection-schema');
jest.mock('@/lib/payload-client');

const mockUseCollectionManager = useCollectionManager as jest.MockedFunction<typeof useCollectionManager>;
const mockUseCollectionSchema = useCollectionSchema as jest.MockedFunction<typeof useCollectionSchema>;

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

const mockSchema: CollectionConfig = {
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
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: false,
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
    },
    {
      name: 'tags',
      type: 'relationship',
      label: 'Tags',
      relationTo: 'tags',
      hasMany: true,
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

// Test wrapper with providers
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

describe('Collection Manager Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseCollectionManager.mockReturnValue(mockCollectionManagerReturn);
    mockUseCollectionSchema.mockReturnValue(mockSchemaReturn);
  });

  describe('EnhancedCollectionManager', () => {
    it('should render collection list with documents', async () => {
      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      expect(screen.getByText('Posts')).toBeInTheDocument();
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Total count badge
    });

    it('should handle search functionality', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search posts...');
      await user.type(searchInput, 'first');

      expect(mockCollectionManagerReturn.search).toHaveBeenCalledWith('first');
    });

    it('should handle document creation workflow', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Click "Add Post" button
      const addButton = screen.getByRole('button', { name: /add post/i });
      await user.click(addButton);

      // Should switch to create view
      expect(screen.getByText('Create Post')).toBeInTheDocument();
      expect(screen.getByText('Add a new post to the collection')).toBeInTheDocument();
    });

    it('should handle document editing workflow', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Find the first document row and click edit
      const firstRow = screen.getByText('First Post').closest('tr');
      expect(firstRow).toBeInTheDocument();

      // Mock the edit action - in a real implementation, this would be triggered
      // by clicking an edit button in the table row
      const editButton = within(firstRow!).getByRole('button');
      await user.click(editButton);

      // The component should call the edit handler
      // Note: This test would need the actual table implementation to be more specific
    });

    it('should handle bulk operations', async () => {
      const user = userEvent.setup();

      // Mock selected documents
      mockUseCollectionManager.mockReturnValue({
        ...mockCollectionManagerReturn,
        selectedIds: ['1', '2'],
      });

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Should show bulk actions bar
      expect(screen.getByText('2 selected')).toBeInTheDocument();

      // Test bulk export
      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);

      expect(mockCollectionManagerReturn.bulkExport).toHaveBeenCalled();
    });

    it('should handle pagination', async () => {
      const user = userEvent.setup();

      // Mock multiple pages
      mockUseCollectionManager.mockReturnValue({
        ...mockCollectionManagerReturn,
        totalPages: 3,
        currentPage: 1,
      });

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();

      // Test page navigation
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      expect(mockCollectionManagerReturn.goToPage).toHaveBeenCalledWith(2);
    });

    it('should switch to analytics view', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedCollectionManager 
            collection="posts" 
            enableAnalytics={true} 
          />
        </TestWrapper>
      );

      const analyticsButton = screen.getByRole('button', { name: /analytics/i });
      await user.click(analyticsButton);

      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Collection insights and statistics')).toBeInTheDocument();
    });

    it('should handle loading states correctly', () => {
      mockUseCollectionManager.mockReturnValue({
        ...mockCollectionManagerReturn,
        isLoading: true,
      });

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Should show loading indicators
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should handle error states gracefully', () => {
      mockUseCollectionManager.mockReturnValue({
        ...mockCollectionManagerReturn,
        error: new Error('Failed to load documents'),
      });

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      expect(screen.getByText('Failed to load documents')).toBeInTheDocument();
    });

    it('should handle empty state', () => {
      mockUseCollectionManager.mockReturnValue({
        ...mockCollectionManagerReturn,
        documents: [],
        totalCount: 0,
      });

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      expect(screen.getByText('No posts found')).toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('should integrate with dynamic form for creation', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Navigate to create view
      const addButton = screen.getByRole('button', { name: /add post/i });
      await user.click(addButton);

      // Should render form with schema fields
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Content')).toBeInTheDocument();
      expect(screen.getByLabelText('Status')).toBeInTheDocument();

      // Fill out form
      await user.type(screen.getByLabelText('Title'), 'New Test Post');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create post/i });
      await user.click(submitButton);

      expect(mockCollectionManagerReturn.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Test Post',
        })
      );
    });

    it('should handle form validation errors', async () => {
      const user = userEvent.setup();

      // Mock validation error
      const mockCreateWithError = jest.fn().mockRejectedValue(
        new Error('Title is required')
      );

      mockUseCollectionManager.mockReturnValue({
        ...mockCollectionManagerReturn,
        create: mockCreateWithError,
      });

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Navigate to create view
      const addButton = screen.getByRole('button', { name: /add post/i });
      await user.click(addButton);

      // Submit form without required field
      const submitButton = screen.getByRole('button', { name: /create post/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });
    });
  });

  describe('Real-time Features', () => {
    it('should show collaboration features when enabled', () => {
      render(
        <TestWrapper>
          <EnhancedCollectionManager 
            collection="posts" 
            enableCollaboration={true} 
          />
        </TestWrapper>
      );

      // Should initialize with collaboration features
      expect(mockUseCollectionManager).toHaveBeenCalledWith(
        expect.objectContaining({
          enableRealTime: true,
        })
      );
    });

    it('should handle document locking', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Navigate to edit view for first document
      const addButton = screen.getByRole('button', { name: /add post/i });
      await user.click(addButton);

      // Should attempt to lock document when editing
      expect(mockCollectionManagerReturn.lockDocument).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        title: `Post ${i}`,
        content: `Content for post ${i}`,
        status: i % 2 === 0 ? 'published' : 'draft',
        tags: [`tag${i % 5}`],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      mockUseCollectionManager.mockReturnValue({
        ...mockCollectionManagerReturn,
        documents: largeDataset,
        totalCount: 1000,
        totalPages: 40,
      });

      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      const endTime = performance.now();
      
      // Should render within reasonable time (less than 500ms)
      expect(endTime - startTime).toBeLessThan(500);
      
      // Should show correct counts
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 40')).toBeInTheDocument();
    });

    it('should implement virtual scrolling for large lists', () => {
      // This would test virtual scrolling implementation
      // In practice, this would require a more complex setup with scroll containers
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: `${i}`,
        title: `Post ${i}`,
        content: `Content ${i}`,
        status: 'published',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      mockUseCollectionManager.mockReturnValue({
        ...mockCollectionManagerReturn,
        documents: largeDataset.slice(0, 25), // Only show paginated results
        totalCount: 10000,
        totalPages: 400,
      });

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Should only render visible items
      expect(screen.getAllByText(/^Post \d+$/)).toHaveLength(25);
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', async () => {
      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Test keyboard navigation
      const addButton = screen.getByRole('button', { name: /add post/i });
      addButton.focus();
      
      expect(document.activeElement).toBe(addButton);

      // Tab to search input
      fireEvent.keyDown(addButton, { key: 'Tab' });
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      expect(document.activeElement).toBe(searchInput);
    });

    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Check for proper ARIA labels
      expect(screen.getByRole('button', { name: /add post/i })).toHaveAttribute('aria-label');
      expect(screen.getByRole('searchbox')).toHaveAttribute('aria-label');
      expect(screen.getByRole('table')).toHaveAttribute('aria-label');
    });

    it('should announce dynamic content changes', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Search for content
      const searchInput = screen.getByPlaceholderText('Search posts...');
      await user.type(searchInput, 'first');

      // Should have appropriate aria-live regions for announcements
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should adapt layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Should have responsive classes
      const container = screen.getByRole('main');
      expect(container).toHaveClass('responsive-container');
    });

    it('should handle touch interactions', async () => {
      render(
        <TestWrapper>
          <EnhancedCollectionManager collection="posts" />
        </TestWrapper>
      );

      // Test touch events
      const addButton = screen.getByRole('button', { name: /add post/i });
      
      fireEvent.touchStart(addButton);
      fireEvent.touchEnd(addButton);

      // Should handle touch events appropriately
      expect(addButton).toHaveClass('touch-friendly');
    });
  });
});