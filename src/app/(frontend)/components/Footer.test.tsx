import { render, screen } from '@testing-library/react';
import React from 'react';
import { Footer } from './Footer';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return <a href={href} className={className}>{children}</a>;
  },
}));

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders the footer element with site-footer class', () => {
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveClass('site-footer');
  });

  it('renders all navigation section links', () => {
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Deals' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pricing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument();
  });

  it('renders all company section links', () => {
    expect(screen.getByRole('link', { name: 'About Us' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Careers' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });

  it('renders all legal section links', () => {
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toBeInTheDocument();
  });

  it('renders social media links', () => {
    const socialLinks = screen.getAllByRole('link');
    const twitterLink = socialLinks.find(link => link.querySelector('.fa-twitter'));
    const youtubeLink = socialLinks.find(link => link.querySelector('.fa-youtube'));
    const discordLink = socialLinks.find(link => link.querySelector('.fa-discord'));
    
    expect(twitterLink).toBeInTheDocument();
    expect(youtubeLink).toBeInTheDocument();
    expect(discordLink).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    expect(screen.getByText('© 2025 Creator\'s Deal Hub. All Rights Reserved.')).toBeInTheDocument();
  });

  it('renders all section headings', () => {
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByText('Join the Community')).toBeInTheDocument();
  });

  it('has correct href attributes for internal links', () => {
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#hero-section');
    expect(screen.getByRole('link', { name: 'Deals' })).toHaveAttribute('href', '#deals-section');
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing');
    expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about');
  });

  it('applies footer-link class to navigation links', () => {
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveClass('footer-link');
  });

  it('applies social-link class to social media links', () => {
    const socialLinks = document.querySelectorAll('.social-link');
    expect(socialLinks).toHaveLength(3);
  });

  it('has responsive grid layout classes', () => {
    const footerGrid = document.querySelector('.footer-grid');
    expect(footerGrid).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-4', 'gap-8');
  });
});