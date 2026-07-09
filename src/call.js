import { sendSignal, listenSignal } from './firebase.js';

const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
let pc, dataChannel;

export function startCall(isInitiator) {
  pc = new RTCPeerConnection(config);

  pc.onicecandidate = e => {
    if (e.candidate) sendSignal('candidate_' + (isInitiator ? 'a' : 'b'), e.candidate.toJSON());
  };

  if (isInitiator) {
    dataChannel = pc.createDataChannel('chat');
    setupChannel(dataChannel);

    pc.createOffer().then(offer => {
      pc.setLocalDescription(offer);
      sendSignal('offer', offer);
    });

    listenSignal('answer', answer => {
      if (answer && !pc.currentRemoteDescription) {
        pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    listenSignal('candidate_b', candidate => {
      if (candidate) pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

  } else {
    pc.ondatachannel = e => {
      dataChannel = e.channel;
      setupChannel(dataChannel);
    };

    listenSignal('offer', offer => {
      if (offer && !pc.currentRemoteDescription) {
        pc.setRemoteDescription(new RTCSessionDescription(offer));
        pc.createAnswer().then(answer => {
          pc.setLocalDescription(answer);
          sendSignal('answer', answer);
        });
      }
    });

    listenSignal('candidate_a', candidate => {
      if (candidate) pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }
}

function setupChannel(channel) {
  channel.onopen = () => console.log('chat connected');
  channel.onmessage = e => showMessage(e.data, false);
}

export function sendMessage(text) {
  if (dataChannel && dataChannel.readyState === 'open') {
    dataChannel.send(text);
    showMessage(text, true);
  }
}

function showMessage(text, isMine) {
  let box = document.getElementById('chatBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'chatBox';
    box.style.cssText = `position:fixed;bottom:150px;left:20px;width:250px;max-height:200px;
    overflow-y:auto;background:rgba(255,253,247,0.9);border-radius:10px;padding:10px;
    font-family:serif;font-size:14px;z-index:25;`;
    document.body.appendChild(box);
  }
  const msg = document.createElement('div');
  msg.textContent = (isMine ? 'you: ' : 'them: ') + text;
  msg.style.marginBottom = '5px';
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
          }
