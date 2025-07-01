import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Footer } from '../../src/app/(frontend)/components/Footer';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return <a href={href} className={className}>{children}</a>;
  },
}));

// Mock router for navigation testing
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: '/',
  }),
}));

describe('Footer Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Footer Component Integration', () => {
    it('renders footer with all required sections and maintains layout integrity', () => {
      render(<Footer />);
      
      // Verify main footer structure
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('site-footer');
      
      // Verify grid container
      const gridContainer = footer.querySelector('.footer-grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-4');
      
      // Verify all sections are present
      const sections = [
        'Navigation',
        'Company', 
        'Legal',
        'Join the Community'
      ];
      
      sections.forEach(section => {
        expect(screen.getByText(section)).toBeInTheDocument();
      });
    });

    it('integrates properly with Link components', () => {
      render(<Footer />);
      
      // Check that navigation links use proper styling
      const homeLink = screen.getByRole('link', { name: 'Home' });
      
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveClass('footer-link');
      expect(homeLink).toHaveAttribute('href', '#hero-section');
    });

    it('handles link interactions correctly', () => {
      render(<Footer />);
      
      // Test internal navigation links
      const homeLink = screen.getByRole('link', { name: 'Home' });
      const dealsLink = screen.getByRole('link', { name: 'Deals' });
      
      expect(homeLink).toHaveAttribute('href', '#hero-section');
      expect(dealsLink).toHaveAttribute('href', '#deals-section');
      
      // Test external page links
      const pricingLink = screen.getByRole('link', { name: 'Pricing' });
      const aboutLink = screen.getByRole('link', { name: 'About Us' });
      
      expect(pricingLink).toHaveAttribute('href', '/pricing');
      expect(aboutLink).toHaveAttribute('href', '/about');
    });

    it('maintains accessibility standards', () => {
      render(<Footer />);
      
      // Check semantic HTML structure
      const footer = screen.getByRole('contentinfo');
      expect(footer.tagName).toBe('FOOTER');
      
      // Check all links are accessible
      const allLinks = screen.getAllByRole('link');
      expect(allLinks.length).toBeGreaterThan(0);
      
      allLinks.forEach(link => {
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href');
      });
      
      // Check headings structure
      const headings = screen.getAllByRole('heading', { level: 4 });
      expect(headings).toHaveLength(4);
    });

    it('applies correct styling classes for responsive design', () => {
      render(<Footer />);
      
      const footer = screen.getByRole('contentinfo');
      const container = footer.querySelector('.max-w-5xl');
      const grid = footer.querySelector('.footer-grid');
      
      expect(container).toHaveClass('max-w-5xl', 'mx-auto');
      expect(grid).toHaveClass(
        'grid',
        'grid-cols-2',
        'md:grid-cols-4',
        'gap-8',
        'text-center',
        'md:text-left'
      );
      
      // Check social section responsive classes
      const socialSection = screen.getByText('Join the Community').closest('div');
      expect(socialSection).toHaveClass(
        'text-center',
        'md:text-right',
        'col-span-2',
        'md:col-span-1'
      );
    });

    it('renders social media icons with correct Font Awesome classes', () => {
      render(<Footer />);
      
      const socialContainer = screen.getByText('Join the Community').closest('div');
      const socialLinks = socialContainer?.querySelectorAll('.social-link');
      
      expect(socialLinks).toHaveLength(3);
      
      // Check for Font Awesome icon classes
      const twitterIcon = socialContainer?.querySelector('.fa-twitter');
      const youtubeIcon = socialContainer?.querySelector('.fa-youtube');
      const discordIcon = socialContainer?.querySelector('.fa-discord');
      
      expect(twitterIcon).toBeInTheDocument();
      expect(youtubeIcon).toBeInTheDocument();
      expect(discordIcon).toBeInTheDocument();
    });

    it('displays copyright information correctly', () => {
      render(<Footer />);
      
      const copyrightText = screen.getByText('© 2025 Creator\'s Deal Hub. All Rights Reserved.');
      expect(copyrightText).toBeInTheDocument();
      expect(copyrightText).toHaveClass('text-xs', 'text-gray-500', 'mt-8');
    });

    it('maintains proper link hierarchy and organization', () => {
      render(<Footer />);
      
      // Navigation section
      const navSection = screen.getByText('Navigation').closest('div');
      const navLinks = navSection?.querySelectorAll('a');
      expect(navLinks).toHaveLength(4);
      
      // Company section
      const companySection = screen.getByText('Company').closest('div');
      const companyLinks = companySection?.querySelectorAll('a');
      expect(companyLinks).toHaveLength(3);
      
      // Legal section
      const legalSection = screen.getByText('Legal').closest('div');
      const legalLinks = legalSection?.querySelectorAll('a');
      expect(legalLinks).toHaveLength(2);
      
      // Social section
      const socialSection = screen.getByText('Join the Community').closest('div');
      const socialLinks = socialSection?.querySelectorAll('.social-link');
      expect(socialLinks).toHaveLength(3);
    });
  });
});