
import * as THREE from 'three';
import { scene, camera } from './world.js';
import { setBouquetChoice } from './firebase.js';

const colors = [0xe8a5c0, 0xf0d060, 0xb8a0e0, 0x9bc9e8];
const flowers = [];

colors.forEach((color, i) => {
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x7a9b6e })
  );
  stem.position.set(-3 + i * 0.3, 0.15, -3);
  scene.add(stem);

  const bloom = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 10, 10),
    new THREE.MeshStandardMaterial({ color })
  );
  bloom.position.set(-3 + i * 0.3, 0.32, -3);
  scene.add(bloom);

  flowers.push({ stem, bloom, color });
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onTap(clientX, clientY) {
  pointer.x = (clientX / innerWidth) * 2 - 1;
  pointer.y = -(clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const meshes = flowers.flatMap(f => [f.stem, f.bloom]);
  const hits = raycaster.intersectObjects(meshes);
  if (hits.length) {
    const picked = flowers.find(f => f.stem === hits[0].object || f.bloom === hits[0].object);
    setBouquetChoice(picked.color);
    alert('flower chosen 🌸');
  }
}
addEventListener('click', e => onTap(e.clientX, e.clientY));
addEventListener('touchstart', e => {
  if (e.target.tagName === 'CANVAS') onTap(e.touches[0].clientX, e.touches[0].clientY);
});
