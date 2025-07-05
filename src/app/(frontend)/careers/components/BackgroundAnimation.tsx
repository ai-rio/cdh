'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true, 
      alpha: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Store references for cleanup
    sceneRef.current = scene;
    rendererRef.current = renderer;
    
    // Create the main object group
    const group = new THREE.Group();
    scene.add(group);
    
    // Create the icosahedron geometry and material
    const geometry = new THREE.IcosahedronGeometry(4, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      emissive: 0x333333,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
    });
    const mainObject = new THREE.Mesh(geometry, material);
    group.add(mainObject);

    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation loop
    const clock = new THREE.Clock();
    
    function animate() {
      const elapsedTime = clock.getElapsedTime();
      
      // Rotate the group
      group.rotation.x = elapsedTime * 0.1;
      group.rotation.y = elapsedTime * 0.1;
      
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      // Dispose of Three.js resources
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      id="bg-canvas" 
      className="fixed top-0 left-0 w-full h-full z-[1]" 
      aria-hidden="true"
    />
  );
}