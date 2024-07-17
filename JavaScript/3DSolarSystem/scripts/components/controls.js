import * as THREE from 'three';
// import './style.css';
import { ShootingMechanism } from '../utilities/index'


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Player } from '../controllers/player';


class Controls{
    constructor({rocket, shootingMechanism}){
        this.rocket = rocket;
        this.shootingMechanism = shootingMechanism;
        this.speed;

        // const velocity = 0.0;

        this.keys = {
            w: false,
            s: false,
            a: false,
            d: false,
            q: false,
            e: false,
            shiftleft: false,
            intlbackslash: false,
            controlleft: false,
            p: false,
            o: false
        };

        document.addEventListener("keydown", (e) => {
            console.log(e.code);
            const key = e.code.replace('Key', '').toLowerCase();
            if (this.keys[key] !== undefined)
              this.keys[key] = true;
            //   const keyIndex = Object.keys(this.keys).indexOf(key);
            //   Object.keys(this.keys)[keyIndex] = true;
        });
          
        document.body.addEventListener('keyup', (e) => {
        const key = e.code.replace('Key', '').toLowerCase();
        if (this.keys[key] !== undefined)
            this.keys[key] = false;
        });
          
        this.velocity = 0.0;

        this.movementSpeed = 1.0;
        this.rotationSpeed = 0.05;

        // this.setControls();
    }

    setControls(up="", down="", left="", right="", rollLeft="", rollRight="", forward="", backward="", booster="", shoot="", lightspeed=""){
        let availableKeys = [up, down, left, right, rollLeft, rollRight, forward, backward, booster, shoot, lightspeed]
        let keysAndValues = {};

        availableKeys.forEach((key, index) => {
            if (key !== "") {
              keysAndValues[key] = false;
            } else {
              const defaultKey = Object.keys(this.keys)[index];
              keysAndValues[defaultKey] = this.keys[defaultKey];
            }
          });
          console.log("broj novih kontrola: " + availableKeys)
          let updatedKeys = {};

          for (let i = 0; i < availableKeys.length; i++) {
            if (availableKeys[i] !== "") {
              // Add or update the key-value pair in the updatedKeys object
              updatedKeys[availableKeys[i]] = this.keys[Object.keys(this.keys)[i]];
            } else {
              // Retain the existing key-value pair if no new key is provided
              const defaultKey = Object.keys(this.keys)[i];
              updatedKeys[defaultKey] = this.keys[defaultKey];
            }
          }
          
          // Assign the updatedKeys object back to this.keys
          this.keys = updatedKeys;
          
          console.log(this.keys);
    }

    controlsListener(rocket, shootingMechanism, isAstronautActive, astronaut, /*planet,*/hasRocketLanded) {
      // Controls for Rocket and Astronaut in Space
        if (!isAstronautActive||(isAstronautActive&&!hasRocketLanded)) {
          let player;
          if(!isAstronautActive){
            player = rocket;
          } else {
            player = astronaut.astronaut;
          }
          if (Object.values(this.keys)[0]) {
            player.rotateX(0.02);
          }
          // down
          if (Object.values(this.keys)[1]) {
            player.rotateX(-0.02);
          }
          // left
          if (Object.values(this.keys)[2]) {
            player.rotateY(0.02);
          }
          // right
          if (Object.values(this.keys)[3]) {
            player.rotateY(-0.02);
          }
          // rollLeft
          if (Object.values(this.keys)[4]) {
            player.rotateZ(-0.05);
          }
          // rollRight
          if (Object.values(this.keys)[5]) {
            player.rotateZ(0.05);
          }
      
          if (Object.values(this.keys)[6]) {
            this.speed = -0.8;
            this.velocity += (this.speed - this.velocity) * 0.2;
            player.translateZ(this.velocity);
          }
      
          if (Object.values(this.keys)[7]) {
            this.speed = 0.8;
            this.velocity += (this.speed - this.velocity) * 0.2;
            player.translateZ(this.velocity);
          }
      
          if (Object.values(this.keys)[8]) {
            this.speed = -0.8 * 8;
            this.velocity += (this.speed - this.velocity) * 0.2;
            player.translateZ(this.velocity);
          }
      
          if (this.keys.p) {
            shootingMechanism.createProjectile();
          }

          if (Object.values(this.keys)[10]) {
            this.speed = -0.8 * 80;
            this.velocity += (this.speed - this.velocity) * 0.2;
            player.translateZ(this.velocity);
          }
        }else if(isAstronautActive&&hasRocketLanded){
          // Controls for the Astronaut on the Planets surface
            // up
            if ( Object.values(this.keys)[0] ){
                // astronaut.astronaut.translateZ(-0.1);
                astronaut.moveAstronautForward();
            }
            // down
            if ( Object.values(this.keys)[1] ){
                // astronaut.translateZ(0.1);
                astronaut.moveAstronautBackward();
            }
            // left
            if ( Object.values(this.keys)[2] ){
                // astronaut.translateX(-0.1);
                // astronaut.rotateAstronautLeft();
                this.speed = 0.05; // Rotate left
                astronaut.rotateAstronaut(this.speed);
            }
            // right
            if ( Object.values(this.keys)[3] ){
                // astronaut.translateX(0.1);
                // astronaut.rotateAstronautRight();
                this.speed = -0.05; // Rotate right
                astronaut.rotateAstronaut(this.speed);
            }
        } 
    }
}

export { Controls }