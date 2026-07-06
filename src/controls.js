import { camera } from './world.js';

const keys = {};
addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

const joystick = { dx: 0, dy: 0, active: false, startX: 0, startY: 0 };

const base = document.createElement('div');
base.style.cssText = `position:fixed;left:30px;bottom:30px;width:100px;height:100px;
border-radius:50%;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);z-index:10;`;
document.body.appendChild(base);

const knob = document.createElement('div');
knob.style.cssText = `position:fixed;left:30px;bottom:30px;width:100px;height:100px;
display:flex;align-items:center;justify-content:center;z-index:11;pointer-events:none;`;
const dot = document.createElement('div');
dot.style.cssText = `width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.4);`;
knob.appendChild(dot);
document.body.appendChild(knob);

base.addEventListener('touchstart', e => {
  joystick.active = true;
  joystick.startX = e.touches[0].clientX;
  joystick.startY = e.touches[0].clientY;
});
addEventListener('touchmove', e => {
  if (!joystick.active) return;
  const t = e.touches[0];
  let dx = t.clientX - joystick.startX;
  let dy = t.clientY - joystick.startY;
  const max = 40;
  const dist = Math.min(Math.hypot(dx, dy), max);
  const angle = Math.atan2(dy, dx);
  dx = Math.cos(angle) * dist;
  dy = Math.sin(angle) * dist;
  dot.style.transform = `translate(${dx}px, ${dy}px)`;
  joystick.dx = dx / max;
  joystick.dy = dy / max;
});
addEventListener('touchend', () => {
  joystick.active = false;
  joystick.dx = 0;
  joystick.dy = 0;
  dot.style.transform = `translate(0,0)`;
});

export function updateMovement() {
  const speed = 0.05;
  const nx = camera.position.x, nz = camera.position.z;
  let moveX = 0, moveZ = 0;
  if (keys['w']) moveZ -= speed;
  if (keys['s']) moveZ += speed;
  if (keys['a']) moveX -= speed;
  if (keys['d']) moveX += speed;
  moveX += joystick.dx * speed;
  moveZ += joystick.dy * speed;

  const targetX = camera.position.x + moveX;
  const targetZ = camera.position.z + moveZ;

  // Simple bounds: stay within room unless near a doorway (x -20 to 20 wide corridor)
  const withinRoom = targetX > -4.8 && targetX < 4.8 && targetZ > -4.8 && targetZ < 4.8;
  const inCorridor = Math.abs(targetZ) < 1.5; // doorway width

  if (withinRoom || inCorridor) {
    camera.position.x = targetX;
    camera.position.z = targetZ;
  }
}
