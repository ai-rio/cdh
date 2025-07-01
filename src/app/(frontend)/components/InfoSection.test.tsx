import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InfoSection } from './InfoSection';

describe('InfoSection', () => {
  const defaultProps = {
    title: 'Test Title',
    id: 'test-section',
    children: <p>Test content</p>,
  };

  it('renders with correct title and content', () => {
    render(<InfoSection {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies the correct id to the section element', () => {
    render(<InfoSection {...defaultProps} />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('id', 'test-section');
  });

  it('applies default CSS classes', () => {
    render(<InfoSection {...defaultProps} />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveClass('content-section');
  });

  it('applies custom className when provided', () => {
    render(<InfoSection {...defaultProps} className="custom-class" />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveClass('content-section', 'custom-class');
  });

  it('renders children content correctly', () => {
    const complexChildren = (
      <div>
        <p>First paragraph</p>
        <p>Second paragraph</p>
      </div>
    );
    
    render(
      <InfoSection {...defaultProps} title="Complex Content">
        {complexChildren}
      </InfoSection>
    );
    
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('uses Shadcn Card component with correct styling', () => {
    const { container } = render(<InfoSection {...defaultProps} />);
    
    // Check for Card component presence by looking for data-slot attribute
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
    
    // Check for CardContent presence
    const cardContent = container.querySelector('[data-slot="card-content"]');
    expect(cardContent).toBeInTheDocument();
  });

  it('applies dark theme styling classes', () => {
    const { container } = render(<InfoSection {...defaultProps} />);
    
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass('bg-black/70', 'backdrop-blur-md', 'border-white/10');
  });

  it('centers content with proper text alignment', () => {
    const { container } = render(<InfoSection {...defaultProps} />);
    
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass('text-center');
  });

  it('applies correct title styling', () => {
    render(<InfoSection {...defaultProps} />);
    
    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-white', 'mb-4');
  });

  it('applies correct content styling', () => {
    render(<InfoSection {...defaultProps} />);
    
    const content = screen.getByText('Test content').parentElement;
    expect(content).toHaveClass('text-gray-300');
  });
});