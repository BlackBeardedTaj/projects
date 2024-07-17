import * as THREE from 'three'; 

class Player{
    constructor(scene, camera, renderer, nearestPlanet, rocket){
      this.nearestPlanet = nearestPlanet;
        this.hasAstronautsRocketLanded= null;
        this.scene = scene;
        // this.nearestPlanet = nearestPlanet;
        this.rocket = rocket;

        this.velocity = 0.0


        this.astronaut;
        this.astronautPosition = new THREE.Vector3();
        // this.astronautPosition = this.astronaut.position;
        
        this.isAstronautActive = false;
        this.canRocketMove = true;
        this.astronautSize;

        this.rotationSpeed = 0.05;
        this.movementSpeed = 0.05;  // Adjusted movement speed

        this.astronautQuaternion = new THREE.Quaternion(); // Store astronaut's orientation

        document.addEventListener('keydown', (event) => {
            if (event.key === 'f' || event.key === 'F') {
              this.toggleAstronaut();
            }
          });
    }

    toggleAstronaut() {
        // console.log("toggleAstronaut")
        if (this.astronaut) {
          // Astronaut exists, remove it from the scene
          this.scene.remove(this.astronaut);
          this.astronaut = undefined;
          this.isAstronautActive = false;
          this.canRocketMove = true; // Allow the rocket to move again
          // this.astronautPosition = (0,0,0)
        } else {
          // Astronaut doesn't exist, create and add it to the scene
          this.astronautSize = 0.5
          this.astronaut = new THREE.Mesh(new THREE.BoxGeometry(this.astronautSize,this.astronautSize,this.astronautSize), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
          if (!this.hasAstronautsRocketLanded){
            console.log("raketa moze da se pomera: " + this.canRocketMove)
            console.log("da li je sletela: " + this.hasAstronautsRocketLanded)
            
            // console.log("pozicija RAKETE "+this.rocket.position)
            // console.log(this.rocket.position)
            this.astronaut.position.copy(this.rocket.position); // Position astronaut at the rocket's position
            this.astronautPosition=this.astronaut.position;

            //   console.log("pozicija ASTRONAUTA "+this.astronaut.position)
            //   console.log(this.astronaut.position)


            this.scene.add(this.astronaut);
            this.isAstronautActive = true;
            this.canRocketMove = false; // Disable rocket movement
            //   this.astronaut.position.copy(this.rocket.position);
            // console.log("pozicija astronauta iz toggleAstronaut")
            // console.log(this.astronaut.position)
            // console.log("pozicija this.astronautPosition iz toggleAstronaut")
            // console.log(this.astronautPosition)
          } else {
            console.log("ELSE raketa moze da se pomera: " + this.canRocketMove)

            // this.astronaut.position.copy(this.rocket.position); // Position astronaut at the rocket's position
            // this.astronautPosition=this.astronaut.position;

            this.positionAstronautOnPlanet();
            this.scene.add(this.astronaut);
            this.isAstronautActive = true;
            this.canRocketMove = false;
          }
          
        }
      }

  positionAstronautOnPlanet() {
    // console.log("ovde sam!!")
    // const { radius } = this.nearestPlanet;
    // const x = radius * Math.sin(this.initialLatitude) * Math.cos(this.initialLongitude);
    // const y = radius * Math.cos(this.initialLatitude);
    // const z = radius * Math.sin(this.initialLatitude) * Math.sin(this.initialLongitude);

    // this.astronautPosition.set(x, y, z);
    // this.astronaut.position.copy(this.astronautPosition);
    if (!this.nearestPlanet) {
      console.error("Nearest planet is not available.");
      return;
    }

    // console.log("pozicija astr pre obrade ")
    // console.log(this.astronaut.position)
    // console.log("pozicija rakete")
    // console.log(this.rocket.position)
    // const surfaceNormal = this.rocket.position.clone().normalize();
    const surfaceNormal = this.rocket.position.clone().sub(this.nearestPlanet.position).normalize();
    // console.log("surfaceNormal")
    // console.log(surfaceNormal)

    const astronautPosition = surfaceNormal.multiplyScalar(this.nearestPlanet.radius).add(this.nearestPlanet.position);
    // console.log("radius sfere")
    // console.log(this.nearestPlanet.radius)
    // console.log("astronautPosition nakon surfaceNormal")
    // console.log(astronautPosition)


    this.astronaut.position.copy(astronautPosition);
    this.astronautPosition.copy(this.astronaut.position)
    // console.log("pozicija na kraju")
    // console.log(astronautPosition)
    

    // Ensure astronaut faces the planet's center initially
    this.astronaut.lookAt(this.nearestPlanet.position);

    // console.log("POZICIJA ASTRONAUTA IZ F-JE 'positionAstronautOnPlanet': ");console.log(this.astronaut.position);
    // console.log(this.nearestPlanet.position);


    // Adjust orientation to ensure the bottom side faces the planet's surface
    this.alignAstronautToSurface();
  }

    // Function to move the astronaut forward on the sphere's surface
 /**
 * Moves the astronaut forward or backwards dependiing on the param.
 *
 * @param   direction Value can be -1 (forward) or 1 (backwards). Default value is -1.
 */
  moveAstronautForward(direction = -1) {
    // Calculate the direction the astronaut should move after rotation
    const moveDirection = new THREE.Vector3(0, 0, direction); // Initial movement direction (negative z-axis)
    moveDirection.applyQuaternion(this.astronautQuaternion); // Apply astronaut's current quaternion rotation

    // Move the astronaut in the direction it's facing
    const moveDistance = 0.1; // Adjust as needed
    this.astronaut.position.addScaledVector(moveDirection, moveDistance);

    // Recalculate the position to stay on the planet's surface
    // const surfaceNormal = this.astronaut.position.clone().normalize();
    const surfaceNormal = this.astronaut.position.clone().sub(this.nearestPlanet.position).normalize();
    const astronautPosition = surfaceNormal.multiplyScalar(this.nearestPlanet.radius).add(this.nearestPlanet.position);
    this.astronaut.position.copy(astronautPosition);

    // Orient the astronaut to face the planet's center and adjust orientation
    this.alignAstronautToSurface();
  }
  
  // Function to move the astronaut backward on the sphere's surface
  moveAstronautBackward() {
    // this.astronautRotationY += this.rotationSpeed;
    this.moveAstronautForward(1)
  }
  
  // // Function to rotate the astronaut left on the sphere's surface
  // rotateAstronautLeft() {
  //   this.astronautRotationX -= this.rotationSpeed;
  // }
  
  // // Function to rotate the astronaut right on the sphere's surface
  // rotateAstronautRight() {
  //   this.astronautRotationX += this.rotationSpeed;
  // }

  rotateAstronaut(rotateSpeed) {
    const axis = new THREE.Vector3(0, 0, 1); // Rotate around the astronaut's local z-axis
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis, rotateSpeed);
    this.astronaut.quaternion.multiplyQuaternions(quaternion, this.astronaut.quaternion);

    // Update astronautQuaternion to maintain correct orientation for movement
    this.astronautQuaternion.copy(this.astronaut.quaternion);

    // Adjust orientation to ensure the bottom side faces the planet's surface
    this.alignAstronautToSurface();
  }

