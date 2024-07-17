import * as THREE from 'three';

export function followCamera(perspectiveCamera, rocket, astronaut, hasRocketLanded) {
    const offset = new THREE.Vector3(0, 0, 80);
    const offset2 = new THREE.Vector3(0, 5, 100);
  
    if (!astronaut.isAstronautActive) {
      perspectiveCamera.position.copy(rocket.position).add(offset.clone().applyQuaternion(rocket.quaternion));
      perspectiveCamera.rotation.copy(rocket.rotation);
    } else if (astronaut.isAstronautActive && !hasRocketLanded) {
      perspectiveCamera.position.copy(astronaut.getAstronautPosition()).add(offset.clone().applyQuaternion(astronaut.getAstronautQuaternin()));
      perspectiveCamera.rotation.copy(astronaut.getAstronautRotation());
    } else if (astronaut.isAstronautActive && hasRocketLanded) {
      const astronautPosition = astronaut.getAstronautPosition();
      const astronautQuaternion = astronaut.getAstronautQuaternin();
      if (astronautPosition && astronautQuaternion) {
        perspectiveCamera.position.copy(astronaut.getAstronautPosition()).add(offset2.clone().applyQuaternion(astronaut.getAstronautQuaternin()));
        perspectiveCamera.rotation.copy(astronaut.getAstronautRotation());
      } else {
        console.error("Astronaut position or quaternion is not defined.");
      }
    }
  }