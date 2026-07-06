import * as THREE from 'three';
import { scene, camera } from './world.js';
import { addMemoryNode } from './memorycorridor.js';
import { setCandleLit, listenCandle } from './firebase.js';

const base = new THREE.Mesh(
  new THREE.CylinderGeometry(0.04, 0.04, 0.12),
  new THREE.MeshStandardMaterial({ color: 0xf0e8d0 })
);
base.position.set(-2, 0.06, 2);
scene.add(base);

const flame = new THREE.Mesh(
  new THREE.ConeGeometry(0.02, 0.06, 8),
  new THREE.MeshStandardMaterial({ color: 0xffb84d, emissive: 0xffb84d, emissiveIntensity: 0.8 })
);
flame.position.set(-2, 0.15, 2);
scene.add(flame);

let lit = true;
listenCandle(val => {
  lit = val;
  flame.visible = lit;
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onTap(clientX, clientY) {
  pointer.x = (clientX / innerWidth) * 2 - 1;
  pointer.y = -(clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([base, flame]);
  if (hits.length) {
    setCandleLit(!lit);
    addMemoryNode(!lit ? 'lit the candle' : 'blew out the candle');
  }
}
addEventListener('click', e => onTap(e.clientX, e.clientY));
addEventListener('touchstart', e => {
  if (e.target.tagName === 'CANVAS') onTap(e.touches[0].clientX, e.touches[0].clientY);
});

export function updateCandle(time) {
  if (lit) flame.scale.y = 1 + Math.sin(time * 8) * 0.1;
}
