import { camera, doorway } from './world.js';

export function updateTransitions() {
  const dist = camera.position.distanceTo(doorway.position);
  if (dist < 1) {
    camera.position.x += (15 - camera.position.x) * 0.02;
  }
}

import { camera, doorway, doorway2 } from './world.js';

export function updateTransitions() {
  const dist1 = camera.position.distanceTo(doorway.position);
  if (dist1 < 1) {
    camera.position.x += (15 - camera.position.x) * 0.02;
  }
  const dist2 = camera.position.distanceTo(doorway2.position);
  if (dist2 < 1) {
    camera.position.x += (-15 - camera.position.x) * 0.02;
  }
}
