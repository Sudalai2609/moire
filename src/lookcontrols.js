import { camera } from './world.js';

let yaw = 0, pitch = 0;
let dragging = false, lastX = 0, lastY = 0;

function isLookZone(x) {
  return x > innerWidth / 2; // right half of screen = look
}

addEventListener('touchstart', e => {
  const t = e.touches[0];
  if (isLookZone(t.clientX)) {
    dragging = true;
    lastX = t.clientX;
    lastY = t.clientY;
  }
});
addEventListener('touchmove', e => {
  if (!dragging) return;
  const t = e.touches[0];
  const dx = t.clientX - lastX;
  const dy = t.clientY - lastY;
  yaw -= dx * 0.005;
  pitch -= dy * 0.005;
  pitch = Math.max(-1.2, Math.min(1.2, pitch));
  lastX = t.clientX;
  lastY = t.clientY;
});
addEventListener('touchend', () => dragging = false);

// Mouse (desktop)
addEventListener('mousedown', e => {
  if (isLookZone(e.clientX)) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  }
});
addEventListener('mousemove', e => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  yaw -= dx * 0.005;
  pitch -= dy * 0.005;
  pitch = Math.max(-1.2, Math.min(1.2, pitch));
  lastX = e.clientX;
  lastY = e.clientY;
});
addEventListener('mouseup', () => dragging = false);

export function updateLook() {
  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
}

addEventListener('touchstart', e => {
  const t = e.touches[0];
  if (isLookZone(t.clientX)) {
    dragging = true;
    lastX = t.clientX;
    lastY = t.clientY;
  }
}, { passive: false });

addEventListener('touchmove', e => {
  if (!dragging) return;
  e.preventDefault();
  const t = e.touches[0];
  const dx = t.clientX - lastX;
  const dy = t.clientY - lastY;
  yaw -= dx * 0.005;
  pitch -= dy * 0.005;
  pitch = Math.max(-1.2, Math.min(1.2, pitch));
  lastX = t.clientX;
  lastY = t.clientY;
}, { passive: false });

addEventListener('touchend', () => dragging = false);
