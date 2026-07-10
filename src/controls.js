import * as THREE from 'three';
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

let velocityX = 0, velocityZ = 0;
const accel = 0.008;
const friction = 0.85;
const maxSpeed = 0.06;

export function updateMovement() {
  let inputX = 0, inputZ = 0;
  if (keys['w']) inputZ -= 1;
  if (keys['s']) inputZ += 1;
  if (keys['a']) inputX -= 1;
  if (keys['d']) inputX += 1;
  inputX += joystick.dx;
  inputZ += joystick.dy;

  const yaw = camera.rotation.y;
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

  const desiredX = (forward.x * -inputZ + right.x * inputX);
  const desiredZ = (forward.z * -inputZ + right.z * inputX);

  velocityX += desiredX * accel;
  velocityZ += desiredZ * accel;
  velocityX *= friction;
  velocityZ *= friction;

  const speed = Math.hypot(velocityX, velocityZ);
  if (speed > maxSpeed) {
    velocityX = (velocityX / speed) * maxSpeed;
    velocityZ = (velocityZ / speed) * maxSpeed;
  }

  const targetX = camera.position.x + velocityX;
  const targetZ = camera.position.z + velocityZ;

  const withinRoom = targetX > -4.8 && targetX < 4.8 && targetZ > -4.8 && targetZ < 5.2;
  const inCorridor = Math.abs(targetZ) < 1.5;

  if (withinRoom || inCorridor) {
    camera.position.x = targetX;
    camera.position.z = targetZ;
  } else {
    velocityX = 0;
    velocityZ = 0;
  }
}
