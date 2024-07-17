import * as THREE from 'three'; 
import { 
    Controls,
    Enemy,
    GamepadController,
    Planet,
    PlanetsExtras,
    Score,
    ShootingMechanism 
  } from '../utilities/index';

class PopulateSpace{
    constructor(scene, camera){
        this.scene = scene;
        this.camera = camera;
        this.stars = [];
        this.planets = [];
        this.saturnsRings = new PlanetsExtras(this.scene);
    }

// Stars
    //     // const stars = [];
    //     Array(1500).fill().forEach(this.createStars(this.stars))

    addBackground( path='img/Universe/2k_stars_milky_way.jpg') {
        const spaceTexture = new THREE.TextureLoader().load(path);
        this.scene.background = spaceTexture;
    }

    addStars( number_of_stars=100, starfield_radius=1500) {
        // let starField = []
        for (let i = 0; i < number_of_stars; i++) {
            const starGeometry = new THREE.SphereGeometry(0.1, 6, 6);
            const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const star = new THREE.Mesh(starGeometry, starMaterial);

            // star.position.x = THREE.MathUtils.randFloatSpread(1000);
            // star.position.y = THREE.MathUtils.randFloatSpread(1000);
            // star.position.z = THREE.MathUtils.randFloatSpread(1000);

            const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( starfield_radius ));
            star.position.set(x,y,z);

            this.stars.push(star);
        // scene.add(star);
        }
        this.stars.forEach((star)=>{this.scene.add(star)})
    }

    addSun() {
        this.planets.push(new Planet("Sun", "img/Stars/2k_sun.jpg", new THREE.Vector3(0, 0, 0), 891.400, [
            { segments: 256, distance: 0 },
            { segments: 128, distance: 100 },
            { segments: 64, distance: 500 },
            { segments: 32, distance: 1000 },
        ]));
        this.planets.push(new Planet("Mercury", "img/Planets/2k_mercury.jpg", new THREE.Vector3(0, 0, -200), 1, [
            { segments: 64, distance: 0 },
            { segments: 32, distance: 100 },
            { segments: 16, distance: 500 },
            { segments: 8, distance: 1000 },
          ]));
        this.planets.push(new Planet("Venus", "img/Planets/2k_venus_atmosphere.jpg", new THREE.Vector3(30, 0, -300), 1.5, [
            { segments: 64, distance: 0 },
            { segments: 32, distance: 100 },
            { segments: 16, distance: 500 },
            { segments: 8, distance: 1000 },
        ]));
        this.planets.push(new Planet("Earth", "img/Planets/2k_earth_daymap.jpg", new THREE.Vector3(40, 0, -400), 1.5, [
            { segments: 64, distance: 0 },
            { segments: 32, distance: 100 },
            { segments: 16, distance: 500 },
            { segments: 8, distance: 1000 },
        ]));
        this.planets.push(new Planet("Mars", "img/Planets/2k_mars.jpg", new THREE.Vector3(60, 0, -500), 1, [
            { segments: 64, distance: 0 },
            { segments: 32, distance: 100 },
            { segments: 16, distance: 500 },
            { segments: 8, distance: 1000 },
        ]));
        this.planets.push(new Planet("Jupiter", "img/Planets/2k_jupiter.jpg", new THREE.Vector3(100, 0, -800), 8, [
            { segments: 64, distance: 0 },
            { segments: 32, distance: 100 },
            { segments: 16, distance: 500 },
            { segments: 8, distance: 1000 },
        ]));
        const saturnsPosition = new THREE.Vector3(150, 0, -1200);
        const saturnsRadius = 6;
        this.planets.push(new Planet("Saturn", "img/Planets/2k_saturn.jpg", saturnsPosition, saturnsRadius, [
            { segments: 64, distance: 0 },
            { segments: 32, distance: 100 },
            { segments: 16, distance: 500 },
            { segments: 8, distance: 1000 },
        ]));
        this.planets.push(new Planet("Uranus", "img/Planets/2k_uranus.jpg", new THREE.Vector3(200, 0, -1600), 3, [
            { segments: 64, distance: 0 },
            { segments: 32, distance: 100 },
            { segments: 16, distance: 500 },
            { segments: 8, distance: 1000 },
        ]));
        this.planets.push(new Planet("Neptune", "img/Planets/2k_neptune.jpg", new THREE.Vector3(250, 0, -2000), 2.5, [
            { segments: 64, distance: 0 },
            { segments: 32, distance: 100 },
            { segments: 16, distance: 500 },
            { segments: 8, distance: 1000 },
        ]));
        this.planets.push(new Planet("Pluto", "img/Planets/plutomap2k.jpg", new THREE.Vector3(300, 0, -2400), 1, [
            { segments: 64, distance: 0 },
            { segments: 32, distance: 100 },
            { segments: 16, distance: 500 },
            { segments: 8, distance: 1000 },
        ]));

        // Loading and adding to scene Planets
        this.planets.forEach((element) => {
            element.load(() => {});
            this.scene.add(element.mesh);
        })

        // ***** Planets Extras *****
        // TODO Make it possible to put Planets and Extras in a Group and make The Position Of The Planet available (because it'S needed for the landing of the ship). It would be easier to set the rotation of a planet around its axis and still tilt the planet and keep it rotating around itself

        // Saturn
        const tiltInRadians = THREE.Math.degToRad(26.73);
        // saturn.mesh.rotation.z = tiltInRadians
        this.saturnsRings.createSaturnsRings(saturnsPosition, saturnsRadius);
        this.saturnsRings.groupSaturn.position.copy(saturnsPosition)
        // this.saturnsRings.groupSaturn.rotation.z = tiltInRadians

        // this.saturnsRings.groupSaturn.position.copy(saturnsPosition);
    }

    updateSun() {
        for(let i = 0;i<this.planets.length;i++){
            this.planets[i].update(this.camera);
            this.planets[i].mesh.rotation.y += 0.0033
        }

        // ***** Planets Extras *****
        this.saturnsRings.groupSaturn.rotation.y += 0.0003
    }
}

export {PopulateSpace};
