/**
 * Enhanced Collection Manager Component Tests
 * Following TDD methodology - comprehensive component testing
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CollectionManager } from '../../src/app/(dashboard)/components/collection-manager';
import { PayloadProvider } from '../../src/lib/payload-client';

// Mock the collection manager hook
const mockUseCollectionManager = {
  documents: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  bulkDelete: vi.fn(),
  bulkUpdate: vi.fn(),
  bulkImport: vi.fn(),
  bulkExport: vi.fn(),
  search: vi.fn(),
  filter: vi.fn(),
  sort: vi.fn(),
  goToPage: vi.fn(),
  changePageSize: vi.fn(),
  refresh: vi.fn(),
  clearCache: vi.fn(),
};

vi.mock('../../src/app/(dashboard)/hooks/use-collection-manager', () => ({
  useCollectionManager: () => mockUseCollectionManager,
}));

// Test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PayloadProvider>
    {children}
  </PayloadProvider>
);

describe('CollectionManager Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render collection manager with empty state', () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      expect(screen.getByText(/no documents found/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create new/i })).toBeInTheDocument();
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should render loading state', () => {
      mockUseCollectionManager.isLoading = true;
      
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render error state', () => {
      mockUseCollectionManager.error = new Error('Failed to load collection');
      
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      expect(screen.getByText(/failed to load collection/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    beforeEach(() => {
      mockUseCollectionManager.documents = [
        { id: '1', name: 'John Doe', email: 'john@example.com', createdAt: '2024-01-01' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', createdAt: '2024-01-02' },
      ];
      mockUseCollectionManager.totalCount = 2;
      mockUseCollectionManager.isLoading = false;
      mockUseCollectionManager.error = null;
    });

    it('should render documents in table format', () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('2 documents')).toBeInTheDocument();
    });

    it('should render sortable column headers', () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      const emailHeader = screen.getByRole('columnheader', { name: /email/i });
      
      expect(nameHeader).toBeInTheDocument();
      expect(emailHeader).toBeInTheDocument();
      expect(nameHeader).toHaveAttribute('aria-sort');
    });

    it('should handle column sorting', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      await user.click(nameHeader);

      expect(mockUseCollectionManager.sort).toHaveBeenCalledWith('name', 'asc');
    });
  });

  describe('Search and Filtering', () => {
    it('should handle search input', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'john');

      await waitFor(() => {
        expect(mockUseCollectionManager.search).toHaveBeenCalledWith('john');
      });
    });

    it('should render filter controls', () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      expect(screen.getByTestId('toggle-filters-button')).toBeInTheDocument();
      expect(screen.getByTestId('clear-filters-button')).toBeInTheDocument();
    });

    it('should handle filter application', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const filterButton = screen.getByTestId('toggle-filters-button');
      await user.click(filterButton);

      // Filter panel should open
      expect(screen.getByText(/filter by/i)).toBeInTheDocument();
    });
  });

  describe('CRUD Operations', () => {
    it('should handle document creation', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const createButton = screen.getByRole('button', { name: /create new/i });
      await user.click(createButton);

      expect(screen.getByText(/create new user/i)).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle document editing', async () => {
      mockUseCollectionManager.documents = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
      ];

      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      expect(screen.getByText(/edit user/i)).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle document deletion', async () => {
      mockUseCollectionManager.documents = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
      ];

      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();
      
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      expect(mockUseCollectionManager.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('Bulk Operations', () => {
    beforeEach(() => {
      mockUseCollectionManager.documents = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
      ];
    });

    it('should handle bulk selection', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
      await user.click(selectAllCheckbox);

      const selectedItems = screen.getAllByRole('checkbox', { checked: true });
      expect(selectedItems).toHaveLength(4); // 3 items + select all
    });

    it('should show bulk actions when items selected', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const firstCheckbox = screen.getAllByRole('checkbox')[1]; // Skip select all
      await user.click(firstCheckbox);

      expect(screen.getByText(/1 selected/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /bulk delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /bulk update/i })).toBeInTheDocument();
    });

    it('should handle bulk deletion', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      // Select items
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]);
      await user.click(checkboxes[2]);

      const bulkDeleteButton = screen.getByRole('button', { name: /bulk delete/i });
      await user.click(bulkDeleteButton);

      expect(screen.getByText(/delete 2 items/i)).toBeInTheDocument();
      
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      expect(mockUseCollectionManager.bulkDelete).toHaveBeenCalledWith(['1', '2']);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      mockUseCollectionManager.totalCount = 100;
      mockUseCollectionManager.totalPages = 10;
      mockUseCollectionManager.currentPage = 1;
    });

    it('should render pagination controls', () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      expect(screen.getByText(/page 1 of 10/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    });

    it('should handle page navigation', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const nextButton = screen.getByRole('button', { name: /next page/i });
      await user.click(nextButton);

      expect(mockUseCollectionManager.goToPage).toHaveBeenCalledWith(2);
    });

    it('should handle page size changes', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const pageSizeSelect = screen.getByRole('combobox', { name: /items per page/i });
      await user.selectOptions(pageSizeSelect, '25');

      expect(mockUseCollectionManager.changePageSize).toHaveBeenCalledWith(25);
    });
  });

  describe('Import/Export', () => {
    it('should render import/export buttons', () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /import/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
    });

    it('should handle import dialog', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const importButton = screen.getByRole('button', { name: /import/i });
      await user.click(importButton);

      expect(screen.getByText(/import data/i)).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle export dialog', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);

      expect(screen.getByText(/export data/i)).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Collection Manager');
      expect(screen.getByRole('table')).toHaveAttribute('aria-label', 'Users collection data');
      expect(screen.getByRole('searchbox')).toHaveAttribute('aria-label', 'Search users');
    });

    it('should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('searchbox');
      searchInput.focus();
      
      expect(document.activeElement).toBe(searchInput);

      // Tab to next focusable element
      await user.tab();
      expect(document.activeElement).toBe(screen.getByTestId('toggle-filters-button'));
    });

    it('should announce dynamic content changes', async () => {
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      // Should have live region for announcements
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
      }));

      mockUseCollectionManager.documents = largeDataset;
      mockUseCollectionManager.totalCount = 1000;

      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within performance budget
      expect(renderTime).toBeLessThan(150); // 150ms budget (more realistic)
    });

    it('should implement virtual scrolling for large lists', () => {
      mockUseCollectionManager.documents = Array.from({ length: 10000 }, (_, i) => ({
        id: `${i}`,
        name: `User ${i}`,
      }));

      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      // Should only render visible items
      const visibleRows = screen.getAllByRole('row');
      expect(visibleRows.length).toBeLessThan(50); // Only visible items rendered
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      mockUseCollectionManager.error = new Error('Network error');

      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      expect(screen.getByText(/network error/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle operation failures', async () => {
      mockUseCollectionManager.delete.mockRejectedValue(new Error('Delete failed'));

      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      // Trigger delete operation
      // Error should be displayed
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      // Mock documents to ensure mobile layout shows
      mockUseCollectionManager.documents = [
        { id: '1', name: 'Test User', email: 'test@example.com' }
      ];

      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      // Should show mobile-optimized layout
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument();
    });

    it('should show/hide columns based on screen size', () => {
      // Mock documents to show columns
      mockUseCollectionManager.documents = [
        { id: '1', name: 'Test User', email: 'test@example.com' }
      ];

      render(
        <TestWrapper>
          <CollectionManager collection="users" />
        </TestWrapper>
      );

      // Essential columns should always be visible
      expect(screen.getByText(/name/i)).toBeInTheDocument();
      
      // Optional columns may be hidden on small screens
      const createdAtColumn = screen.queryByText(/created at/i);
      expect(createdAtColumn).toBeInTheDocument();
    });
  });
});
