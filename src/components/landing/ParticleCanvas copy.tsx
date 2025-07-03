'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'

// Debounce function to limit how often a function can run.
function useDebounce(callback: () => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Cleanup the timeout if the component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const debouncedCallback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      callback()
    }, delay)
  }, [callback, delay])

  return debouncedCallback
}

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // --- ROBUST FIX: Use state to manage canvas dimensions ---
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // --- ROBUST FIX: Debounced resize handler to improve performance ---
  const handleResize = useDebounce(() => {
    setDimensions({
      width: window.innerWidth,
      height: document.body.scrollHeight,
    })
  }, 100) // 100ms delay

  // Effect for setting up and cleaning up listeners
  useEffect(() => {
    // Set initial dimensions
    handleResize()

    window.addEventListener('resize', handleResize)
    // Add a load listener as a final fallback
    window.addEventListener('load', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('load', handleResize)
    }
  }, [handleResize])

  // Effect for running the canvas animation. This re-runs ONLY when dimensions change.
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 150,
    }

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    class Particle {
      x: number
      y: number
      radius: number
      color: string
      velocity: { x: number; y: number }
      baseX: number
      baseY: number
      density: number

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
        this.baseX = this.x
        this.baseY = this.y
        this.density = Math.random() * 30 + 1
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.shadowBlur = this.radius * 2
        ctx.shadowColor = this.color
        ctx.fill()
      }

      update() {
        if (!canvas || !ctx) return

        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const maxDistance = mouse.radius

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          this.x -= forceDirectionX * force * this.density * 0.6
          this.y -= forceDirectionY * force * this.density * 0.6
        } else {
          if (this.x !== this.baseX) {
            const dxReturn = this.x - this.baseX
            this.x -= dxReturn / 20
          }
          if (this.y !== this.baseY) {
            const dyReturn = this.y - this.baseY
            this.y -= dyReturn / 20
          }
        }

        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
          this.velocity.x = -this.velocity.x
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
          this.velocity.y = -this.velocity.y
        }

        this.x += this.velocity.x
        this.y += this.velocity.y

        this.draw()
      }
    }

    let particles: Particle[] = []

    const initParticles = () => {
      particles = []
      // Reduced particle count for better performance
      const numParticles = window.innerWidth > 768 ? 150 : 50
      for (let i = 0; i < numParticles; i++) {
        const radius = Math.random() * 1.5 + 0.5
        const x = Math.random() * (canvas.width - radius * 2) + radius
        const y = Math.random() * (canvas.height - radius * 2) + radius
        const color = 'rgba(255, 255, 255, 0.3)'
        const velocity = {
          x: (Math.random() - 0.5) * 0.4, // Reduced velocity for smoother animation
          y: (Math.random() - 0.5) * 0.4, // Reduced velocity for smoother animation
        }
        particles.push(new Particle(x, y, radius, color, velocity))
      }
    }

    const connect = () => {
      if (!ctx || !canvas) return
      let opacityValue = 1
      const connectionDistance = (canvas.width / 7) * (canvas.height / 7)

      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance =
            (particles[a].x - particles[b].x) ** 2 + (particles[a].y - particles[b].y) ** 2

          if (distance < (canvas.width / 6) * (canvas.height / 6)) { // Reduced connection distance for performance
            opacityValue = 1 - (distance / 40000); // Adjusted for new distance

            const gradient = ctx.createLinearGradient(
              particles[a].x,
              particles[a].y,
              particles[b].x,
              particles[b].y,
            )
            gradient.addColorStop(0, `rgba(97, 195, 255, ${opacityValue * 0.9})`)
            gradient.addColorStop(1, `rgba(192, 252, 50, ${opacityValue * 0.9})`)

            ctx.strokeStyle = gradient
            ctx.lineWidth = 1 + (1 - (distance / ((canvas.width / 4) * (canvas.height / 4)))) * 3; // Dynamic line width
            ctx.shadowBlur = ctx.lineWidth * 2; // Glow proportional to line width
            ctx.shadowColor = `rgba(192, 252, 50, ${opacityValue * 0.9})`;
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    let animationFrameId: number
    let lastTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS
    
    const animateParticles = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animateParticles)
      if (!ctx || !canvas) return
      
      // Limit frame rate for better performance
      if (currentTime - lastTime < frameInterval) return
      lastTime = currentTime
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => p.update())
      connect()
    }

    initParticles()
    animateParticles(0)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [dimensions]) // This effect now depends on the dimensions state

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, background: '#111111', pointerEvents: 'none' }}
    />
  )
}

export default ParticleCanvas
