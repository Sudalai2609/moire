import * as THREE from 'three';
import { scene } from './world.js';

const pet = new THREE.Mesh(
  new THREE.SphereGeometry(0.15, 12, 12),
  new THREE.MeshStandardMaterial({ color: 0xdcb98a })
);
pet.position.set(0, 0.15, 2);
scene.add(pet);

let angle = 0;
export function updatePet(time) {
  angle = time * 0.3;
  pet.position.x = Math.sin(angle) * 1.5;
  pet.position.z = 2 + Math.cos(angle) * 1.5;
  pet.position.y = 0.15 + Math.sin(time * 2) * 0.02; // gentle bob
}
