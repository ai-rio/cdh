import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../../src/app/(frontend)/components/Header';

describe('Header Integration Tests', () => {
  beforeEach(() => {
    render(<Header />);
  });

  it('renders the mission control HUD header', () => {
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('mission-control-hud');
  });

  it('displays the Creator\'s Deal Hub logo and title', () => {
    const logoLink = screen.getByRole('link', { name: /cdh/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
    expect(screen.getByText('CDH')).toBeInTheDocument();
  });

  it('displays HUD items with correct values', () => {
    expect(screen.getByText('Active Deals')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Key Contacts')).toBeInTheDocument();
    expect(screen.getByText('47')).toBeInTheDocument();
  });

  it('has a navigation toggle button', () => {
    const toggleButton = screen.getByRole('button', { name: /open navigation menu/i });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('id', 'command-deck-toggle');
  });

  it('opens and closes the CommandDeck overlay when toggle is clicked', () => {
    const toggleButton = screen.getByRole('button', { name: /open navigation menu/i });
    const commandDeck = screen.getByTestId('command-deck');
    
    // Initially, CommandDeck should be closed
    expect(commandDeck).not.toHaveClass('open');
    
    // Click to open
    fireEvent.click(toggleButton);
    expect(commandDeck).toHaveClass('open');
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    
    // Click close button to close
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(commandDeck).not.toHaveClass('open');
  });

  it('displays navigation cards with correct content', () => {
    const toggleButton = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(toggleButton);
    
    // Check Blog card
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Insights and strategies from the forefront of the creator economy.')).toBeInTheDocument();
    
    // Check Pricing card
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Simple, transparent plans that scale with your success.')).toBeInTheDocument();
    
    // Check About Us card
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Learn about our mission to empower professional creators.')).toBeInTheDocument();
    
    // Check Login card
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Access your Creator\'s Deal Hub account.')).toBeInTheDocument();
  });

  it('has proper navigation links', () => {
    const toggleButton = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(toggleButton);
    
    const blogLink = screen.getByRole('link', { name: /blog/i });
    expect(blogLink).toHaveAttribute('href', '/blog');
    
    const pricingLink = screen.getByRole('link', { name: /pricing/i });
    expect(pricingLink).toHaveAttribute('href', '/pricing');
    
    const aboutLink = screen.getByRole('link', { name: /about us/i });
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('applies overdue styling to overdue HUD item', () => {
    const overdueValue = screen.getByText('3');
    expect(overdueValue).toHaveClass('overdue');
  });
});