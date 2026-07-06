import * as THREE from 'three';

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe8ddd0);

export const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 5);

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

export const light = new THREE.HemisphereLight(0xfff0e0, 0x444444, 1);
scene.add(light);

let t = 0;
export function updateLight() {
  t += 0.001;
  const warmth = (Math.sin(t) + 1) / 2;
  light.color.setHSL(0.09, 0.5, 0.75 + warmth * 0.1);
  light.intensity = 0.9 + warmth * 0.3;
}

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

export const doorway = new THREE.Mesh(
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

export const doorway2 = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 3),
  new THREE.MeshBasicMaterial({ color: 0xfff8f0, transparent: true, opacity: 0.3 })
);
doorway2.position.set(-5, 1.5, 0);
doorway2.rotation.y = Math.PI / 2;
scene.add(doorway2);

const nookFloor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0xc9b8a8 })
);
nookFloor.rotation.x = -Math.PI / 2;
nookFloor.position.set(-15, 0, 0);
scene.add(nookFloor);

addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
