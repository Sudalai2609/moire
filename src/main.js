import { scene, camera, renderer, updateLight } from './world.js';
import './interaction.js';
import { updateMovement } from './controls.js';
import './flower.js';
import { updateTransitions } from './transitions.js';
import { updateGarden } from './garden.js';
import { updatePresence, togglePresence } from './presence.js';
import { updatePet } from './pet.js';

function animate() {
  requestAnimationFrame(animate);
  updateLight();
  updateMovement();
  updateTransitions();
  updateGarden(performance.now() * 0.001);
  renderer.render(scene, camera);
  updatePet(performance.now() * 0.001);
}
animate();

setTimeout(togglePresence, 5000);
