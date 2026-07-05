import { scene, camera, renderer, updateLight } from './world.js';
import './interaction.js';
import { updateMovement } from './controls.js';

function animate() {
  requestAnimationFrame(animate);
  updateLight();
  updateMovement();
  renderer.render(scene, camera);
}
animate();
