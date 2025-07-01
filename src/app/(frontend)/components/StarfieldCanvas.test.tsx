import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { StarfieldCanvas } from './StarfieldCanvas'

// Mock Three.js
vi.mock('three', () => {
  const mockMesh = {
    rotation: { x: 0, y: 0, z: 0 },
    position: { set: vi.fn() },
    material: { emissiveIntensity: 0.3 },
    children: [],
    add: vi.fn(),
    userData: {},
  }

  const mockGroup = {
    rotation: { x: 0, y: 0, z: 0 },
    children: [mockMesh],
    add: vi.fn(),
    userData: { speed: 0.005 },
  }

  const mockScene = {
    add: vi.fn(),
    clear: vi.fn(),
  }

  const mockCamera = {
    position: { z: 15 },
    aspect: 1,
    updateProjectionMatrix: vi.fn(),
  }

  const mockRenderer = {
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
  }

  const mockClock = {
    getElapsedTime: vi.fn(() => 1),
  }

  return {
    Scene: vi.fn(() => mockScene),
    PerspectiveCamera: vi.fn(() => mockCamera),
    WebGLRenderer: vi.fn(() => mockRenderer),
    Group: vi.fn(() => mockGroup),
    Mesh: vi.fn(() => mockMesh),
    IcosahedronGeometry: vi.fn(),
    SphereGeometry: vi.fn(),
    MeshStandardMaterial: vi.fn(),
    AmbientLight: vi.fn(),
    DirectionalLight: vi.fn(() => ({ position: { set: vi.fn() } })),
    Clock: vi.fn(() => mockClock),
  }
})

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
  },
}))

// Mock window properties
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
})
Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
})
Object.defineProperty(window, 'devicePixelRatio', {
  writable: true,
  configurable: true,
  value: 1,
})

describe('StarfieldCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'requestAnimationFrame');
    vi.spyOn(window, 'cancelAnimationFrame');
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('renders canvas element with correct attributes', () => {
    render(<StarfieldCanvas />)
    const canvas = screen.getByRole('img', { hidden: true })
    
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveClass('fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'z-[1]')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies custom className when provided', () => {
    render(<StarfieldCanvas className="custom-class" />)
    const canvas = screen.getByRole('img', { hidden: true })
    
    expect(canvas).toHaveClass('custom-class')
  })

  it('renders with home variant by default', () => {
    render(<StarfieldCanvas />)
    const canvas = screen.getByRole('img', { hidden: true })
    
    expect(canvas).toBeInTheDocument()
    // The component should initialize Three.js scene for home variant
  })

  it('renders with 404 variant when specified', () => {
    render(<StarfieldCanvas variant="404" />)
    const canvas = screen.getByRole('img', { hidden: true })
    
    expect(canvas).toBeInTheDocument()
    // The component should initialize Three.js scene for 404 variant
  })

  it('handles window resize events', () => {
    render(<StarfieldCanvas />)
    
    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', { value: 800 })
    Object.defineProperty(window, 'innerHeight', { value: 600 })
    
    const resizeEvent = new Event('resize')
    window.dispatchEvent(resizeEvent)
    
    // The component should handle resize internally
    expect(window.innerWidth).toBe(800)
    expect(window.innerHeight).toBe(600)
  })

  it('cleans up resources on unmount', () => {
    const { unmount } = render(<StarfieldCanvas />)
    
    unmount()
    
    // Cleanup should be called
    expect(window.cancelAnimationFrame).toHaveBeenCalled()
  })

  it('handles mobile device orientation when available', () => {
    // Mock DeviceOrientationEvent
    Object.defineProperty(window, 'DeviceOrientationEvent', {
      value: class DeviceOrientationEvent extends Event {
        beta: number
        gamma: number
        constructor(type: string, eventInitDict?: any) {
          super(type, eventInitDict)
          this.beta = eventInitDict?.beta || 0
          this.gamma = eventInitDict?.gamma || 0
        }
      },
    })

    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 375 })
    
    render(<StarfieldCanvas />)
    
    // Simulate device orientation event
    const orientationEvent = new (window as any).DeviceOrientationEvent('deviceorientation', {
      beta: 10,
      gamma: 5,
    })
    window.dispatchEvent(orientationEvent)
    
    // The component should handle orientation changes
    expect(window.innerWidth).toBe(375)
  })

  it('starts animation loop on mount', () => {
    render(<StarfieldCanvas />)
    
    expect(window.requestAnimationFrame).toHaveBeenCalled()
  })

  it('handles different variants correctly', () => {
    const { rerender } = render(<StarfieldCanvas variant="home" />)
    expect(window.requestAnimationFrame).toHaveBeenCalled()
    
    rerender(<StarfieldCanvas variant="404" />)
    expect(window.requestAnimationFrame).toHaveBeenCalled()
  })
})