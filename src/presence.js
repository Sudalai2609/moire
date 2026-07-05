import { light } from './world.js';

// Placeholder until real multiplayer sync exists
export let bothPresent = false;

export function togglePresence() {
  bothPresent = !bothPresent;
}

export function updatePresence() {
  const targetIntensity = bothPresent ? 1.4 : 0.9;
  light.intensity += (targetIntensity - light.intensity) * 0.01;
}
