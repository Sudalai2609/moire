import * as THREE from 'three';
import { scene, camera } from './world.js';

const body = new THREE.Mesh(
  new THREE.SphereGeometry(0.18, 12, 12),
  new THREE.MeshStandardMaterial({ color: 0xe8c9d8 })
);
body.position.set(2, 0.18, -1);
scene.add(body);

const ear1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.05, 8, 8),
  new THREE.MeshStandardMaterial({ color: 0xe8c9d8 })
);
ear1.position.set(1.92, 0.3, -1);
scene.add(ear1);

const ear2 = ear1.clone();
ear2.position.set(2.08, 0.3, -1);
scene.add(ear2);

let hugged = false;
const state = JSON.parse(localStorage.getItem('moirePlushie') || '{}');
if (state.hugged) { hugged = true; body.scale.set(1.15, 1.15, 1.15); }

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onTap(clientX, clientY) {
  pointer.x = (clientX / innerWidth) * 2 - 1;
  pointer.y = -(clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([body, ear1, ear2]);
  if (hits.length) {
    hugged = !hugged;
    body.scale.set(hugged ? 1.15 : 1, hugged ? 1.15 : 1, hugged ? 1.15 : 1);
    localStorage.setItem('moirePlushie', JSON.stringify({ hugged }));
  }
}
addEventListener('click', e => onTap(e.clientX, e.clientY));
addEventListener('touchstart', e => {
  if (e.target.tagName === 'CANVAS') onTap(e.touches[0].clientX, e.touches[0].clientY);
});
