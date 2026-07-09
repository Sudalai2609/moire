import { startCall, sendMessage, endCall, toggleMute } from './call.js';
import { setCallState, listenCallState } from './firebase.js';

let callActive = false;
let iInitiated = false;

const btn = document.createElement('button');
btn.textContent = '📞';
btn.style.cssText = `position:fixed;bottom:20px;right:20px;width:50px;height:50px;
border-radius:50%;background:#c9a86a;border:none;color:white;font-size:20px;z-index:26;`;
document.body.appendChild(btn);

const hangupBtn = document.createElement('button');
hangupBtn.textContent = '✖';
hangupBtn.style.cssText = `position:fixed;bottom:20px;right:80px;width:40px;height:40px;
border-radius:50%;background:#b5495b;border:none;color:white;display:none;z-index:26;`;
document.body.appendChild(hangupBtn);

const muteBtn = document.createElement('button');
muteBtn.textContent = '🎤';
muteBtn.style.cssText = `position:fixed;bottom:20px;right:130px;width:40px;height:40px;
border-radius:50%;background:#8a7a70;border:none;color:white;display:none;z-index:26;`;
document.body.appendChild(muteBtn);

btn.onclick = () => {
  if (!callActive) {
    iInitiated = true;
    callActive = true;
    startCall(true);
    setCallState({ ringing: true, startedAt: Date.now() });
    enterCallMode();
  } else {
    sendChatPrompt();
  }
};

hangupBtn.onclick = () => {
  endCall();
  callActive = false;
  iInitiated = false;
  setCallState({ ringing: false });
  exitCallMode();
};

muteBtn.onclick = () => {
  const enabled = toggleMute();
  muteBtn.textContent = enabled ? '🎤' : '🔇';
};

listenCallState(state => {
  if (state && state.ringing && !callActive && !iInitiated) {
    callActive = true;
    startCall(false);
    enterCallMode();
  }
  if (state && !state.ringing && callActive) {
    endCall();
    callActive = false;
    exitCallMode();
  }
});

function enterCallMode() {
  btn.textContent = '💬';
  hangupBtn.style.display = 'block';
  muteBtn.style.display = 'block';
}
function exitCallMode() {
  btn.textContent = '📞';
  hangupBtn.style.display = 'none';
  muteBtn.style.display = 'none';
}

function sendChatPrompt() {
  const text = prompt('message:');
  if (text) sendMessage(text);
}
