import * as THREE from 'three';

class Enemy extends THREE.Mesh {
  constructor(geometry, material, position, velocity, radius, maxSpeed) {
    super(geometry, material);
    this.position.copy(position);
    this.velocity = velocity;
    this.radius = radius;
    this.theta = 0;
    this.maxSpeed = maxSpeed;
  }

  update(delta, rocketPosition, enemies) {
    const desiredDistance = this.radius * 2;
    const centerOfMass = new THREE.Vector3();
    const separationForce = new THREE.Vector3();
    let neighborCount = 0;
  
    // calculate the center of mass of all neighbors and separation force
    for (const enemy of enemies) {
      if (enemy !== this) {
        const distance = this.position.distanceTo(enemy.position);
        if (distance < desiredDistance) {
            // if the Rocket is near enemies follow it
            // centerOfMass.add(enemy.position);
            centerOfMass.add(rocketPosition);
            neighborCount++;
  
          const separation = this.position.clone().sub(enemy.position);
          separation.multiplyScalar(1 - (distance / desiredDistance) ** 2);
          separationForce.add(separation);
        }
      }
    }
  
    // calculate the desired position
    if (neighborCount > 0) {
      centerOfMass.divideScalar(neighborCount);
      const toCenter = centerOfMass.clone().sub(this.position);
      const desiredPosition = toCenter.normalize().multiplyScalar(desiredDistance);
      desiredPosition.add(separationForce);
  
      // calculate the steering force required to reach the desired position
      const steering = desiredPosition.clone().sub(this.position);
      if (steering.length() > 0) {
        steering.normalize().multiplyScalar(this.maxSpeed).sub(this.velocity);
        this.velocity.add(steering.multiplyScalar(delta));
        if (this.velocity.length() > this.maxSpeed) {
          this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }
      }
    }
  
    // update the position
    this.position.add(this.velocity.clone().multiplyScalar(delta));
  }
  
}

export { Enemy };
