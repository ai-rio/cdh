import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BillingToggle } from './BillingToggle';
import { describe, it, expect, vi } from 'vitest';

describe('BillingToggle', () => {
  it('renders correctly with monthly and annually options', () => {
    render(<BillingToggle value="monthly" onValueChange={() => {}} />);
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Annually')).toBeInTheDocument();
    expect(screen.getByText('Save 20%')).toBeInTheDocument();
  });

  it('displays the correct initial state (monthly selected)', () => {
    render(<BillingToggle value="monthly" onValueChange={() => {}} />);
    const monthlyToggle = screen.getByText('Monthly');
    const annuallyToggle = screen.getByText('Annually');

    expect(monthlyToggle).toHaveAttribute('data-state', 'on');
    expect(annuallyToggle).toHaveAttribute('data-state', 'off');
  });

  it('displays the correct initial state (annually selected)', () => {
    render(<BillingToggle value="annually" onValueChange={() => {}} />);
    const monthlyToggle = screen.getByText('Monthly');
    const annuallyToggle = screen.getByText('Annually');

    expect(monthlyToggle).toHaveAttribute('data-state', 'off');
    expect(annuallyToggle).toHaveAttribute('data-state', 'on');
  });

  it('calls onValueChange with "annually" when Annually is clicked', () => {
    const mockOnValueChange = vi.fn();
    render(<BillingToggle value="monthly" onValueChange={mockOnValueChange} />);
    const annuallyToggle = screen.getByText('Annually');

    fireEvent.click(annuallyToggle);
    expect(mockOnValueChange).toHaveBeenCalledTimes(1);
    expect(mockOnValueChange).toHaveBeenCalledWith('annually');
  });

  it('calls onValueChange with "monthly" when Monthly is clicked', () => {
    const mockOnValueChange = vi.fn();
    render(<BillingToggle value="annually" onValueChange={mockOnValueChange} />);
    const monthlyToggle = screen.getByText('Monthly');

    fireEvent.click(monthlyToggle);
    expect(mockOnValueChange).toHaveBeenCalledTimes(1);
    expect(mockOnValueChange).toHaveBeenCalledWith('monthly');
  });

  it('applies active styles to the selected toggle item', () => {
    const { rerender } = render(<BillingToggle value="monthly" onValueChange={() => {}} />);
    let monthlyToggle = screen.getByText('Monthly');
    let annuallyToggle = screen.getByText('Annually');

    expect(monthlyToggle).toHaveClass('data-[state=on]:bg-[#EEFC97]');
    expect(monthlyToggle).toHaveClass('data-[state=on]:text-[#1D1F04]');
    expect(monthlyToggle).toHaveClass('data-[state=on]:shadow-sm');
    expect(annuallyToggle).toHaveClass('data-[state=off]:text-white');

    rerender(<BillingToggle value="annually" onValueChange={() => {}} />);
    monthlyToggle = screen.getByText('Monthly');
    annuallyToggle = screen.getByText('Annually');

    expect(annuallyToggle).toHaveClass('data-[state=on]:bg-[#EEFC97]');
    expect(annuallyToggle).toHaveClass('data-[state=on]:text-[#1D1F04]');
    expect(annuallyToggle).toHaveClass('data-[state=on]:shadow-sm');
    expect(monthlyToggle).toHaveClass('data-[state=off]:text-white');
  });

  it('ensures "Save 20%" badge is present on Annually option', () => {
    render(<BillingToggle value="monthly" onValueChange={() => {}} />);
    const save20Badge = screen.getByText('Save 20%');
    expect(save20Badge).toBeInTheDocument();
    expect(save20Badge).toHaveClass('bg-green-400'); // Verify current styling
    expect(save20Badge).toHaveClass('text-green-900'); // Verify current styling
  });
});
