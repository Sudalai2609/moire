let started = false;
let audioCtx, gainNode, osc;

export function initAudio() {
  if (started) return;
  if (localStorage.getItem('moireSound') === 'off') return;
  started = true;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.02;
  gainNode.connect(audioCtx.destination);

  osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 110;
  osc.connect(gainNode);
  osc.start();
}

addEventListener('click', initAudio, { once: true });
addEventListener('touchstart', initAudio, { once: true });
