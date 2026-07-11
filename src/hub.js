import { auth } from './firebase.js';
import { signOut } from 'firebase/auth';

export function showHub(onEnter) {
  const div = document.createElement('div');
  div.id = 'hubScreen';
  div.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;
  background:linear-gradient(135deg,#f5e6d8,#e8d5e0,#d8e0e8);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  font-family:serif;z-index:90;`;

  div.innerHTML = `
    <h1 style="color:#6a5a52;font-weight:normal;font-size:36px;letter-spacing:2px;">moiré</h1>
    <p style="color:#8a7a70;margin-bottom:40px;font-style:italic;">a home for two</p>
    <button id="playBtn" style="padding:14px 50px;border-radius:10px;background:#c9a86a;border:none;color:white;font-size:16px;margin:6px;">play</button>
    <button id="settingsBtn" style="padding:10px 30px;border-radius:10px;background:none;border:1px solid #c9a86a;color:#c9a86a;margin:6px;">settings</button>
    <button id="quitBtn" style="padding:10px 30px;border-radius:10px;background:none;border:1px solid #8a7a70;color:#8a7a70;margin:6px;">quit</button>
  `;
  document.body.appendChild(div);

  document.getElementById('playBtn').onclick = () => {
    div.remove();
    onEnter();
  };
  document.getElementById('settingsBtn').onclick = () => showSettings();
  document.getElementById('quitBtn').onclick = () => {
    signOut(auth).then(() => location.reload());
  };
}

function showSettings() {
  const panel = document.createElement('div');
  panel.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;
  background:rgba(40,35,32,0.92);z-index:95;display:flex;flex-direction:column;
  align-items:center;justify-content:center;font-family:serif;color:#f5e8d8;`;

  const soundOn = localStorage.getItem('moireSound') !== 'off';

  panel.innerHTML = `
    <h2 style="font-weight:normal;letter-spacing:1px;">settings</h2>
    <label style="margin:12px;"><input type="checkbox" id="soundToggle" ${soundOn ? 'checked' : ''}> sound</label>
    <label style="margin:12px;">graphics quality
      <select id="gfxSelect" style="margin-left:8px;padding:4px;border-radius:6px;">
        <option value="low">low</option>
        <option value="medium" selected>medium</option>
        <option value="high">high</option>
      </select>
    </label>
    <label style="margin:12px;">look sensitivity
      <input type="range" id="sensSlider" min="1" max="10" value="5" style="margin-left:8px;">
    </label>
    <button id="logoutBtn" style="margin-top:20px;padding:10px 30px;border-radius:8px;background:#b5495b;border:none;color:white;">log out</button>
    <button id="closeSettings" style="margin-top:10px;background:none;border:none;color:#c9a86a;">close</button>
  `;
  document.body.appendChild(panel);

  document.getElementById('soundToggle').onchange = (e) => {
    localStorage.setItem('moireSound', e.target.checked ? 'on' : 'off');
  };
  document.getElementById('gfxSelect').onchange = (e) => {
    localStorage.setItem('moireGraphics', e.target.value);
  };
  document.getElementById('sensSlider').oninput = (e) => {
    localStorage.setItem('moireSensitivity', e.target.value);
  };
  document.getElementById('logoutBtn').onclick = () => {
    signOut(auth).then(() => location.reload());
  };
  document.getElementById('closeSettings').onclick = () => panel.remove();
}
