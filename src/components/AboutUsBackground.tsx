'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  generateLatticePositions,
  generateSpherePositions,
  generateSynergyPositions,
  updateParticlePositions,
  updateParticlePositionsWithPulse,
  applyChaosEffect
} from '@/utils/animation-helpers';

export default function AboutUsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      console.error("Background canvas not found. Aborting 3D experience.");
      return;
    }

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    
    // Create renderer with error handling
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current = renderer;
    } catch (e) {
      console.error("Could not create WebGL renderer:", e);
      canvas.style.display = 'none';
      return;
    }

    // Add lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Create particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 2500;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({ size: 0.03, color: 0xaaaaaa });
    const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleMesh);
    
    // Animation States
    const states = {
      chaos: { update: updateChaos },
      art: { update: updateArt },
      automation: { update: updateAutomation },
      ceo: { update: updateCEO },
      synergy: { update: updateSynergy }
    };
    let currentState = states.chaos;
    
    // Target positions for different states using utility functions
    const targets = {
      lattice: generateLatticePositions(particleCount),
      sphere: generateSpherePositions(particleCount),
      synergy: generateSynergyPositions(particleCount)
    };
    
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // GSAP ScrollTrigger to switch states
    document.querySelectorAll('.manifesto-section').forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          const state = (section as HTMLElement).dataset.state;
          if (state && states[state as keyof typeof states]) {
            currentState = states[state as keyof typeof states];
          }
        },
        onEnterBack: () => {
          const state = (section as HTMLElement).dataset.state;
          if (state && states[state as keyof typeof states]) {
            currentState = states[state as keyof typeof states];
          }
        }
      });
    });

    const clock = new THREE.Clock();
    
    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      if (currentState && currentState.update) {
        currentState.update(elapsedTime);
      }
      renderer.render(scene, camera);
    }
    animate();

    // State update functions using utility helpers
    function updateChaos(time: number) {
      applyChaosEffect(particleGeometry, time);
      particleMesh.rotation.y = time * 0.1;
    }
    
    function updateArt(time: number) {
      updateParticlePositions(particleGeometry, targets.sphere);
      particleMesh.rotation.y = time * 0.2;
    }
    
    function updateAutomation(time: number) {
      updateParticlePositionsWithPulse(particleGeometry, targets.sphere, time);
      particleMesh.rotation.y = time * 0.05;
    }
    
    function updateCEO(time: number) {
      updateParticlePositions(particleGeometry, targets.lattice);
      particleMesh.rotation.y = time * 0.1;
    }
    
    function updateSynergy(time: number) {
      updateParticlePositions(particleGeometry, targets.synergy);
      particleMesh.rotation.y = time * 0.15;
    }
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      id="bg-canvas" 
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}
    />
  );
}