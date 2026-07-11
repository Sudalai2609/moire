export function showExitButton(onExit) {
  const btn = document.createElement('button');
  btn.textContent = '☰';
  btn.style.cssText = `position:fixed;top:20px;left:20px;width:44px;height:44px;
  border-radius:50%;background:rgba(255,255,255,0.25);border:1px solid rgba(255,255,255,0.4);
  color:#5a4a42;font-size:18px;z-index:26;`;
  document.body.appendChild(btn);

  btn.onclick = () => {
    const confirmPanel = document.createElement('div');
    confirmPanel.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(40,35,32,0.85);z-index:96;display:flex;flex-direction:column;
    align-items:center;justify-content:center;font-family:serif;color:#f5e8d8;`;
    confirmPanel.innerHTML = `
      <p>leave the world?</p>
      <button id="confirmExit" style="margin:8px;padding:10px 24px;border-radius:8px;background:#b5495b;border:none;color:white;">yes</button>
      <button id="cancelExit" style="margin:8px;padding:10px 24px;border-radius:8px;background:none;border:1px solid #c9a86a;color:#c9a86a;">stay</button>
    `;
    document.body.appendChild(confirmPanel);

    document.getElementById('confirmExit').onclick = () => {
      confirmPanel.remove();
      btn.remove();
      onExit();
    };
    document.getElementById('cancelExit').onclick = () => confirmPanel.remove();
  };
}
