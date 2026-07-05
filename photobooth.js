import * as THREE from 'three';
import { scene, camera } from './world.js';

const frame = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 0.8, 0.05),
  new THREE.MeshStandardMaterial({ color: 0xe0c9a6 })
);
frame.position.set(3.5, 1, -4.9);
scene.add(frame);

const screen = new THREE.Mesh(
  new THREE.PlaneGeometry(0.5, 0.7),
  new THREE.MeshStandardMaterial({ color: 0x2a2a2a })
);
screen.position.set(3.5, 1, -4.87);
scene.add(screen);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onTap(clientX, clientY) {
  pointer.x = (clientX / innerWidth) * 2 - 1;
  pointer.y = -(clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([frame, screen]);
  if (hits.length) openBooth();
}
addEventListener('click', e => onTap(e.clientX, e.clientY));
addEventListener('touchstart', e => {
  if (e.target.tagName === 'CANVAS') onTap(e.touches[0].clientX, e.touches[0].clientY);
});

function openBooth() {
  alert('photobooth coming soon 📷');
}
