import { camera } from './world.js';

let yaw = 0, pitch = 0;
let dragging = false, lastX = 0, lastY = 0;
let lookTouchId = null;

function isLookZone(x) {
  return x > innerWidth / 2;
}

addEventListener('touchstart', e => {
  const t = Array.from(e.changedTouches).find(t => isLookZone(t.clientX));
  if (t) {
    lookTouchId = t.identifier;
    dragging = true;
    lastX = t.clientX;
    lastY = t.clientY;
  }
}, { passive: false });

addEventListener('touchmove', e => {
  if (!dragging) return;
  const t = Array.from(e.touches).find(t => t.identifier === lookTouchId);
  if (!t) return;
  e.preventDefault();
  const dx = t.clientX - lastX;
  const dy = t.clientY - lastY;
  const sens = (parseInt(localStorage.getItem('moireSensitivity')) || 5) / 5000;
  yaw -= dx * sens;
  pitch -= dy * sens;
  pitch = Math.max(-1.2, Math.min(1.2, pitch));
  lastX = t.clientX;
  lastY = t.clientY;
}, { passive: false });

addEventListener('touchend', e => {
  const stillDown = Array.from(e.touches).some(t => t.identifier === lookTouchId);
  if (!stillDown) dragging = false;
});

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
  const sens = (parseInt(localStorage.getItem('moireSensitivity')) || 5) / 5000;
  yaw -= dx * sens;
  pitch -= dy * sens;
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
