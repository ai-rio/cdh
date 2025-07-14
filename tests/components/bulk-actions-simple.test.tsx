import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BulkActions } from '@/app/(dashboard)/components/collection-manager/bulk-actions';

describe('BulkActions Component', () => {
  const defaultProps = {
    selectedCount: 2,
    selectedIds: ['1', '2'],
    onBulkDelete: vi.fn(),
    onBulkExport: vi.fn(),
    onBulkDuplicate: vi.fn(),
    isLoading: false,
  };

  it('should render selected count', () => {
    render(<BulkActions {...defaultProps} />);
    
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  it('should show bulk actions when items are selected', () => {
    render(<BulkActions {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument();
  });

  it('should not render when no items selected', () => {
    const { container } = render(
      <BulkActions {...defaultProps} selectedCount={0} selectedIds={[]} />
    );
    
    expect(container.firstChild).toBeNull();
  });
});