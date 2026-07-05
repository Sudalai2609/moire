import * as THREE from 'three';
import { scene, camera } from './world.js';

const box = new THREE.Mesh(
  new THREE.BoxGeometry(0.3, 0.2, 0.2),
  new THREE.MeshStandardMaterial({ color: 0xc9a86a })
);
box.position.set(-1.5, 0.1, -1.5);
scene.add(box);

function getSaved() {
  return JSON.parse(localStorage.getItem('moireLetterbox') || '[]');
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onTap(clientX, clientY) {
  pointer.x = (clientX / innerWidth) * 2 - 1;
  pointer.y = -(clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(box);
  if (hits.length) openLetterbox();
}
addEventListener('click', e => onTap(e.clientX, e.clientY));
addEventListener('touchstart', e => {
  if (e.target.tagName === 'CANVAS') onTap(e.touches[0].clientX, e.touches[0].clientY);
});

function openLetterbox() {
  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(240,230,220,0.95);z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:serif;color:#5a4a42;';

  const list = getSaved().map(n => '<p>' + n + '</p>').join('');
  panel.innerHTML = '<div style="max-width:80%">' + list + '</div>' +
    '<textarea id="noteInput" placeholder="leave a note..." style="margin-top:20px;padding:10px;width:250px;height:80px;border-radius:8px;border:1px solid #c9a86a;font-family:serif;"></textarea>' +
    '<button id="saveNote" style="margin-top:10px;padding:8px 20px;border-radius:8px;background:#c9a86a;border:none;color:white;">leave it</button>' +
    '<button id="closeBox" style="margin-top:10px;background:none;border:none;color:#8a7a70;">close</button>';

  document.body.appendChild(panel);
  panel.querySelector('#saveNote').onclick = function() {
    const val = panel.querySelector('#noteInput').value.trim();
    if (val) {
      const notes = getSaved();
      notes.push(val);
      localStorage.setItem('moireLetterbox', JSON.stringify(notes));
    }
    document.body.removeChild(panel);
  };
  panel.querySelector('#closeBox').onclick = function() {
    document.body.removeChild(panel);
  };
}
