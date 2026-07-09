import { sendSignal, listenSignal } from './firebase.js';

const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
let pc, dataChannel;

export async function startCall(isInitiator) {
  pc = new RTCPeerConnection(config);

  const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  showLocalVideo(localStream);
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  pc.ontrack = e => showRemoteVideo(e.streams[0]);

  pc.onicecandidate = e => {
    if (e.candidate) sendSignal('candidate_' + (isInitiator ? 'a' : 'b'), e.candidate.toJSON());
  };

  if (isInitiator) {
    dataChannel = pc.createDataChannel('chat');
    setupChannel(dataChannel);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendSignal('offer', offer);

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

    listenSignal('offer', async offer => {
      if (offer && !pc.currentRemoteDescription) {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSignal('answer', answer);
      }
    });
    listenSignal('candidate_a', candidate => {
      if (candidate) pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }
}

function showLocalVideo(stream) {
  const vid = document.createElement('video');
  vid.autoplay = true; vid.muted = true; vid.playsInline = true;
  vid.srcObject = stream;
  vid.style.cssText = 'position:fixed;bottom:80px;right:20px;width:100px;border-radius:10px;z-index:26;';
  vid.id = 'localVid';
  document.body.appendChild(vid);
}

function showRemoteVideo(stream) {
  const vid = document.createElement('video');
  vid.autoplay = true; vid.playsInline = true;
  vid.srcObject = stream;
  vid.style.cssText = 'position:fixed;top:20px;left:20px;width:200px;border-radius:10px;z-index:26;';
  vid.id = 'remoteVid';
  document.body.appendChild(vid);
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
