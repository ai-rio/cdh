'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ContactCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    group: THREE.Group
    animationId: number
    cleanup: () => void
  } | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current

    // Scene setup - exact match to contact.html
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      alpha: true 
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    
    const group = new THREE.Group()
    scene.add(group)
    
    // Create the exact same torus knot geometry as in contact.html
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)
    const material = new THREE.MeshStandardMaterial({
      color: 0x555555,
      emissive: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true,
    })
    const mainObject = new THREE.Mesh(geometry, material)
    mainObject.scale.set(0.5, 0.5, 0.5)
    group.add(mainObject)

    const clock = new THREE.Clock()
    
    function animate() {
      const animationId = requestAnimationFrame(animate)
      sceneRef.current!.animationId = animationId
      
      const elapsedTime = clock.getElapsedTime()
      group.rotation.x = elapsedTime * 0.05
      group.rotation.y = elapsedTime * 0.05
      renderer.render(scene, camera)
    }

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
      animationId: 0,
      cleanup: () => {
        window.removeEventListener('resize', handleResize)
        if (sceneRef.current?.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId)
        }
        renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }

    // Start animation
    animate()

    // Cleanup function
    return () => {
      if (sceneRef.current) {
        sceneRef.current.cleanup()
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      className="fixed top-0 left-0 w-full h-full"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}
