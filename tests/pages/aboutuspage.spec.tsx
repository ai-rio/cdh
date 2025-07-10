import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '../utils/test-utils';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutPage from '@/app/(frontend)/about/page';

// Mock Three.js and GSAP to avoid WebGL context issues in test environment
vi.mock('three', () => ({
  Scene: vi.fn(() => ({
    add: vi.fn(),
    clear: vi.fn()
  })),
  PerspectiveCamera: vi.fn(() => ({
    position: { z: 15 },
    aspect: 1,
    updateProjectionMatrix: vi.fn()
  })),
  WebGLRenderer: vi.fn(() => ({
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn()
  })),
  AmbientLight: vi.fn(),
  DirectionalLight: vi.fn(() => ({
    position: { set: vi.fn() }
  })),
  BufferGeometry: vi.fn(() => ({
    setAttribute: vi.fn(),
    attributes: {
      position: {
        array: new Float32Array(7500), // 2500 particles * 3 coordinates
        needsUpdate: false
      }
    }
  })),
  BufferAttribute: vi.fn(),
  PointsMaterial: vi.fn(),
  Points: vi.fn(() => ({
    rotation: { y: 0 }
  })),
  Vector3: vi.fn((x = 0, y = 0, z = 0) => ({
    x, y, z,
    lerp: vi.fn(),
    clone: vi.fn(() => ({ multiplyScalar: vi.fn() }))
  })),
  Clock: vi.fn(() => ({
    getElapsedTime: vi.fn(() => 0)
  }))
}));

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn()
  }
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    getAll: vi.fn(() => []),
    kill: vi.fn()
  }
}));

// Mock requestAnimationFrame and cancelAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: vi.fn((cb) => setTimeout(cb, 16))
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: vi.fn()
});

// Mock window resize event
Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: vi.fn()
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: vi.fn()
});

describe('About Us Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the About Us page successfully', () => {
    render(<AboutPage />);
    
    // Check for main heading
    expect(screen.getByText('Our Manifesto')).toBeInTheDocument();
    
    // Check for subtitle
    expect(screen.getByText(/We don't just build tools/)).toBeInTheDocument();
  });

  it('should render all manifesto sections with correct content', () => {
    render(<AboutPage />);
    
    // Check for all four manifesto tenets
    expect(screen.getByText('We Believe in Clarity Over Chaos.')).toBeInTheDocument();
    expect(screen.getByText('We Believe Data is Art.')).toBeInTheDocument();
    expect(screen.getByText('We Believe in Empowerment Through Automation.')).toBeInTheDocument();
    expect(screen.getByText('We Believe the Creator is the CEO.')).toBeInTheDocument();
    
    // Check for tenet numbers
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });

  it('should render the Architects team grid', () => {
    render(<AboutPage />);
    
    // Check for team section heading
    expect(screen.getByText('The Architects')).toBeInTheDocument();
    
    // Check for team member roles
    expect(screen.getByText('Creative Orchestrator')).toBeInTheDocument();
    expect(screen.getByText('Prompt Engineer')).toBeInTheDocument();
    expect(screen.getByText('Visual Designer')).toBeInTheDocument();
    expect(screen.getByText('UI/UX Designer')).toBeInTheDocument();
    expect(screen.getByText('Web Developer')).toBeInTheDocument();
    expect(screen.getByText('Creative Critic')).toBeInTheDocument();
    
    // Check for role descriptions
    expect(screen.getByText('Team Lead')).toBeInTheDocument();
    expect(screen.getByText('AI Specialist')).toBeInTheDocument();
    expect(screen.getByText('Aesthetics')).toBeInTheDocument();
    expect(screen.getByText('User Experience')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Strategy')).toBeInTheDocument();
  });

  it('should render the background canvas element', () => {
    render(<AboutPage />);
    
    // Check for canvas element
    const canvas = document.getElementById('bg-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
    expect(canvas?.tagName.toLowerCase()).toBe('canvas');
  });

  it('should have correct data-state attributes on manifesto sections', () => {
    render(<AboutPage />);
    
    // Get all manifesto sections
    const sections = document.querySelectorAll('.manifesto-section');
    
    expect(sections).toHaveLength(5); // 4 tenets + 1 team section
    
    // Check data-state attributes
    expect(sections[0]).toHaveAttribute('data-state', 'chaos');
    expect(sections[1]).toHaveAttribute('data-state', 'art');
    expect(sections[2]).toHaveAttribute('data-state', 'automation');
    expect(sections[3]).toHaveAttribute('data-state', 'ceo');
    expect(sections[4]).toHaveAttribute('data-state', 'synergy');
  });

  it('should have proper CSS classes for styling', () => {
    render(<AboutPage />);
    
    // Check for main content container
    const contentContainer = document.querySelector('.content-container');
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer).toHaveClass('pt-24');
    
    // Check for manifesto content styling
    const manifestoContent = document.querySelector('.manifesto-content');
    expect(manifestoContent).toBeInTheDocument();
    expect(manifestoContent).toHaveClass('mx-auto', 'relative');
    
    // Check for team grid
    const teamGrid = document.querySelector('.team-grid');
    expect(teamGrid).toBeInTheDocument();
    expect(teamGrid).toHaveClass('grid', 'gap-8');
    
    // Check for architect cards
    const architectCards = document.querySelectorAll('.architect-card');
    expect(architectCards).toHaveLength(6);
    architectCards.forEach(card => {
      expect(card).toHaveClass('p-4', 'rounded-lg');
    });
  });

  it('should render tenet content with proper styling', () => {
    render(<AboutPage />);
    
    // Check for tenet numbers with proper styling
    const tenetNumbers = document.querySelectorAll('.tenet-number');
    expect(tenetNumbers).toHaveLength(4);
    
    // Check for manifesto section headings
    const headings = screen.getAllByRole('heading', { level: 2 });
    const manifestoHeadings = headings.filter(h => 
      h.textContent?.includes('We Believe')
    );
    expect(manifestoHeadings).toHaveLength(4);
    
    manifestoHeadings.forEach(heading => {
      expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-lime-300', 'mb-4');
    });
  });
});

// Additional test for Three.js integration (mocked)
describe('About Us Page - Three.js Integration', () => {
  it('should initialize Three.js scene components', async () => {
    const threeModule = await vi.importMock('three') as any;
    
    render(<AboutPage />);
    
    // Verify Three.js components are instantiated
    expect(threeModule.Scene).toHaveBeenCalled();
    expect(threeModule.PerspectiveCamera).toHaveBeenCalledWith(75, expect.any(Number), 0.1, 1000);
    expect(threeModule.WebGLRenderer).toHaveBeenCalled();
  });

  it('should register GSAP ScrollTrigger', async () => {
    const gsapModule = await vi.importMock('gsap') as any;
    
    render(<AboutPage />);

    expect(gsapModule.gsap.registerPlugin).toHaveBeenCalled();
  });
});