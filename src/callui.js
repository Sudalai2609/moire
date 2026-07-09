import { startCall, sendMessage } from './call.js';
import { setCallState, listenCallState } from './firebase.js';

let callActive = false;
let iInitiated = false;

const btn = document.createElement('button');
btn.textContent = '📞';
btn.style.cssText = `position:fixed;bottom:20px;right:20px;width:50px;height:50px;
border-radius:50%;background:#c9a86a;border:none;color:white;font-size:20px;z-index:26;`;
document.body.appendChild(btn);

btn.onclick = () => {
  if (!callActive) {
    iInitiated = true;
    callActive = true;
    startCall(true);
    setCallState({ ringing: true, startedAt: Date.now() });
    btn.textContent = '💬';
  } else {
    sendChatPrompt();
  }
};

listenCallState(state => {
  if (state && state.ringing && !callActive && !iInitiated) {
    callActive = true;
    startCall(false);
    btn.textContent = '💬';
  }
});

function sendChatPrompt() {
  const text = prompt('message:');
  if (text) sendMessage(text);
}
