// import { ShootingMechanism } from './shooting_mechanism';

class GamepadController {
    constructor(rocket, shootingMechanism) {
      this.rocket = rocket;
      this.shootingMechanism = shootingMechanism;
      this.gamepad = null;
      this.velocity = 0.0;
      this.releaseTimeouts = {};
        
      window.addEventListener("gamepadconnected", (event) => {
        this.gamepad = event.gamepad;
        console.log("Gamepad connected: " + this.gamepad.id);
      });
  
      // Check for gamepad disconnections
      window.addEventListener("gamepaddisconnected", (event) => {
        this.gamepad = event.gamepad;
        console.log("Gamepad disconnected: " + this.gamepad.id);
      });
    }
  
    processGamepadInput(gamepad) {
      // Handle button presses
       // Handle button presses
       for (var j = 0; j < gamepad.buttons.length; j++) {
        if (gamepad.buttons[j].pressed) {
          console.log("Button " + j + " is pressed");
          // Handle button j press
          let speed = 0.0;

        if (j === 0) {
          console.log("x-button");
          speed = -0.8;
        } else if (j === 1) {
        //   shoot
            this.shootingMechanism.createProjectile();
        } else if (j === 2) {
            speed = 0.8;
        } else if (j === 5) {
          speed = -0.8*5; // Boost the speed
        } else if (j === 12) {
            this.rocket.rotateX(0.02);
        } else if (j === 13) {
            this.rocket.rotateX(-0.02);
        } else if (j === 14) {
            this.rocket.rotateY(0.02);
        } else if (j === 15) {
            this.rocket.rotateY(-0.02);
        }

        // this.velocity += (speed - this.velocity) * 0.2;
        // this.rocket.translateZ(this.velocity);
        // console.log(this.velocity);

        const acceleration = 0.1; // Adjust the acceleration value as needed
        const maxSpeed = 5; // Adjust the maximum speed value as needed

        const speedDifference = speed - this.velocity;
        const speedChange = Math.sign(speedDifference) * acceleration;
        this.velocity = Math.min(Math.abs(this.velocity + speedChange), maxSpeed) * Math.sign(speed);

        this.rocket.translateZ(this.velocity);
        console.log(this.velocity);
                
        //   }
        } else /*(!gamepad.buttons[j].pressed)*/ {
            // console.log(this.velocity)

            this.releaseButtonTimeout(0);
            // console.log("posle funkcije" + this.velocity)
        }
      }

      // Handle axes movements
    //   var prevAxes = this.prevAxes || [];
    //   for (var k = 0; k < gamepad.axes.length; k++) {
    //     var axisValue = gamepad.axes[k];
    //     var prevAxisValue = prevAxes[k];
    //     // Check if the axis value has changed
    //     if (axisValue !== prevAxisValue) {
    //         // console.log("Axis " + k + " moved: " + axisValue);
    //         // console.log("Left Stick X: " + gamepad.axes[0]);
    //         // console.log("Left Stick Y: " + gamepad.axes[1]);
    //         // console.log("Right Stick X: " + gamepad.axes[2]);
    //         // console.log("Right Stick Y: " + gamepad.axes[3]);
    //         // Use axisValue for game movements or other actions
    //         if (k === 0) {
    //             // Map the X-axis of the left stick to the rotation on the Y-axis
    //             this.rocket.rotation.y = -axisValue;
    //           } else if (k === 1) {
    //             // Map the Y-axis of the left stick to the rotation on the X-axis
    //             this.rocket.rotation.x = -axisValue;
    //           } else if (k === 2) {
    //             // Map the X-axis of the right stick to the rotation on the Z-axis
    //             this.rocket.rotation.z = -axisValue;
    //           } else if (k === 3) {
    //             // Use the Y-axis of the right stick for rocket movement
    //             if (axisValue < -0.1) {
    //               this.moving = true;
    //               this.rocket.translateZ(-0.1);
    //             } else if (axisValue > 0.1) {
    //               this.moving = true;
    //               this.rocket.translateZ(0.1);
    //             } else if (this.moving) {
    //               this.moving = false;
    //               // Handle rocket stop logic (e.g., decrease velocity, etc.)
    //             }
    //           }
    //     }
    //   }
    }

    releaseButtonTimeout(buttonIndex) {
        clearTimeout(this.releaseTimeouts[buttonIndex]);
        this.releaseTimeouts[buttonIndex] = setTimeout(() => {
            this.velocity = 0.0;
            this.rocket.translateZ(this.velocity); // Stop the rocket movement
            delete this.releaseTimeouts[buttonIndex];
        }, 500); // Adjust the duration (in milliseconds) as needed
      }
    

    gameLoop() {
      var gamepads = navigator.getGamepads(); // Get the list of connected gamepads
  
      // Process gamepad input
      for (var i = 0; i < gamepads.length; i++) {
        var gamepad = gamepads[i];
  
        if (gamepad && gamepad.connected) { // Check if the gamepad is connected
            this.processGamepadInput(gamepad);

        }
      }
  
      requestAnimationFrame(() => this.gameLoop()); // Call the game loop again
      this.shootingMechanism.checkCollisions();
    }
  }
  
  export { GamepadController };
  