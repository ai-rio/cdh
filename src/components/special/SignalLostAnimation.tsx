'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

export function SignalLostAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    composer?: EffectComposer;
    animationId?: number;
    resizeHandler?: () => void;
  }>({});

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true, 
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 0); // Transparent background for light theme
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-10';
    renderer.domElement.style.pointerEvents = 'none';

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    
    const afterimagePass = new AfterimagePass();
    afterimagePass.uniforms.damp.value = 0.85;
    composer.addPass(afterimagePass);
    
    const glitchPass = new GlitchPass();
    composer.addPass(glitchPass);

    // Scene objects
    const group = new THREE.Group();
    scene.add(group);
    
    // Add some ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    // Add a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const geometry = new THREE.IcosahedronGeometry(5, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x000000,  // Black wireframe
      emissive: 0x000000,
      metalness: 0.1,
      roughness: 0.8,
      wireframe: true,
    });
    const mainObject = new THREE.Mesh(geometry, material);
    group.add(mainObject);

    const clock = new THREE.Clock();
    
    function animate() {
      const animationId = requestAnimationFrame(animate);
      sceneRef.current.animationId = animationId;
      
      const elapsedTime = clock.getElapsedTime();
      
      // Erratic rotation
      group.rotation.x = Math.sin(elapsedTime * 0.7) * 0.5 + Math.random() * 0.1;
      group.rotation.y = Math.cos(elapsedTime * 0.5) * 0.5 + Math.random() * 0.1;
      
      // Trigger glitch pass intermittently
      if (Math.random() > 0.95) {
        glitchPass.goWild = true;
        setTimeout(() => {
          glitchPass.goWild = false;
        }, 150);
      }
      
      composer.render();
    }
    
    const resizeHandler = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', resizeHandler);
    
    // Store references for cleanup
    sceneRef.current = {
      scene,
      camera,
      renderer,
      composer,
      resizeHandler
    };
    
    animate();

    // Cleanup function
    return () => {
      // Cancel animation frame
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      // Remove event listeners
      if (sceneRef.current.resizeHandler) {
        window.removeEventListener('resize', sceneRef.current.resizeHandler);
      }
      
      // Dispose of Three.js objects
      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose();
      }
      
      if (sceneRef.current.composer) {
        sceneRef.current.composer.dispose();
      }
      
      // Dispose geometry and materials
      geometry.dispose();
      material.dispose();
      
      // Clear scene
      if (sceneRef.current.scene) {
        sceneRef.current.scene.clear();
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      style={{ 
        zIndex: -999,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none'
      }}
    />
  );
}
