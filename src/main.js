import * as THREE from 'three';

// --- Scene setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe8ddd0);

const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// --- Lighting ---
const light = new THREE.HemisphereLight(0xfff0e0, 0x444444, 1);
scene.add(light);

let t = 0;
function updateLight() {
  t += 0.001;
  const warmth = (Math.sin(t) + 1) / 2;
  light.color.setHSL(0.09, 0.5, 0.75 + warmth * 0.1);
  light.intensity = 0.9 + warmth * 0.3;
}

// --- Room geometry ---
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0xd8c9b0 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const wallMat = new THREE.MeshStandardMaterial({ color: 0xf2e8dc });
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallMat);
backWall.position.set(0, 2, -5);
scene.add(backWall);

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallMat);
leftWall.position.set(-5, 2, 0);
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

// --- Doorway + Garden ---
const doorway = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 3),
  new THREE.MeshBasicMaterial({ color: 0xfff8f0, transparent: true, opacity: 0.3 })
);
doorway.position.set(5, 1.5, 0);
doorway.rotation.y = -Math.PI / 2;
scene.add(doorway);

const gardenFloor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0xb8c9a8 })
);
gardenFloor.rotation.x = -Math.PI / 2;
gardenFloor.position.set(15, 0, 0);
scene.add(gardenFloor);

// --- Note object ---
const note = new THREE.Mesh(
  new THREE.PlaneGeometry(0.3, 0.4),
  new THREE.MeshStandardMaterial({ color: 0xfaf3e8, side: THREE.DoubleSide })
);
note.rotation.x = -Math.PI / 2;
note.position.set(1.5, 0.01, 1.5);
scene.add(note);

const seal = new THREE.Mesh(
  new THREE.CircleGeometry(0.05, 16),
  new THREE.MeshStandardMaterial({ color: 0xb5495b })
);
seal.rotation.x = -Math.PI / 2;
seal.position.set(1.5, 0.02, 1.5);
scene.add(seal);

// --- State / persistence ---
let noteOpen = false;
const state = JSON.parse(localStorage.getItem('moireState') || '{}');
if (state.noteOpen) {
  noteOpen = true;
  seal.visible = false;
  note.material.color.set(0xfffdf7);
}
function saveState() {
  localStorage.setItem('moireState', JSON.stringify({ noteOpen }));
}

// --- Interaction (tap/click) ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onTap(clientX, clientY) {
  pointer.x = (clientX / innerWidth) * 2 - 1;
  pointer.y = -(clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([note, seal]);
  if (hits.length && !noteOpen) {
    noteOpen = true;
    seal.visible = false;
    note.material.color.set(0xfffdf7);
    showNoteText();
    saveState();
  }
}
addEventListener('click', e => onTap(e.clientX, e.clientY));
addEventListener('touchstart', e => {
  if (e.target.tagName === 'CANVAS') onTap(e.touches[0].clientX, e.touches[0].clientY);
});

function showNoteText() {
  const div = document.createElement('div');
  div.textContent = "you found this. i love you.";
  div.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);
  font-family:serif;color:#5a4a42;background:rgba(255,253,247,0.9);padding:10px 20px;
  border-radius:8px;z-index:20;`;
  document.body.appendChild(div);
}

// --- Movement: keyboard ---
const keys = {};
addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// --- Movement: touch joystick ---
const joystick = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };

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
  const tt = e.touches[0];
  let dx = tt.clientX - joystick.startX;
  let dy = tt.clientY - joystick.startY;
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

function updateMovement() {
  const speed = 0.05;
  if (keys['w']) camera.position.z -= speed;
  if (keys['s']) camera.position.z += speed;
  if (keys['a']) camera.position.x -= speed;
  if (keys['d']) camera.position.x += speed;
  camera.position.x += joystick.dx * speed;
  camera.position.z += joystick.dy * speed;
}

// --- Animate loop ---
function animate() {
  requestAnimationFrame(animate);
  updateLight();
  updateMovement();
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
