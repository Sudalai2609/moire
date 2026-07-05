import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe8ddd0);

const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.HemisphereLight(0xfff0e0, 0x444444, 1);
scene.add(light);

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

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
