import { login, onAuthChange } from './firebase.js';

export function showLogin(onSuccess) {
  onAuthChange(user => {
    if (user) {
      document.getElementById('loginScreen')?.remove();
      onSuccess(user);
    }
  });

  const div = document.createElement('div');
  div.id = 'loginScreen';
  div.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;
  background:linear-gradient(135deg,#f5e6d8,#e8d5e0,#d8e0e8);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  font-family:serif;z-index:100;`;

  div.addEventListener('touchstart', e => e.stopPropagation());
  div.addEventListener('click', e => e.stopPropagation());

  div.innerHTML = `
    <h1 style="color:#6a5a52;font-weight:normal;margin-bottom:20px;">moiré</h1>
    <input id="emailInput" type="email" placeholder="email" style="padding:10px;margin:5px;border-radius:8px;border:1px solid #c9a86a;width:200px;">
    <div style="position:relative;">
      <input id="passInput" type="password" placeholder="password" style="padding:10px;margin:5px;border-radius:8px;border:1px solid #c9a86a;width:200px;">
      <span id="togglePass" style="position:absolute;right:10px;top:14px;cursor:pointer;color:#8a7a70;font-size:12px;">show</span>
    </div>
    <button id="loginBtn" style="margin-top:15px;padding:10px 30px;border-radius:8px;background:#c9a86a;border:none;color:white;">enter</button>
    <p id="loginError" style="color:#b5495b;margin-top:10px;"></p>
  `;
  document.body.appendChild(div);

  document.getElementById('loginBtn').onclick = () => {
    const email = document.getElementById('emailInput').value;
    const pass = document.getElementById('passInput').value;
    login(email, pass).catch(err => {
      document.getElementById('loginError').textContent = 'wrong email or password';
    });
  };

  document.getElementById('togglePass').onclick = () => {
    const p = document.getElementById('passInput');
    const t = document.getElementById('togglePass');
    p.type = p.type === 'password' ? 'text' : 'password';
    t.textContent = p.type === 'password' ? 'show' : 'hide';
  };
}
