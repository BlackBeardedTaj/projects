import * as THREE from 'three';

export function followCamera(perspectiveCamera, rocket, astronaut, hasRocketLanded) {
  // console.log("da li je raketa sletela: "+ astronaut.hasAstronautsRocketLanded)
  // console.log("da li je astronaut van rakete: "+ astronaut.isAstronautActive)
    const offset = new THREE.Vector3(0, 0, 80);
    const offset2 = new THREE.Vector3(0, 5, 30);
  
    if (!astronaut.isAstronautActive) {
      perspectiveCamera.position.copy(rocket.position).add(offset.clone().applyQuaternion(rocket.quaternion));
      perspectiveCamera.rotation.copy(rocket.rotation);
    } else if (astronaut.isAstronautActive && !astronaut.hasAstronautsRocketLanded) {
      // console.log("raketa NIJE sletela, astronaut u setnji svemirom")

      perspectiveCamera.position.copy(astronaut.getAstronautPosition()).add(offset.clone().applyQuaternion(astronaut.getAstronautQuaternin()));
      perspectiveCamera.rotation.copy(astronaut.getAstronautRotation());
    } else if (astronaut.isAstronautActive && astronaut.hasAstronautsRocketLanded) {
      // console.log("raketa sletela, astronaut u setnji svemirom")
      const astronautPosition = astronaut.getAstronautPosition();
      const astronautQuaternion = astronaut.getAstronautQuaternin();
      if (astronautPosition && astronautQuaternion) {
      // console.log("OVDE SAM!!!!")
        perspectiveCamera.position.copy(astronaut.getAstronautPosition()).add(offset2.clone().applyQuaternion(astronaut.getAstronautQuaternin()));
        perspectiveCamera.rotation.copy(astronaut.getAstronautRotation());
      } else {
        console.error("Astronaut position or quaternion is not defined.");
      }
    }
  }