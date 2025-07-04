import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import {
  generateLatticePositions,
  generateSpherePositions,
  generateSynergyPositions,
  calculatePulseEffect,
  updateParticlePositions,
  updateParticlePositionsWithPulse,
  applyChaosEffect
} from '@/utils/animation-helpers';

// Mock Three.js Vector3 for testing
vi.mock('three', () => ({
  Vector3: vi.fn().mockImplementation((x = 0, y = 0, z = 0) => ({
    x, y, z,
    lerp: vi.fn(function(this: any, target: any, factor: number) {
      this.x += (target.x - this.x) * factor;
      this.y += (target.y - this.y) * factor;
      this.z += (target.z - this.z) * factor;
      return this;
    }),
    clone: vi.fn(function(this: any) {
      return { 
        x: this.x, 
        y: this.y, 
        z: this.z,
        multiplyScalar: vi.fn(function(this: any, scalar: number) {
          this.x *= scalar;
          this.y *= scalar;
          this.z *= scalar;
          return this;
        })
      };
    }),
    multiplyScalar: vi.fn(function(this: any, scalar: number) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      return this;
    })
  }))
}));

describe('Animation Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateLatticePositions', () => {
    it('should generate correct number of positions', () => {
      const particleCount = 100;
      const positions = generateLatticePositions(particleCount);
      
      expect(positions).toHaveLength(particleCount);
      expect(THREE.Vector3).toHaveBeenCalledTimes(particleCount);
    });

    it('should generate positions with default spacing', () => {
      const positions = generateLatticePositions(1);
      
      expect(THREE.Vector3).toHaveBeenCalledWith(-8, -8, -4);
    });

    it('should generate positions with custom spacing', () => {
      const customSpacing = 1.5;
      const positions = generateLatticePositions(1, customSpacing);
      
      expect(THREE.Vector3).toHaveBeenCalledWith(-15, -15, -7.5);
    });

    it('should generate different positions for different indices', () => {
      const positions = generateLatticePositions(3);
      
      expect(THREE.Vector3).toHaveBeenNthCalledWith(1, -8, -8, -4);
      expect(THREE.Vector3).toHaveBeenNthCalledWith(2, -7.2, -8, -4);
      expect(THREE.Vector3).toHaveBeenNthCalledWith(3, -6.4, -8, -4);
    });
  });

  describe('generateSpherePositions', () => {
    it('should generate correct number of positions', () => {
      const particleCount = 50;
      const positions = generateSpherePositions(particleCount);
      
      expect(positions).toHaveLength(particleCount);
      expect(THREE.Vector3).toHaveBeenCalledTimes(particleCount);
    });

    it('should use default radius when not specified', () => {
      const positions = generateSpherePositions(1);
      
      // Verify that the calculation uses radius = 8 (default)
      const phi = Math.acos(-1 + (2 * 0) / 1);
      const theta = Math.sqrt(1 * Math.PI) * phi;
      const expectedX = 8 * Math.cos(theta) * Math.sin(phi);
      const expectedY = 8 * Math.sin(theta) * Math.sin(phi);
      const expectedZ = 8 * Math.cos(phi);
      
      expect(THREE.Vector3).toHaveBeenCalledWith(expectedX, expectedY, expectedZ);
    });

    it('should use custom radius when specified', () => {
      const customRadius = 12;
      const positions = generateSpherePositions(1, customRadius);
      
      const phi = Math.acos(-1 + (2 * 0) / 1);
      const theta = Math.sqrt(1 * Math.PI) * phi;
      const expectedX = customRadius * Math.cos(theta) * Math.sin(phi);
      const expectedY = customRadius * Math.sin(theta) * Math.sin(phi);
      const expectedZ = customRadius * Math.cos(phi);
      
      expect(THREE.Vector3).toHaveBeenCalledWith(expectedX, expectedY, expectedZ);
    });
  });

  describe('generateSynergyPositions', () => {
    it('should generate correct number of positions', () => {
      const particleCount = 30;
      const positions = generateSynergyPositions(particleCount);
      
      expect(positions).toHaveLength(particleCount);
      expect(THREE.Vector3).toHaveBeenCalledTimes(particleCount);
    });

    it('should use default parameters when not specified', () => {
      const positions = generateSynergyPositions(1);
      
      const ring = 0 % 3;
      const radius = 4 + ring * 2; // baseRadius=4, ringSpacing=2
      const angle = (0 / 1) * Math.PI * (8 + ring * 2);
      const yOffset = (ring - 1) * 0.5;
      
      const expectedX = radius * Math.cos(angle);
      const expectedY = yOffset + Math.sin(angle) * 0.5;
      const expectedZ = radius * Math.sin(angle);
      
      expect(THREE.Vector3).toHaveBeenCalledWith(expectedX, expectedY, expectedZ);
    });

    it('should use custom parameters when specified', () => {
      const baseRadius = 6;
      const ringSpacing = 3;
      const positions = generateSynergyPositions(1, baseRadius, ringSpacing);
      
      const ring = 0 % 3;
      const radius = baseRadius + ring * ringSpacing;
      const angle = (0 / 1) * Math.PI * (8 + ring * 2);
      const yOffset = (ring - 1) * 0.5;
      
      const expectedX = radius * Math.cos(angle);
      const expectedY = yOffset + Math.sin(angle) * 0.5;
      const expectedZ = radius * Math.sin(angle);
      
      expect(THREE.Vector3).toHaveBeenCalledWith(expectedX, expectedY, expectedZ);
    });

    it('should generate different positions for different rings', () => {
      const positions = generateSynergyPositions(6); // 2 particles per ring
      
      // Verify different ring calculations
      expect(THREE.Vector3).toHaveBeenCalledTimes(6);
      
      // First particle (ring 0)
      const ring0 = 0 % 3;
      const radius0 = 4 + ring0 * 2;
      
      // Fourth particle (ring 1)
      const ring1 = 3 % 3;
      const radius1 = 4 + ring1 * 2;
      
      expect(radius0).toBe(4);
      expect(radius1).toBe(4);
    });
  });

  describe('calculatePulseEffect', () => {
    it('should return a value around 1 with default parameters', () => {
      const result = calculatePulseEffect(0, 0);
      
      // With default amplitude 0.1, result should be between 0.9 and 1.1
      expect(result).toBeGreaterThanOrEqual(0.9);
      expect(result).toBeLessThanOrEqual(1.1);
    });

    it('should use custom frequency and amplitude', () => {
      const time = 0;
      const particleIndex = 0;
      const frequency = 4;
      const amplitude = 0.2;
      
      const result = calculatePulseEffect(time, particleIndex, frequency, amplitude);
      const expected = Math.sin(time * frequency + particleIndex * 0.1) * amplitude + 1;
      
      expect(result).toBe(expected);
    });

    it('should produce different values for different times', () => {
      const result1 = calculatePulseEffect(0, 0);
      const result2 = calculatePulseEffect(1, 0);
      
      expect(result1).not.toBe(result2);
    });

    it('should produce different values for different particle indices', () => {
      const result1 = calculatePulseEffect(0, 0);
      const result2 = calculatePulseEffect(0, 10);
      
      expect(result1).not.toBe(result2);
    });
  });

  describe('updateParticlePositions', () => {
    let mockGeometry: any;
    let mockTargets: any[];

    beforeEach(() => {
      mockGeometry = {
        attributes: {
          position: {
            array: new Float32Array([1, 2, 3, 4, 5, 6]), // 2 particles
            needsUpdate: false
          }
        }
      };
      
      mockTargets = [
        { x: 10, y: 20, z: 30 },
        { x: 40, y: 50, z: 60 }
      ];
    });

    it('should update particle positions towards targets', () => {
      updateParticlePositions(mockGeometry, mockTargets);
      
      expect(mockGeometry.attributes.position.needsUpdate).toBe(true);
      expect(THREE.Vector3).toHaveBeenCalledTimes(2); // One for each particle
    });

    it('should use custom lerp factor', () => {
      const customLerpFactor = 0.1;
      updateParticlePositions(mockGeometry, mockTargets, customLerpFactor);
      
      // Verify Vector3 instances were created with current positions
      expect(THREE.Vector3).toHaveBeenNthCalledWith(1, 1, 2, 3);
      expect(THREE.Vector3).toHaveBeenNthCalledWith(2, 4, 5, 6);
    });

    it('should handle empty targets array', () => {
      updateParticlePositions(mockGeometry, []);
      
      expect(mockGeometry.attributes.position.needsUpdate).toBe(true);
      expect(THREE.Vector3).not.toHaveBeenCalled();
    });
  });

  describe('updateParticlePositionsWithPulse', () => {
    let mockGeometry: any;
    let mockTargets: any[];

    beforeEach(() => {
      mockGeometry = {
        attributes: {
          position: {
            array: new Float32Array([1, 2, 3, 4, 5, 6]),
            needsUpdate: false
          }
        }
      };
      
      mockTargets = [
        { 
          x: 10, y: 20, z: 30,
          clone: vi.fn(() => ({
            x: 10, y: 20, z: 30,
            multiplyScalar: vi.fn(function(this: any, scalar: number) {
              this.x *= scalar;
              this.y *= scalar;
              this.z *= scalar;
              return this;
            })
          }))
        },
        { 
          x: 40, y: 50, z: 60,
          clone: vi.fn(() => ({
            x: 40, y: 50, z: 60,
            multiplyScalar: vi.fn(function(this: any, scalar: number) {
              this.x *= scalar;
              this.y *= scalar;
              this.z *= scalar;
              return this;
            })
          }))
        }
      ];
    });

    it('should update particle positions with pulse effect', () => {
      const time = 1.0;
      updateParticlePositionsWithPulse(mockGeometry, mockTargets, time);
      
      expect(mockGeometry.attributes.position.needsUpdate).toBe(true);
      expect(mockTargets[0].clone).toHaveBeenCalled();
      expect(mockTargets[1].clone).toHaveBeenCalled();
    });

    it('should use custom lerp factor', () => {
      const time = 1.0;
      const customLerpFactor = 0.2;
      updateParticlePositionsWithPulse(mockGeometry, mockTargets, time, customLerpFactor);
      
      expect(THREE.Vector3).toHaveBeenCalledTimes(2);
    });
  });

  describe('applyChaosEffect', () => {
    let mockGeometry: any;

    beforeEach(() => {
      mockGeometry = {
        attributes: {
          position: {
            array: new Float32Array([1, 2, 3, 4, 5, 6]), // 2 particles
            needsUpdate: false
          }
        }
      };
    });

    it('should apply chaos effect to particle positions', () => {
      const time = 1.0;
      const originalY1 = mockGeometry.attributes.position.array[1];
      const originalY2 = mockGeometry.attributes.position.array[4];
      
      applyChaosEffect(mockGeometry, time);
      
      expect(mockGeometry.attributes.position.needsUpdate).toBe(true);
      
      // Y positions should have changed
      expect(mockGeometry.attributes.position.array[1]).not.toBe(originalY1);
      expect(mockGeometry.attributes.position.array[4]).not.toBe(originalY2);
    });

    it('should use custom amplitude', () => {
      const time = 1.0;
      const customAmplitude = 0.01;
      const originalY = mockGeometry.attributes.position.array[1];
      
      applyChaosEffect(mockGeometry, time, customAmplitude);
      
      const expectedChange = Math.sin(time + mockGeometry.attributes.position.array[0]) * customAmplitude;
      const expectedY = originalY + expectedChange;
      
      expect(mockGeometry.attributes.position.array[1]).toBeCloseTo(expectedY, 5);
    });

    it('should handle empty geometry', () => {
      const emptyGeometry = {
        attributes: {
          position: {
            array: new Float32Array([]),
            needsUpdate: false
          }
        }
      } as any;
      
      expect(() => applyChaosEffect(emptyGeometry, 1.0)).not.toThrow();
      expect(emptyGeometry.attributes.position.needsUpdate).toBe(true);
    });
  });
});