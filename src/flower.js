import * as THREE from 'three';
import { scene, camera } from './world.js';
import { setFlowerPlaced, listenFlower } from './firebase.js';

const stem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.02, 0.02, 0.4),
  new THREE.MeshStandardMaterial({ color: 0x7a9b6e })
);
stem.position.set(-1.5, 0.2, 1.5);
scene.add(stem);

const bloom = new THREE.Mesh(
  new THREE.SphereGeometry(0.08, 12, 12),
  new THREE.MeshStandardMaterial({ color: 0xe8a5c0 })
);
bloom.position.set(-1.5, 0.42, 1.5);
scene.add(bloom);

let placed = true;
listenFlower(val => {
  placed = val;
  stem.visible = placed;
  bloom.visible = placed;
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onTap(clientX, clientY) {
  pointer.x = (clientX / innerWidth) * 2 - 1;
  pointer.y = -(clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([stem, bloom]);
  if (hits.length && placed) {
    setFlowerPlaced(false);
  }
}
addEventListener('click', e => onTap(e.clientX, e.clientY));
addEventListener('touchstart', e => {
  if (e.target.tagName === 'CANVAS') onTap(e.touches[0].clientX, e.touches[0].clientY);
});
