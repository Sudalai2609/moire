import { light } from './world.js';
import { addMemoryNode } from './memorycorridor.js';
import { setPresence, listenPresence } from './firebase.js';

// Temporary: each device picks a random-ish name until we add real login
const myId = localStorage.getItem('moireUserId') || (() => {
  const id = 'user_' + Math.random().toString(36).slice(2, 8);
  localStorage.setItem('moireUserId', id);
  return id;
})();

export let bothPresent = false;
let lastBoth = false;

setPresence(myId, true);
addEventListener('beforeunload', () => setPresence(myId, false));

listenPresence(presenceMap => {
  const activeUsers = Object.values(presenceMap).filter(v => v === true).length;
  bothPresent = activeUsers >= 2;
  if (bothPresent && !lastBoth) addMemoryNode('we were both here');
  lastBoth = bothPresent;
});

export function updatePresence() {
  const targetIntensity = bothPresent ? 1.4 : 0.9;
  light.intensity += (targetIntensity - light.intensity) * 0.01;
}
