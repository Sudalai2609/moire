import { camera, doorway, doorway2 } from './world.js';

let fading = false;
const fadeOverlay = document.createElement('div');
fadeOverlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;
background:#fff8f0;opacity:0;pointer-events:none;transition:opacity 0.8s;z-index:50;`;
document.body.appendChild(fadeOverlay);

export function updateTransitions() {
  const dist1 = camera.position.distanceTo(doorway.position);
  const dist2 = camera.position.distanceTo(doorway2.position);

  if ((dist1 < 1 || dist2 < 1) && !fading) {
    fading = true;
    fadeOverlay.style.opacity = '0.6';
    setTimeout(() => {
      fadeOverlay.style.opacity = '0';
      setTimeout(() => fading = false, 800);
    }, 400);
  }

  if (dist1 < 1) camera.position.x += (15 - camera.position.x) * 0.02;
  if (dist2 < 1) camera.position.x += (-15 - camera.position.x) * 0.02;
}