  alignAstronautToSurface() {
    // Get the direction pointing from the astronaut to the center of the planet
    // const toCenter = this.sphere.position.clone().sub(this.astronaut.position).normalize();
    const toCenter = this.nearestPlanet.position.clone().sub(this.astronaut.position).normalize();

    // Get the direction pointing up from the astronaut
    const up = new THREE.Vector3(0, -1, 0).applyQuaternion(this.astronaut.quaternion).normalize();

    // Calculate the quaternion to align the up direction with the direction to the planet's center
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, toCenter);

    // Apply this quaternion to the astronaut's current orientation
    this.astronaut.quaternion.premultiply(quaternion);
  }
  
  // Function to convert degrees to radians
  degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  getAstronautPosition() {
    if (this.astronaut) {
        // console.log("Astronaut postoji")
        // console.log("pozicija astronauta iz getAstronautPosition")
    // console.log(this.astronautPosition)
      return this.astronautPosition;
    } else {
      return null;
    }
  }

  getAstronautQuaternin() {
    if (this.astronaut) {
        // console.log("Astronaut postoji")
      return this.astronaut.quaternion;
    } else {
      return null;
    }
  }

  getAstronautRotation() {
    if (this.astronaut) {
        // console.log("Astronaut postoji")
      return this.astronaut.rotation;
    } else {
      return null;
    }
  }

  // This function sets the planet to the one the astronaut landed on
  setNearestPlanet(nearestPlanet) {
    this.nearestPlanet = nearestPlanet;
  }
}

export { Player }