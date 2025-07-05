import { render } from '@testing-library/react'
import { vi, afterEach } from 'vitest'
import { ContactCanvas } from '../ContactCanvas'

// Mock Three.js
vi.mock('three', () => ({
  Scene: vi.fn(() => ({
    add: vi.fn(),
  })),
  PerspectiveCamera: vi.fn(() => ({
    position: { z: 0 },
    aspect: 0,
    updateProjectionMatrix: vi.fn(),
  })),
  WebGLRenderer: vi.fn(() => ({
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
  })),
  Group: vi.fn(() => ({
    add: vi.fn(),
    rotation: { x: 0, y: 0 },
  })),
  TorusKnotGeometry: vi.fn(() => ({
    dispose: vi.fn(),
  })),
  MeshStandardMaterial: vi.fn(() => ({
    dispose: vi.fn(),
  })),
  Mesh: vi.fn(() => ({
    scale: { set: vi.fn() },
  })),
  Clock: vi.fn(() => ({
    getElapsedTime: vi.fn(() => 0),
  })),
}))

// Mock requestAnimationFrame
let animationId = 0
global.requestAnimationFrame = vi.fn((cb) => {
  animationId++
  // Don't actually call the callback to avoid infinite loops in tests
  return animationId
})

global.cancelAnimationFrame = vi.fn()

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})

describe('ContactCanvas', () => {
  it('renders canvas element', () => {
    const { container } = render(<ContactCanvas />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute('id', 'bg-canvas')
    expect(canvas).toHaveClass('absolute', 'top-0', 'left-0', 'w-full', 'h-full')
    expect(canvas).toHaveStyle('z-index: 1')
  })

  it('has correct aria attributes', () => {
    const { container } = render(<ContactCanvas />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
  })
})
