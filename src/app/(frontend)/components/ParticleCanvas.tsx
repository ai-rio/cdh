'use client'

import { useEffect, useRef } from 'react'

interface ParticleCanvasProps {
  className?: string
}

class Particle {
  x: number
  y: number
  radius: number
  color: string
  velocity: { x: number; y: number }

  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    velocity: { x: number; y: number },
  ) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
  }

  update(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.x += this.velocity.x
    this.y += this.velocity.y
    if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
      this.velocity.x = -this.velocity.x
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
      this.velocity.y = -this.velocity.y
    }
    this.draw(ctx)
  }
}

export default function ParticleCanvas({ className = '' }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Particle[] = []
    const numParticles = window.innerWidth > 768 ? 100 : 30
    let animationFrameId: number

    function setCanvasSize() {
      if (!canvas || !ctx) return
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }

    function initParticles() {
      setCanvasSize()
      particles = []
      for (let i = 0; i < numParticles; i++) {
        const radius = Math.random() * 1.5 + 0.5
        const x = Math.random() * ((canvas?.width || 0) - radius * 2) + radius
        const y = Math.random() * ((canvas?.height || 0) - radius * 2) + radius
        const color = 'rgba(255, 255, 255, 0.2)'
        const velocity = { x: (Math.random() - 0.5) * 0.3, y: (Math.random() - 0.5) * 0.3 }
        particles.push(new Particle(x, y, radius, color, velocity))
      }
    }

    function connect() {
      if (!canvas || !ctx) return
      let opacityValue = 1
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance =
            (particles[a].x - particles[b].x) * (particles[a].x - particles[b].x) +
            (particles[a].y - particles[b].y) * (particles[a].y - particles[b].y)
          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - distance / 20000
            ctx.strokeStyle = `rgba(192, 252, 50, ${opacityValue * 0.1})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    function animateParticles() {
      if (!canvas || !ctx) return
      animationFrameId = requestAnimationFrame(animateParticles)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      connect()
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(ctx, canvas)
      }
    }

    initParticles()
    animateParticles()

    const handleResize = () => {
      setCanvasSize()
      initParticles() // Re-initialize particles on resize
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        background: 'transparent',
      }}
    />
  )
}
