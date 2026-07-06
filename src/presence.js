import { light } from './world.js';
import { addMemoryNode } from './memorycorridor.js';

export let bothPresent = false;

export function togglePresence() {
  bothPresent = !bothPresent;
  if (bothPresent) addMemoryNode('we were both here');
}

export function updatePresence() {
  const targetIntensity = bothPresent ? 1.4 : 0.9;
  light.intensity += (targetIntensity - light.intensity) * 0.01;
}
