import * as THREE from 'three';

/**
 * Generates lattice positions for particles in a 3D grid pattern
 * @param particleCount - Total number of particles
 * @param spacing - Spacing between particles (default: 0.8)
 * @returns Array of Vector3 positions
 */
export function generateLatticePositions(particleCount: number, spacing: number = 0.8): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  
  for (let i = 0; i < particleCount; i++) {
    const x = (i % 20 - 10) * spacing;
    const y = (Math.floor(i / 20) % 20 - 10) * spacing;
    const z = (Math.floor(i / 400) - 5) * spacing;
    positions.push(new THREE.Vector3(x, y, z));
  }
  
  return positions;
}

/**
 * Generates sphere positions for particles distributed on a sphere surface
 * @param particleCount - Total number of particles
 * @param radius - Sphere radius (default: 8)
 * @returns Array of Vector3 positions
 */
export function generateSpherePositions(particleCount: number, radius: number = 8): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  
  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;
    
    positions.push(new THREE.Vector3(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    ));
  }
  
  return positions;
}

/**
 * Generates synergy positions for particles in multiple orbital rings
 * @param particleCount - Total number of particles
 * @param baseRadius - Base radius for the rings (default: 4)
 * @param ringSpacing - Spacing between rings (default: 2)
 * @returns Array of Vector3 positions
 */
export function generateSynergyPositions(
  particleCount: number, 
  baseRadius: number = 4, 
  ringSpacing: number = 2
): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  
  for (let i = 0; i < particleCount; i++) {
    const ring = i % 3;
    const radius = baseRadius + ring * ringSpacing;
    const angle = (i / particleCount) * Math.PI * (8 + ring * 2);
    const yOffset = (ring - 1) * 0.5;
    
    positions.push(new THREE.Vector3(
      radius * Math.cos(angle),
      yOffset + Math.sin(angle) * 0.5,
      radius * Math.sin(angle)
    ));
  }
  
  return positions;
}

/**
 * Calculates a pulse effect multiplier based on time and particle index
 * @param time - Current time
 * @param particleIndex - Index of the particle
 * @param frequency - Pulse frequency (default: 2)
 * @param amplitude - Pulse amplitude (default: 0.1)
 * @returns Pulse multiplier value
 */
export function calculatePulseEffect(
  time: number, 
  particleIndex: number, 
  frequency: number = 2, 
  amplitude: number = 0.1
): number {
  return Math.sin(time * frequency + particleIndex * 0.1) * amplitude + 1;
}

/**
 * Updates particle positions with linear interpolation towards target positions
 * @param geometry - BufferGeometry containing particle positions
 * @param targets - Array of target Vector3 positions
 * @param lerpFactor - Interpolation factor (0-1, default: 0.05)
 */
export function updateParticlePositions(
  geometry: THREE.BufferGeometry,
  targets: THREE.Vector3[],
  lerpFactor: number = 0.05
): void {
  const positions = geometry.attributes.position.array as Float32Array;
  
  for (let i = 0; i < targets.length; i++) {
    const i3 = i * 3;
    const current = new THREE.Vector3(
      positions[i3],
      positions[i3 + 1],
      positions[i3 + 2]
    );
    
    current.lerp(targets[i], lerpFactor);
    
    positions[i3] = current.x;
    positions[i3 + 1] = current.y;
    positions[i3 + 2] = current.z;
  }
  
  geometry.attributes.position.needsUpdate = true;
}

/**
 * Updates particle positions with pulse effect applied to targets
 * @param geometry - BufferGeometry containing particle positions
 * @param targets - Array of target Vector3 positions
 * @param time - Current time for pulse calculation
 * @param lerpFactor - Interpolation factor (0-1, default: 0.05)
 */
export function updateParticlePositionsWithPulse(
  geometry: THREE.BufferGeometry,
  targets: THREE.Vector3[],
  time: number,
  lerpFactor: number = 0.05
): void {
  const positions = geometry.attributes.position.array as Float32Array;
  
  for (let i = 0; i < targets.length; i++) {
    const i3 = i * 3;
    const current = new THREE.Vector3(
      positions[i3],
      positions[i3 + 1],
      positions[i3 + 2]
    );
    
    const pulse = calculatePulseEffect(time, i);
    const target = targets[i].clone().multiplyScalar(pulse);
    current.lerp(target, lerpFactor);
    
    positions[i3] = current.x;
    positions[i3 + 1] = current.y;
    positions[i3 + 2] = current.z;
  }
  
  geometry.attributes.position.needsUpdate = true;
}

/**
 * Applies chaos effect to particle positions
 * @param geometry - BufferGeometry containing particle positions
 * @param time - Current time for chaos calculation
 * @param amplitude - Chaos amplitude (default: 0.001)
 */
export function applyChaosEffect(
  geometry: THREE.BufferGeometry,
  time: number,
  amplitude: number = 0.001
): void {
  const positions = geometry.attributes.position.array as Float32Array;
  const particleCount = positions.length / 3;
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const x = positions[i3];
    positions[i3 + 1] += Math.sin(time + x) * amplitude;
  }
  
  geometry.attributes.position.needsUpdate = true;
}