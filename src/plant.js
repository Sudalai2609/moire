import * as THREE from 'three';
import { scene } from './world.js';

const pot = new THREE.Mesh(
  new THREE.CylinderGeometry(0.1, 0.08, 0.15),
  new THREE.MeshStandardMaterial({ color: 0xa87858 })
);
pot.position.set(0.5, 0.075, -1.5);
scene.add(pot);

const stem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.01, 0.01, 0.1),
  new THREE.MeshStandardMaterial({ color: 0x6a9b5e })
);
stem.position.set(0.5, 0.2, -1.5);
scene.add(stem);

// Load saved growth (in cm-ish scale, grows slowly over real days)
const state = JSON.parse(localStorage.getItem('moirePlant') || '{}');
let plantedAt = state.plantedAt || Date.now();
if (!state.plantedAt) {
  localStorage.setItem('moirePlant', JSON.stringify({ plantedAt }));
}

export function updatePlant() {
  const daysGrown = (Date.now() - plantedAt) / (1000 * 60 * 60 * 24);
  const growth = Math.min(daysGrown * 0.05, 1); // caps at full size after ~20 days
  stem.scale.y = 1 + growth * 3;
  stem.position.y = 0.2 + growth * 0.15;
}
