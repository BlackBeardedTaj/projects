import * as THREE from 'three';
// import * as TWEEN from '../animation/tween';
import * as TWEEN from '../../tween.js-main';


export function handlePlanetLanding(playerRocket, planets, astronaut) {
    let hasRocketLanded = false;
    astronaut.hasAstronautsRocketLanded = false;
    let nearestPlanet = null;
    const landingDistance = 100;
  
    planets.forEach((planet) => {
      displayLandingPrompt(playerRocket, planet, landingDistance);
    });
  
    function displayLandingPrompt(playerRocket, planet, landingDistance) {
      const landingPrompt = createLandingPrompt();
      document.body.appendChild(landingPrompt);
  
      document.addEventListener('keydown', (event) => handleKeyPress(event, playerRocket, planet));
  
      function handleKeyPress(event, playerRocket, planet) {
        if (event.key === 'l' || event.key === 'L') {
          if (!hasRocketLanded) {
            initiateLanding(playerRocket, planets, astronaut);
          } else {
            initiateTakeOff(playerRocket, astronaut);
          }
        }
      }
  
      function createLandingPrompt() {
        const landingPrompt = document.createElement('div');
        landingPrompt.textContent = 'Press L to land';
        landingPrompt.style.position = 'absolute';
        landingPrompt.style.top = '10px';
        landingPrompt.style.right = '10px';
        landingPrompt.style.padding = '10px';
        landingPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        landingPrompt.style.color = '#fff';
        return landingPrompt;
      }
  
      function checkDistance() {
        const rocketPosition = playerRocket.position.clone();
        const planetPosition = planet.position.clone();
        const distance = rocketPosition.distanceTo(planetPosition);
  
        landingPrompt.style.display = distance <= landingDistance ? 'block' : 'none';
      }
  
      function renderLoop() {
        checkDistance();
        TWEEN.update();
        requestAnimationFrame(renderLoop);
      }
  
      renderLoop();
    }
  
    function initiateLanding(playerRocket, planets, astronaut) {
      nearestPlanet = findNearestPlanet(playerRocket, planets);
      rotateAndMoveToPlanet(playerRocket, nearestPlanet, astronaut);
    }
  
    function initiateTakeOff(playerRocket, astronaut) {
      const targetPosition = playerRocket.position.clone().add(new THREE.Vector3(0, 15, 0));
      new TWEEN.Tween(playerRocket.position)
        .to(targetPosition, 4000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
          hasRocketLanded = false;
          astronaut.hasAstronautsRocketLanded = false;
          console.log("Rocket took off from " + nearestPlanet.name);
        })
        .start();
    }
  
    function findNearestPlanet(playerRocket, planets) {
      let nearestPlanet = null;
      let nearestDistance = Infinity;
      planets.forEach((planet) => {
        const distance = playerRocket.position.distanceTo(planet.position);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPlanet = planet;
        }
      });
      return nearestPlanet;
    }
  
    function rotateAndMoveToPlanet(playerRocket, nearestPlanet, astronaut) {
      const direction = nearestPlanet.position.clone().sub(playerRocket.position);
      const angle = Math.atan2(direction.x, direction.z);
      const targetRotation = { y: angle };
      const targetPosition = nearestPlanet.position.clone().add(new THREE.Vector3(0, nearestPlanet.radius, 0));
  
      new TWEEN.Tween(playerRocket.rotation)
        .to(targetRotation, 3000)
        .onComplete(() => {
          new TWEEN.Tween(playerRocket.position)
            .to(targetPosition, 3000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
              playerRocket.position.copy(targetPosition);
              astronaut.setNearestPlanet(nearestPlanet);
              hasRocketLanded = true;
              astronaut.hasAstronautsRocketLanded = true;
              console.log("Rocket landed on " + nearestPlanet.name);
            })
            .start();
        })
        .start();
    }
}