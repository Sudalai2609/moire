import * as THREE from 'three';
import { scene } from './world.js';

// A row of small glowing markers - one per logged interaction
export function addMemoryNode(label) {
  const memories = JSON.parse(localStorage.getItem('moireMemories') || '[]');
  memories.push({ label, time: Date.now() });
  localStorage.setItem('moireMemories', JSON.stringify(memories));
  renderNodes();
}

function renderNodes() {
  const memories = JSON.parse(localStorage.getItem('moireMemories') || '[]');
  memories.forEach((mem, i) => {
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xf0d0a0, emissive: 0xf0d0a0, emissiveIntensity: 0.3 })
    );
    node.position.set(-15 + i * 0.3, 1, 4); // corridor near reading nook
    scene.add(node);
  });
}

renderNodes();
