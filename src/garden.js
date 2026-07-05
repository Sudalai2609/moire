import * as THREE from 'three';
import { scene } from './world.js';

const trunk = new THREE.Mesh(
  new THREE.CylinderGeometry(0.15, 0.2, 1.5),
  new THREE.MeshStandardMaterial({ color: 0x8a6d5c })
);
trunk.position.set(15, 0.75, -1);
scene.add(trunk);

const leaves = new THREE.Mesh(
  new THREE.SphereGeometry(0.9, 12, 12),
  new THREE.MeshStandardMaterial({ color: 0x9bb583 })
);
leaves.position.set(15, 1.8, -1);
scene.add(leaves);

// gentle sway
export function updateGarden(time) {
  leaves.rotation.z = Math.sin(time * 0.5) * 0.03;
}
