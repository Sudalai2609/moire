let started = false;
let audioCtx, gainNode, osc;

export function initAudio() {
  if (started) return;
  started = true;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.02; // very soft
  gainNode.connect(audioCtx.destination);

  osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 110; // low, warm hum
  osc.connect(gainNode);
  osc.start();
}

// Browsers require a user gesture to start audio
addEventListener('click', initAudio, { once: true });
addEventListener('touchstart', initAudio, { once: true });
