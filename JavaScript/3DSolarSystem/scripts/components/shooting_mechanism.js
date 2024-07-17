import * as THREE from 'three'; 
import { Score } from '../utilities/index';

 

class ShootingMechanism {
  constructor(rocket, offset, scene, enemies, score/*, keyboardKey*/) {
    this.projectiles = [];
    this.rocket = rocket;
    this.offset = offset;
    this.scene = scene;
    this.enemies = enemies;
    this.score = score;
    // this.updateScore = updateScore;
    // this.keyboardKey = keyboardKey;
    
    // document.addEventListener("keydown", (e) => {
    //   const key = e.code.replace('Key', '').toLowerCase();
    //   if (this.keys[key] !== undefined) {
    //     this.keys[key] = true;
    //     if (key === this.keyboardKey) {
    //       this.createProjectile();
    //     }
    //   }
    // });
  }
  
  createProjectile() {
    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const projectile = new THREE.Mesh(geometry, material);
    projectile.position.copy(this.rocket.position).add(this.offset.clone().applyQuaternion(this.rocket.quaternion));
    projectile.quaternion.copy(this.rocket.quaternion);
    this.projectiles.push(projectile);
    this.scene.add(projectile);
  }

  checkCollisions() {
    // for (let i = 0; i < this.projectiles.length; i++) {
    //   const projectile = this.projectiles[i];
    //   for (let j = 0; j < this.enemies.length; j++) {
    //     const enemy = this.enemies[j];
    //     if (projectile.position.distanceTo(enemy.position) < enemy.radius) {
    //       this.scene.remove(enemy);
    //       this.enemies.splice(j, 1);
    //       this.score += 10;
    //       let score = new Score (this.score);
    //       score.updateScore();
    //       this.scene.remove(projectile);
    //       this.projectiles.splice(i, 1);
    //       break;
    //     }
    //   }
    // }
    for ( let i = 0; i < this.projectiles.length; i++ ) {
      const projectile = this.projectiles[i];
      for ( let j = 0; j < this.enemies.length; j++ ) {
        const enemy = this.enemies[j];
  
        const projectileSphere = new THREE.Sphere();
        projectileSphere.center.copy(projectile.position);
        projectileSphere.radius = projectile.scale.x;
  
        // Create a sphere around the star
        const enemySphere = new THREE.Sphere();
        enemySphere.center.copy(enemy.position);
        enemySphere.radius = enemy.geometry.parameters.radius;
  
        // Check if the rocket intersects with the star sphere
        if (projectileSphere.intersectsSphere(enemySphere)) {
          // Handle collision
          this.scene.remove(enemy);
          this.enemies.splice(j, 1);
          this.scene.remove(projectile);
          this.projectiles.splice(i, 1);
  
          this.score++;
          let scoreObject = new Score (this.score)
          console.log("iz shooting klase" + this.score)
  
          scoreObject.updateScore();
          break;
        }
      }
    }
  }
  
  updateShooting() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      const velocity = new THREE.Vector3(0, 0, -1).applyQuaternion(projectile.quaternion);
      projectile.position.add(velocity.multiplyScalar(10));
      if (projectile.position.z < -300) {
        this.projectiles.splice(i, 1);
        this.scene.remove(projectile);
      }
    }
  }
}

export { ShootingMechanism }
