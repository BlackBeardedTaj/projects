import * as THREE from 'three'; 

class PlanetsExtras {
    constructor(scene/*, position = { x: 0, y: 0, z: 0 }*/) {        
        this.scene = scene;
        /*this.saturn = this.createSaturn();
        this.rings = this.createRings();
        this.createSolidRings();*/
        this.position/* = position;*/= new THREE.Vector3(0,0,0)
        this.planetRadius;
        this.groupSaturn = new THREE.Group();

    }

    createSaturn() {
        const saturnGeometry = new THREE.SphereGeometry(5, 32, 32);
        const saturnMaterial = new THREE.MeshBasicMaterial({ color: 0xFDD017 });
        const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
        saturn.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(saturn);
        return saturn;
    }

    createRingParticle() {
        const rand = Math.random();
        let geometry;
        if (rand < 0.33) {
            geometry = new THREE.IcosahedronGeometry(0.1);
        } else if (rand < 0.66) {
            geometry = new THREE.DodecahedronGeometry(0.1);
        } else {
            geometry = new THREE.TetrahedronGeometry(0.1);
        }
        const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        return new THREE.Mesh(geometry, material);
    }

    createParticleRing(innerRadius, outerRadius, particleCount, thickness) {
        const ringParticles = [];
        for (let i = 0; i < particleCount; i++) {
            const particle = this.createRingParticle();
            const angle = Math.random() * 2 * Math.PI;
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
            particle.position.set(
                // Pocetno stanje
                // Math.cos(angle) * radius + this.position.x,
                // Math.sin(angle) * radius + this.position.y,
                // (Math.random() - 0.5) * thickness + this.position.z
                
                // Nakon rotacije u odnosu na ravan planeta
                // Math.cos(angle) * radius + this.position.x,
                // (Math.random() - 0.5) * thickness + this.position.y, // Adjusted to be flat on x-axis
                // Math.sin(angle) * radius + this.position.z

                // Pre svrstavanja u grupu
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * thickness, // Adjusted to be flat on x-axis
                Math.sin(angle) * radius
            );
            particle.rotation.x = Math.PI / 2; // Rotate particle to lie flat on x-axis
            ringParticles.push(particle);
            this.groupSaturn.add(particle);
            // this.scene.add(particle);
        }
        return ringParticles;
    }

    createSolidRing(innerRadius, outerRadius, color, opacity) {
        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
        const material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: opacity });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2; // Rotate to lie flat
        this.groupSaturn.add(ring);
        // ring.position.set(this.position.x, this.position.y, this.position.z);
        // this.scene.add(ring);
    }

    createRings() {
        return {
            D: this.createParticleRing(this.planetRadius*1.2, this.planetRadius*1.4, 200, 0.1),
            C: this.createParticleRing(this.planetRadius*1.4, this.planetRadius*1.8, 500, 0.1),
            B: this.createParticleRing(this.planetRadius*1.8, this.planetRadius*2.2, 1000, 0.1),
            A: this.createParticleRing(this.planetRadius*2.2, this.planetRadius*2.6, 800, 0.1),
            F: this.createParticleRing(this.planetRadius*2.6, this.planetRadius*2.7, 100, 0.1),
            G: this.createParticleRing(this.planetRadius*2.7, this.planetRadius*2.8, 150, 0.1),
            E: this.createParticleRing(this.planetRadius*2.8, this.planetRadius*4, 300, 0.1),
            // D: this.createParticleRing(6, 7, 200, 0.1),
            // C: this.createParticleRing(7, 9, 500, 0.1),
            // B: this.createParticleRing(9, 11, 1000, 0.1),
            // A: this.createParticleRing(11, 13, 800, 0.1),
            // F: this.createParticleRing(13, 13.5, 100, 0.1),
            // G: this.createParticleRing(13.5, 14, 150, 0.1),
            // E: this.createParticleRing(14, 20, 300, 0.1),
        };
    }

    createSolidRings() {
        this.createSolidRing(this.planetRadius*1.2, this.planetRadius*1.4, 0xCCCCCC, 0.1); // D ring
        this.createSolidRing(this.planetRadius*1.4, this.planetRadius*1.8, 0xAAAAAA, 0.2); // C ring
        this.createSolidRing(this.planetRadius*1.8, this.planetRadius*2.2, 0x999999, 0.3); // B ring
        this.createSolidRing(this.planetRadius*2.2, this.planetRadius*2.6, 0x888888, 0.2); // A ring
        this.createSolidRing(this.planetRadius*2.6, this.planetRadius*2.7, 0x777777, 0.1); // F ring
        this.createSolidRing(this.planetRadius*2.7, this.planetRadius*2.8, 0x666666, 0.05); // G ring
        this.createSolidRing(this.planetRadius*2.8, this.planetRadius*4, 0x555555, 0.01); // E ring
        // this.createSolidRing(6, 7, 0xCCCCCC, 0.1); // D ring
        // this.createSolidRing(7, 9, 0xAAAAAA, 0.2); // C ring
        // this.createSolidRing(9, 11, 0x999999, 0.3); // B ring
        // this.createSolidRing(11, 13, 0x888888, 0.2); // A ring
        // this.createSolidRing(13, 13.5, 0x777777, 0.1); // F ring
        // this.createSolidRing(13.5, 14, 0x666666, 0.05); // G ring
        // this.createSolidRing(14, 20, 0x555555, 0.01); // E ring
    }

    createSaturnsRings(position = { x: 0, y: 0, z: 0 }, saturnRadius = 5, tilt = 26.73) {
        // const tiltInRadians = THREE.Math.degToRad(tilt);
        this.position = position;
        this.planetRadius = saturnRadius;
        this.createRings();
        this.createSolidRings();
        // this.groupSaturn.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.groupSaturn);
        // this.groupSaturn.position.set(this.position.x, this.position.y, this.position.z);

        // this.groupSaturn.rotation.z = tiltInRadians;
    }

    rotateSaturn() {
        this.saturn.rotation.y += 0.001;
    }
}

export {PlanetsExtras}

// // Create the scene
// const scene = new THREE.Scene();

// // Create the camera
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.z = 50;

// // Create the renderer
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Add OrbitControls
// const controls = new THREE.OrbitControls(camera, renderer.domElement);

// // Create Saturn instance
// const saturn = new Saturn(scene);

// // Add lighting to the scene
// const ambientLight = new THREE.AmbientLight(0x404040);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
// pointLight.position.set(10, 10, 10);
// scene.add(pointLight);

// // Animation loop
// function animate() {
//     requestAnimationFrame(animate);
//     saturn.rotateSaturn();
//     renderer.render(scene, camera);
//     controls.update();
// }

// animate();

// // Handle window resize
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });