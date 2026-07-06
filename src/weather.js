import * as THREE from 'three';
import { scene } from './world.js';

// Soft floating particles (dust/pollen-like ambience)
const particleCount = 60;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 1] = Math.random() * 3;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0xfff8ea,
  size: 0.02,
  transparent: true,
  opacity: 0.5
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

export function updateWeather(time) {
  const pos = particles.geometry.attributes.position;
  for (let i = 0; i < particleCount; i++) {
    pos.array[i * 3 + 1] += Math.sin(time + i) * 0.0003;
  }
  pos.needsUpdate = true;
  particles.rotation.y = time * 0.02;
}
