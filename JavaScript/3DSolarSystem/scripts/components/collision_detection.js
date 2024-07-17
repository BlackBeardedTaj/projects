import * as THREE from 'three'; 
import { Score } from '../controllers/score';

class CollisionDetector {
    constructor({setOfBodies1, setOfBodies2, score=null, scene, body1position}) {
        // If setOfBodies1 is not an array, wrap it in an array
        this.setOfBodies1 = Array.isArray(setOfBodies1) ? setOfBodies1 : [setOfBodies1];
        // If setOfBodies2 is not an array, wrap it in an array
        this.setOfBodies2 = Array.isArray(setOfBodies2) ? setOfBodies2 : [setOfBodies2];
        this.scene = scene;
        this.score = score;
        this.body1position = body1position;
    }

    checkCollisions() {
        for (let i = 0; i < this.setOfBodies1.length; i++) {
            const body1 = this.setOfBodies1[i];
            console.log("body1:", body1);
            if (!body1.position) {
                throw new Error('Object does not have a position property.');
            }
            const body1Sphere = new THREE.Sphere(this.body1position, body1.scale.x);

            for (let j = 0; j < this.setOfBodies2.length; j++) {
                const body2 = this.setOfBodies2[j];
                console.log("body2:", body2);
                if (!body2.position) {
                    throw new Error('Object does not have a position property.');
                }
                const body2Sphere = new THREE.Sphere(body2.position, body2.geometry ? body2.geometry.parameters.radius : 1);

                if (body1Sphere.intersectsSphere(body2Sphere)) {
                    this.scene.remove(body1);
                    this.setOfBodies1.splice(i, 1);
                    i--;
            
                    this.scene.remove(body2);
                    this.setOfBodies2.splice(j, 1);
                    j--;
        
                    if (this.score) {
                        const score = new Score(this.score);
                        score.increaseScore();
                    }
                }
            }
        }
    }
}

export { CollisionDetector };
