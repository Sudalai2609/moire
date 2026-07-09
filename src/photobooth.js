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
  const panel = document.createElement('div');
  panel.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;
  background:rgba(30,25,22,0.95);z-index:30;display:flex;flex-direction:column;
  align-items:center;justify-content:center;font-family:serif;color:#f5e8d8;`;

  panel.innerHTML = `
    <video id="camPreview" autoplay playsinline style="width:280px;height:210px;border-radius:12px;background:#000;"></video>
    <canvas id="camCanvas" width="280" height="210" style="display:none;"></canvas>
    <img id="camResult" style="width:280px;border-radius:12px;display:none;">
    <div style="margin-top:15px;">
      <button id="snapBtn" style="padding:10px 20px;border-radius:8px;background:#c9a86a;border:none;color:white;margin:5px;">capture</button>
      <button id="closeBtn" style="padding:10px 20px;border-radius:8px;background:none;border:1px solid #c9a86a;color:#c9a86a;margin:5px;">close</button>
    </div>
  `;
  document.body.appendChild(panel);

  const video = panel.querySelector('#camPreview');
  const canvas = panel.querySelector('#camCanvas');
  const resultImg = panel.querySelector('#camResult');
  let stream;

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => { stream = s; video.srcObject = s; })
    .catch(() => { panel.querySelector('#snapBtn').textContent = 'camera unavailable'; });

  panel.querySelector('#snapBtn').onclick = () => {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    resultImg.src = dataUrl;
    resultImg.style.display = 'block';
    video.style.display = 'none';
    localStorage.setItem('moireLastPhoto', dataUrl);
  };

  panel.querySelector('#closeBtn').onclick = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    document.body.removeChild(panel);
  };
}
