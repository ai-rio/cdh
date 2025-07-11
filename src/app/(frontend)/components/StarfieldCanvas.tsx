'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface StarfieldCanvasProps {
  variant?: 'home' | '404'
  className?: string
}

export function StarfieldCanvas({ variant = 'home', className = '' }: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    group: THREE.Group
    animationId: number
    fallbackTimeout?: NodeJS.Timeout
    autoRotateInterval?: NodeJS.Timeout
    cleanup: () => void
  } | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const isMobile = window.innerWidth < 768

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = variant === '404' ? 10 : 15

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile, // Disable antialiasing on mobile for better performance
      alpha: true,
      powerPreference: isMobile ? 'low-power' : 'high-performance',
    })
    
    // Check if WebGL is supported
    const gl = renderer.getContext()
    if (!gl) {
      console.warn('WebGL not supported, StarfieldCanvas will not render')
      return
    }
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 2 : 3))
    renderer.setSize(window.innerWidth, window.innerHeight)

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, variant === '404' ? 0.1 : 0.2))
    const dirLight = new THREE.DirectionalLight(0xffffff, variant === '404' ? 0.5 : 0.8)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)

    const group = new THREE.Group()
    scene.add(group)

    if (variant === '404') {
      // 404 page - glitchy wireframe object
      const geometry = new THREE.IcosahedronGeometry(5, 1)
      const material = new THREE.MeshStandardMaterial({
        color: 0x333333,
        emissive: 0x111111,
        metalness: 0.9,
        roughness: 0.2,
        wireframe: true,
      })
      const mainObject = new THREE.Mesh(geometry, material)
      group.add(mainObject)
    } else {
      // Home page - constellation system
      const colors = {
        accent: 0xeefc97,
        primary: 0x300c41,
        secondary: 0xd0c6f0,
        overdue: 0xf97316,
      }

      const satellitesData = isMobile
        ? [
            {
              type: 'Deal',
              name: 'Nomad Goods Campaign',
              color: colors.accent,
              size: 0.8,
              distance: 5,
              speed: 0.005,
            },
            {
              type: 'Invoice',
              name: 'TechFlow #0011',
              color: colors.overdue,
              size: 0.6,
              distance: 5.5,
              speed: -0.003,
            },
          ]
        : [
            {
              type: 'Deal',
              name: 'Nomad Goods Campaign',
              color: colors.accent,
              size: 0.8,
              distance: 5,
              speed: 0.005,
            },
            {
              type: 'Deal',
              name: 'AudioLux Podcast Ad',
              color: colors.primary,
              size: 0.5,
              distance: 6,
              speed: 0.004,
            },
            {
              type: 'Deal',
              name: 'D2C Skincare Stories',
              color: colors.secondary,
              size: 0.4,
              distance: 7,
              speed: 0.006,
            },
            {
              type: 'Invoice',
              name: 'TechFlow #0011',
              color: colors.overdue,
              size: 0.6,
              distance: 5.5,
              speed: -0.003,
            },
            {
              type: 'Contact',
              name: 'Marcus (Manager)',
              color: 0xffffff,
              size: 0.3,
              distance: 4.5,
              speed: 0.008,
            },
          ]

      const orbitalPivots: THREE.Group[] = []
      const interactiveObjects: THREE.Mesh[] = []

      // Central creator orb
      const creatorOrb = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.5, isMobile ? 1 : 2),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xd0c6f0,
          emissiveIntensity: 0.3,
          metalness: 0.1,
          roughness: 0.3,
        })
      )
      group.add(creatorOrb)
      interactiveObjects.push(creatorOrb)

      // Satellite objects
      satellitesData.forEach((data) => {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(data.size, isMobile ? 16 : 32, isMobile ? 16 : 32),
          new THREE.MeshStandardMaterial({
            color: data.color,
            emissive: data.color,
            emissiveIntensity: 0.5,
            metalness: 0.2,
            roughness: 0.5,
          })
        )

        const pivot = new THREE.Group()
        pivot.userData.speed = data.speed
        pivot.rotation.x = Math.random() * Math.PI
        pivot.rotation.y = Math.random() * Math.PI
        mesh.position.set(data.distance, 0, 0)
        pivot.add(mesh)
        creatorOrb.add(pivot)
        interactiveObjects.push(mesh)
        orbitalPivots.push(pivot)
      })

      // Mobile gyroscope controls with fallback
      let gyroscopeEnabled = false
      if (isMobile && typeof window !== 'undefined') {
        // Check for DeviceOrientationEvent support
        if (window.DeviceOrientationEvent) {
          const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
            if (!gyroscopeEnabled && (event.beta !== null || event.gamma !== null)) {
              gyroscopeEnabled = true
            }
            
            const beta = Math.max(-45, Math.min(45, event.beta || 0))
            const gamma = Math.max(-45, Math.min(45, event.gamma || 0))
            const targetRotationX = ((beta * Math.PI) / 180) * 0.25
            const targetRotationY = ((gamma * Math.PI) / 180) * 0.25

            gsap.to(group.rotation, {
              x: targetRotationX,
              y: targetRotationY,
              duration: 1,
              ease: 'power2.out',
            })
          }
          
          window.addEventListener('deviceorientation', handleDeviceOrientation)
          
          // Fallback: if no gyroscope data after 2 seconds, enable touch controls
          const fallbackTimeout = setTimeout(() => {
            if (!gyroscopeEnabled) {
              // Add subtle auto-rotation for devices without gyroscope
              const autoRotate = () => {
                const time = Date.now() * 0.0005
                gsap.to(group.rotation, {
                  x: Math.sin(time) * 0.1,
                  y: Math.cos(time * 0.7) * 0.1,
                  duration: 2,
                  ease: 'power2.inOut',
                })
              }
              const autoRotateInterval = setInterval(autoRotate, 2000)
              
              // Store interval for cleanup
              sceneRef.current = {
                ...sceneRef.current!,
                autoRotateInterval,
              }
            }
          }, 2000)
          
          // Store timeout for cleanup
          sceneRef.current = {
            ...sceneRef.current!,
            fallbackTimeout,
          }
        }
      }
    }

    const clock = new THREE.Clock()
    let animationId: number = 0
    let lastFrameTime = 0
    const targetFPS = isMobile ? 30 : 60
    const frameInterval = 1000 / targetFPS
    
    function animate(currentTime: number = 0) {
      animationId = requestAnimationFrame(animate)
      
      // Throttle frame rate for mobile performance
      if (isMobile && currentTime - lastFrameTime < frameInterval) {
        return
      }
      lastFrameTime = currentTime
      
      const elapsedTime = clock.getElapsedTime()

      if (variant === '404') {
        // Erratic rotation for 404 page
        group.rotation.x = Math.sin(elapsedTime * 0.7) * 0.5 + Math.random() * 0.1
        group.rotation.y = Math.cos(elapsedTime * 0.5) * 0.5 + Math.random() * 0.1
      } else {
        // Home page constellation animation
        const creatorOrb = group.children[0] as THREE.Mesh
        if (creatorOrb?.material && 'emissiveIntensity' in creatorOrb.material) {
          creatorOrb.material.emissiveIntensity = 0.3 + Math.sin(elapsedTime * 1.5) * 0.1
        }

        // Orbital animation
        creatorOrb.children.forEach((child) => {
          if (child instanceof THREE.Group && child.userData.speed) {
            child.rotation.y += child.userData.speed * (isMobile ? 0.3 : 0.5)
          }
        })

        // Individual object rotation (reduced for mobile)
        if (!isMobile || elapsedTime % 0.1 < 0.05) { // Skip some frames on mobile
          const rotateObjects = (obj: THREE.Object3D) => {
            if (obj instanceof THREE.Mesh && obj !== creatorOrb) {
              obj.rotation.x += isMobile ? 0.001 : 0.002
              obj.rotation.y += isMobile ? 0.001 : 0.002
            }
            obj.children.forEach(rotateObjects)
          }
          group.children.forEach(rotateObjects)
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Store scene reference for cleanup
    sceneRef.current = {
      scene,
      camera,
      renderer,
      group,
      animationId,
      cleanup: () => {
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(animationId)
        if (sceneRef.current?.fallbackTimeout) {
          clearTimeout(sceneRef.current.fallbackTimeout)
        }
        if (sceneRef.current?.autoRotateInterval) {
          clearInterval(sceneRef.current.autoRotateInterval)
        }
        renderer.dispose()
        scene.clear()
      },
    }

    return () => {
      sceneRef.current?.cleanup()
    }
  }, [variant])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full z-[1] ${className}`}
      role="img"
      aria-hidden="true"
    />
  )
}