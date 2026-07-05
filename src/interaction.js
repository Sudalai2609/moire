import * as THREE from 'three';
import { scene, camera } from './world.js';

const note = new THREE.Mesh(
  new THREE.PlaneGeometry(0.3, 0.4),
  new THREE.MeshStandardMaterial({ color: 0xfaf3e8, side: THREE.DoubleSide })
);
note.rotation.x = -Math.PI / 2;
note.position.set(1.5, 0.01, 1.5);
scene.add(note);

const seal = new THREE.Mesh(
  new THREE.CircleGeometry(0.05, 16),
  new THREE.MeshStandardMaterial({ color: 0xb5495b })
);
seal.rotation.x = -Math.PI / 2;
seal.position.set(1.5, 0.02, 1.5);
scene.add(seal);

let noteOpen = false;
const state = JSON.parse(localStorage.getItem('moireState') || '{}');
if (state.noteOpen) {
  noteOpen = true;
  seal.visible = false;
  note.material.color.set(0xfffdf7);
}
function saveState() {
  localStorage.setItem('moireState', JSON.stringify({ noteOpen }));
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onTap(clientX, clientY) {
  pointer.x = (clientX / innerWidth) * 2 - 1;
  pointer.y = -(clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([note, seal]);
  if (hits.length && !noteOpen) {
    noteOpen = true;
    seal.visible = false;
    note.material.color.set(0xfffdf7);
    showNoteText();
    saveState();
  }
}
addEventListener('click', e => onTap(e.clientX, e.clientY));
addEventListener('touchstart', e => {
  if (e.target.tagName === 'CANVAS') onTap(e.touches[0].clientX, e.touches[0].clientY);
});

function showNoteText() {
  const div = document.createElement('div');
  div.textContent = "you found this. i love you.";
  div.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);
  font-family:serif;color:#5a4a42;background:rgba(255,253,247,0.9);padding:10px 20px;
  border-radius:8px;z-index:20;`;
  document.body.appendChild(div);
}
