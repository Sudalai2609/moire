import * as THREE from 'three';
import { scene, camera } from './world.js';
import { listenMilestone } from './firebase.js';

const drawer = new THREE.Mesh(
  new THREE.BoxGeometry(0.4, 0.25, 0.3),
  new THREE.MeshStandardMaterial({ color: 0xa88a6a })
);
drawer.position.set(-3.5, 0.5, 3.5);
scene.add(drawer);

let unlockDate = new Date('2026-08-01');
listenMilestone(dateStr => {
  unlockDate = new Date(dateStr);
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onTap(clientX, clientY) {
  pointer.x = (clientX / innerWidth) * 2 - 1;
  pointer.y = -(clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(drawer);
  if (hits.length) {
    const now = new Date();
    if (now >= unlockDate) {
      alert('a gift was waiting for you 🎁');
    } else {
      alert('this drawer is waiting for its day...');
    }
  }
}
addEventListener('click', e => onTap(e.clientX, e.clientY));
addEventListener('touchstart', e => {
  if (e.target.tagName === 'CANVAS') onTap(e.touches[0].clientX, e.touches[0].clientY);
});
