window.onerror = function(msg, url, line) {
  document.body.innerHTML = '<pre style="color:red;padding:20px;white-space:pre-wrap;">' + msg + ' File: ' + url + ' Line: ' + line + '</pre>';
};

import { showLogin } from './login.js';
import { showHub } from './hub.js';
import { showExitButton } from './exitbutton.js';
import { scene, camera, renderer, updateLight } from './world.js';
import './interaction.js';
import { updateMovement } from './controls.js';
import './flower.js';
import { updateTransitions } from './transitions.js';
import { updateGarden } from './garden.js';
import { updatePresence } from './presence.js';
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
import { updatePlant } from './plant.js';
import { applySeason } from './season.js';
import { updateCandle } from './candle.js';
import './callui.js';

function animate() {
  requestAnimationFrame(animate);
  updateLight();
  updateMovement();
  updateTransitions();
  updateGarden(performance.now() * 0.001);
  updatePet(performance.now() * 0.001);
  updateWeather(performance.now() * 0.001);
  updatePlant();
  updateCandle(performance.now() * 0.001);
  updatePresence();
  updateLook();
  renderer.render(scene, camera);
}

showLogin(function() {
  showHub(function() {
    animate();
    applySeason();
    showExitButton(function() {
      location.reload();
    });
  });
});
