
import * as THREE from 'three';
import { scene, camera } from './world.js';
import { setWindowLetterOpened, listenWindowLetter } from './firebase.js';

const frame = new THREE.Mesh(
  new THREE.PlaneGeometry(0.4, 0.5),
  new THREE.MeshStandardMaterial({ color: 0xd4b896, side: THREE.DoubleSide })
);
frame.position.set(-2.5, 0.9, -4.9);
scene.add(frame);

const glass = new THREE.Mesh(
  new THREE.PlaneGeometry(0.3, 0.4),
  new THREE.MeshStandardMaterial({ color: 0xeef2e8, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
);
glass.position.set(-2.5, 0.9, -4.88);
scene.add(glass);

let opened = false;
listenWindowLetter(val => {
  opened = val;
  glass.material.opacity = opened ? 0.2 : 0.6;
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onTap(clientX, clientY) {
  pointer.x = (clientX / innerWidth) * 2 - 1;
  pointer.y = -(clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([frame, glass]);
  if (hits.length && !opened) {
    setWindowLetterOpened(true);
    showLetter();
  }
}
addEventListener('click', e => onTap(e.clientX, e.clientY));
addEventListener('touchstart', e => {
  if (e.target.tagName === 'CANVAS') onTap(e.touches[0].clientX, e.touches[0].clientY);
});

function showLetter() {
  const div = document.createElement('div');
  div.textContent = "through frosted glass, a Victorian hand: 'my dearest...'";
  div.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);
  font-family:serif;font-style:italic;color:#5a4a42;background:rgba(238,242,232,0.9);
  padding:10px 20px;border-radius:4px;z-index:20;`;
  document.body.appendChild(div);
}
