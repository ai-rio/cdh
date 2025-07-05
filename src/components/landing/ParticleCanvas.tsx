'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'

// Debounce hook to limit how often a function is called
function useDebounce(callback: () => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
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

interface InteractiveConstellationProps {
  // Pass a ref to the element that should trigger the constellation
  targetRef: React.RefObject<HTMLDivElement>
}

const InteractiveConstellation: React.FC<InteractiveConstellationProps> = ({ targetRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const handleResize = useDebounce(() => {
    setDimensions({
      width: window.innerWidth,
      height: document.body.scrollHeight,
    })
  }, 250)

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('load', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('load', handleResize)
    }
  }, [handleResize])

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Particle[] = []
    let constellationActive = false
    const constellationCenter = { x: 0, y: 0 }
    let lineOpacity = 0

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

      draw() {
        if (!ctx) return
        // Draw a cross shape for the "spark" effect
        ctx.beginPath()
        ctx.moveTo(this.x - this.radius, this.y)
        ctx.lineTo(this.x + this.radius, this.y)
        ctx.moveTo(this.x, this.y - this.radius)
        ctx.lineTo(this.x, this.y + this.radius)
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.radius * 0.5
        ctx.shadowColor = this.color
        ctx.shadowBlur = this.radius * 3
        ctx.stroke()
      }

      update() {
        if (!canvas) return
        this.x += this.velocity.x
        this.y += this.velocity.y
        if (this.x < -this.radius) this.x = canvas.width + this.radius
        if (this.x > canvas.width + this.radius) this.x = -this.radius
        if (this.y < -this.radius) this.y = canvas.height + this.radius
        if (this.y > canvas.height + this.radius) this.y = -this.radius
        this.draw()
      }
    }

    function initParticles() {
      if (!canvas) return
      particles = []
      const numParticles = window.innerWidth > 768 ? 100 : 30
      for (let i = 0; i < numParticles; i++) {
        const radius = Math.random() * 1.5 + 0.5
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const color = 'rgba(255, 255, 255, 0.2)'
        const velocity = { x: (Math.random() - 0.5) * 0.2, y: (Math.random() - 0.5) * 0.2 }
        particles.push(new Particle(x, y, radius, color, velocity))
      }
    }

    function drawConstellation() {
      if (lineOpacity <= 0 || !ctx) return

      const sortedParticles = [...particles].sort((a, b) => {
        const distA = (a.x - constellationCenter.x) ** 2 + (a.y - constellationCenter.y) ** 2
        const distB = (b.x - constellationCenter.x) ** 2 + (b.y - constellationCenter.y) ** 2
        return distA - distB
      })

      const constellationParticles = sortedParticles.slice(0, 10)

      const gradient = ctx.createRadialGradient(
        constellationCenter.x,
        constellationCenter.y,
        0,
        constellationCenter.x,
        constellationCenter.y,
        200,
      )
      gradient.addColorStop(0, `rgba(192, 252, 50, ${lineOpacity * 0.3})`)
      gradient.addColorStop(1, `rgba(192, 252, 50, 0)`)

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(constellationCenter.x, constellationCenter.y, 200, 0, Math.PI * 2)
      ctx.fill()

      constellationParticles.forEach((p) => {
        ctx.beginPath()
        ctx.moveTo(constellationCenter.x, constellationCenter.y)
        ctx.lineTo(p.x, p.y)
        ctx.strokeStyle = `rgba(192, 252, 50, ${lineOpacity * 0.1})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      })
    }

    let animationFrameId: number
    function animate() {
      animationFrameId = requestAnimationFrame(animate)
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => p.update())

      if (constellationActive && lineOpacity < 1) {
        lineOpacity += 0.05
      } else if (!constellationActive && lineOpacity > 0) {
        lineOpacity -= 0.05
      }
      lineOpacity = Math.max(0, Math.min(1, lineOpacity))

      drawConstellation()
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      constellationCenter.x = rect.left + rect.width / 2
      constellationCenter.y = rect.top + rect.height / 2
      constellationActive = true
    }

    const handleMouseLeave = () => {
      constellationActive = false
    }

    // --- FIX: Use optional chaining to safely access the ref's current property ---
    const targetElement = targetRef?.current

    if (targetElement) {
      targetElement.addEventListener('mouseenter', handleMouseEnter as EventListener)
      targetElement.addEventListener('mouseleave', handleMouseLeave)
    }

    initParticles()
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (targetElement) {
        targetElement.removeEventListener('mouseenter', handleMouseEnter as EventListener)
        targetElement.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [dimensions, targetRef])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

export default InteractiveConstellation
