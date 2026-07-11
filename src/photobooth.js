
import * as THREE from 'three';
import { scene, camera } from './world.js';
import { savePhotoStrip, listenPhotoStrip } from './firebase.js';

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
let boothOpen = false;

function onTap(clientX, clientY) {
  if (boothOpen) return;
  pointer.x = (clientX / innerWidth) * 2 - 1;
  pointer.y = -(clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([frame, screen]);
  if (hits.length) {
    boothOpen = true;
    openBooth();
  }
}
addEventListener('click', e => onTap(e.clientX, e.clientY));
addEventListener('touchstart', e => {
  if (e.target.tagName === 'CANVAS') onTap(e.touches[0].clientX, e.touches[0].clientY);
});

function applyVintageFilter(ctx, w, h) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i+1], b = d[i+2];
    d[i]   = Math.min(255, r * 0.9 + 20);
    d[i+1] = Math.min(255, g * 0.8 + 15);
    d[i+2] = Math.min(255, b * 0.7 + 10);
  }
  ctx.putImageData(imgData, 0, 0);
}

function openBooth() {
  const shotCount = parseInt(prompt('how many photos? (e.g. 3)', '3')) || 3;
  const countdownSec = parseInt(prompt('countdown seconds? (e.g. 3)', '3')) || 3;

  const panel = document.createElement('div');
  panel.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;
  background:rgba(30,25,22,0.95);z-index:30;display:flex;flex-direction:column;
  align-items:center;justify-content:center;font-family:serif;color:#f5e8d8;`;

  panel.innerHTML = `
    <video id="camPreview" autoplay playsinline style="width:220px;height:165px;border-radius:12px;background:#000;"></video>
    <div id="countdownText" style="font-size:40px;margin-top:10px;"></div>
    <canvas id="shotCanvas" width="220" height="165" style="display:none;"></canvas>
    <canvas id="stripCanvas" style="display:none;"></canvas>
    <img id="stripResult" style="max-width:220px;border-radius:8px;display:none;">
    <div style="margin-top:15px;">
      <button id="startBtn" style="padding:10px 20px;border-radius:8px;background:#c9a86a;border:none;color:white;margin:5px;">start</button>
      <button id="closeBtn" style="padding:10px 20px;border-radius:8px;background:none;border:1px solid #c9a86a;color:#c9a86a;margin:5px;">close</button>
    </div>
  `;
  document.body.appendChild(panel);

  const video = panel.querySelector('#camPreview');
  const countdownText = panel.querySelector('#countdownText');
  const shotCanvas = panel.querySelector('#shotCanvas');
  const stripCanvas = panel.querySelector('#stripCanvas');
  const stripResult = panel.querySelector('#stripResult');
  let stream;
  const shots = [];

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => { stream = s; video.srcObject = s; })
    .catch(() => { panel.querySelector('#startBtn').textContent = 'camera unavailable'; });

  panel.querySelector('#startBtn').onclick = () => takeShots();
  panel.querySelector('#closeBtn').onclick = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    document.body.removeChild(panel);
    boothOpen = false;
  };

  function takeShots() {
    shots.length = 0;
    let shotIndex = 0;
    nextShot();

    function nextShot() {
      if (shotIndex >= shotCount) { buildStrip(); return; }
      let t = countdownSec;
      countdownText.textContent = t;
      const timer = setInterval(() => {
        t--;
        if (t > 0) {
          countdownText.textContent = t;
        } else {
          clearInterval(timer);
          countdownText.textContent = '📸';
          const ctx = shotCanvas.getContext('2d');
          ctx.drawImage(video, 0, 0, shotCanvas.width, shotCanvas.height);
          applyVintageFilter(ctx, shotCanvas.width, shotCanvas.height);
          shots.push(shotCanvas.toDataURL('image/jpeg', 0.6));
          shotIndex++;
          setTimeout(nextShot, 600);
        }
      }, 1000);
    }
  }

  function buildStrip() {
    countdownText.textContent = '';
    const w = 220, h = 165, gap = 8;
    stripCanvas.width = w;
    stripCanvas.height = (h + gap) * shots.length + gap;
    const ctx = stripCanvas.getContext('2d');
    ctx.fillStyle = '#f5e8d8';
    ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

    let loaded = 0;
    shots.forEach((shotUrl, i) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, gap + i * (h + gap), w, h);
        loaded++;
        if (loaded === shots.length) finishStrip();
      };
      img.src = shotUrl;
    });
  }

  function finishStrip() {
    const finalUrl = stripCanvas.toDataURL('image/jpeg', 0.5);
    stripResult.src = finalUrl;
    stripResult.style.display = 'block';
    video.style.display = 'none';
    savePhotoStrip(finalUrl);
  }
}

listenPhotoStrip(imageUrl => {
  // Available for future use: e.g. showing last strip somewhere in the world
});
