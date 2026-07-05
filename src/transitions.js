import { camera, doorway } from './world.js';

export function updateTransitions() {
  const dist = camera.position.distanceTo(doorway.position);
  if (dist < 1) {
    camera.position.x += (15 - camera.position.x) * 0.02;
  }
}
