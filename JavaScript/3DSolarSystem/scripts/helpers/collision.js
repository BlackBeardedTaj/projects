import * as THREE from 'three';
import { Score } from '../controllers/score.js';
import { PopulateSpace } from '../controllers/populate_space';


export function checkRocketCollision(rocket, stars, scene, scoreBalance) {
    const rocketSphere = new THREE.Sphere();
    // console.log("koliko zvezda?: " + populateSpace.stars.length)
  
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      rocketSphere.center.copy(rocket.position);
      rocketSphere.radius = rocket.scale.x * 0.5;
  
      // Create a sphere around the star
      const starSphere = new THREE.Sphere();
      starSphere.center.copy(star.position);
      starSphere.radius = star.geometry.parameters.radius;
  
      // Check if the rocket intersects with the star sphere
      if (rocketSphere.intersectsSphere(starSphere)) {
        // Handle collision
        scene.remove(star);
        stars.splice(i, 1);
        scoreBalance++;
        const score = new Score(scoreBalance);
        // console.log(scoreBalance);
        score.updateScore();
      }
    }
}