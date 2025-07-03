'use client';

import React, { useRef, useEffect } from 'react';

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    class Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      velocity: { x: number; y: number };

      constructor(x: number, y: number, radius: number, color: string, velocity: { x: number; y: number }) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (!canvas) return;
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
          this.velocity.x = -this.velocity.x;
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
          this.velocity.y = -this.velocity.y;
        }
        this.draw();
      }
    }

    let particles: Particle[] = [];
    let numParticles = window.innerWidth > 768 ? 100 : 30;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
      numParticles = window.innerWidth > 768 ? 100 : 30;
    };

    const initParticles = () => {
      setCanvasSize();
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        const radius = Math.random() * 1.5 + 0.5;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const color = 'rgba(255, 255, 255, 0.2)';
        const velocity = {
          x: (Math.random() - 0.5) * 0.3,
          y: (Math.random() - 0.5) * 0.3,
        };
        particles.push(new Particle(x, y, radius, color, velocity));
      }
    };

    const connect = () => {
        if (!ctx || !canvas) return;
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) ** 2) + ((particles[a].y - particles[b].y) ** 2);
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(192, 252, 50, ${opacityValue * 0.1})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    let animationFrameId: number;
    const animateParticles = () => {
      animationFrameId = requestAnimationFrame(animateParticles);
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => p.update());
      connect();
    };

    const handleResize = () => {
        initParticles();
    };
    
    initParticles();
    animateParticles();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />;
};

export default ParticleCanvas;