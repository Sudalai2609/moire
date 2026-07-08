import { light } from './world.js';
import { addMemoryNode } from './memorycorridor.js';
import { setPresence, listenPresence, auth } from './firebase.js';

export let bothPresent = false;
let lastBoth = false;

if (auth.currentUser) {
  setPresence(auth.currentUser.uid, true);
  addEventListener('beforeunload', () => setPresence(auth.currentUser.uid, false));
}

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
