import * as THREE from 'three';
import * as TWEEN from '../../tween.js-main';

export function turnRocketTowardsPlanet(planetName, rocket, populateSpace, renderer, scene, perspectiveCamera) {
    let planet = populateSpace.planets.find(element => element.name === planetName);
  
    if (planet) {
      const targetQuaternion = new THREE.Quaternion();
      rocket.getWorldQuaternion(targetQuaternion);
  
      const currentDirection = new THREE.Vector3();
      rocket.getWorldDirection(currentDirection);
  
      const direction = planet.position.clone().sub(rocket.position).normalize();
      const angle = Math.acos(-currentDirection.dot(direction));
      const axis = new THREE.Vector3().crossVectors(direction, currentDirection).normalize();
  
      const startTime = performance.now();
      const endTime = startTime + 2000;
  
      (function animateMovement() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const t = THREE.MathUtils.clamp(elapsed / (endTime - startTime), 0, 1);
        const currentQuaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle * t);
        currentQuaternion.multiply(targetQuaternion);
        rocket.quaternion.copy(currentQuaternion);
  
        const movementSpeed = 0.01;
        const movementDirection = direction.clone().applyQuaternion(targetQuaternion);
        const movement = movementDirection.multiplyScalar(movementSpeed);
        rocket.position.add(movement);
  
        renderer.render(scene, perspectiveCamera);
  
        if (t < 1) {
          requestAnimationFrame(animateMovement);
        }
      })();
    }
  }
  
  export function setupPlanetList(populateSpace, rocket, renderer, scene, perspectiveCamera) {
    let planetNames = [];
    // const planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Aleksej"];
    populateSpace.planets.forEach((element) => {
      planetNames.push(element.name);
    })
    const planetListElement = document.getElementById("planet-list");
  
    planetNames.forEach((name) => {
      const planetNameElement = document.createElement("span");
      planetNameElement.textContent = name;
  
      planetNameElement.addEventListener("click", () => {
        console.log("Planet " + name + " clicked");
        turnRocketTowardsPlanet(name, rocket, populateSpace, renderer, scene, perspectiveCamera);
      });
  
      planetListElement.appendChild(planetNameElement);
    });
  }