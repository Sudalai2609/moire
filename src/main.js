window.onerror = function(msg, url, line) {
    document.body.innerHTML = '<pre style="color:red;padding:20px;white-space:pre-wrap;">' + msg + '\nFile: ' + url + '\nLine: ' + line + '</pre>';
    };
import { scene, camera, renderer, updateLight } from './world.js';
import './interaction.js';
import { updateMovement } from './controls.js';
import './flower.js';
import { updateTransitions } from './transitions.js';
import { updateGarden } from './garden.js';
import { updatePresence, togglePresence } from './presence.js';
import { updatePet } from './pet.js';
import './letterbox.js';
import './windowletter.js';
import './photobooth.js';
import './plushie.js'; 
import './bouquet.js';
import './milestone.js';
import { updateLook } from './lookcontrols.js';
import './audio.js';
import { updateWeather } from './weather.js';

function animate() {
  requestAnimationFrame(animate);
  updateLight();
  updateMovement();
  updateTransitions();
  updateGarden(performance.now() * 0.001);
  renderer.render(scene, camera);
  updatePet(performance.now() * 0.001);
  updateWeather(performance.now() * 0.001);
}
animate();

setTimeout(togglePresence, 5000);
