import './style.css';
import * as THREE from 'three'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { 
  Controls,
  Player,
  Enemy,
  GamepadController,
  Planet,
  PopulateSpace,
  Score,
  ShootingMechanism,
  initializeLighting,
  checkRocketCollision,
  handlePlanetLanding,
  setupPlanetList,
  followCamera
} from './scripts/utilities/index';

// Scene object
const scene = new THREE.Scene();
const clock = new THREE.Clock();

var speed;
let scoreBalance = 0;
const enemies = [];
let projectiles = []

// Camera object
let perspectiveCamera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 1e7 )

// Renderer object
const renderer = new THREE.WebGLRenderer({
  // canvas: document.querySelector('#bg'),
  canvas: bg,
  antialias: true
});
document.body.appendChild( renderer.domElement );

// Renderer
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );


// Lighting
initializeLighting(scene);

// Rocket 
const geometry = new THREE.BoxGeometry( 1, 1, 3 );
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const rocket = new THREE.Mesh( geometry, material );
scene.add(rocket);

// Populate Space
const populateSpace = new PopulateSpace(scene, perspectiveCamera);
populateSpace.addBackground();
populateSpace.addStars(2000, 1500);
populateSpace.addSun();
const planets = populateSpace.planets



// Create enemies
for (let i = 0; i < 10; i++) {
  const enemy = new Enemy(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.Vector3(Math.random() * 800 - 400, Math.random() * 800 - 400, 0),
    new THREE.Vector3(Math.random() * 100 - 50, Math.random() * 100 - 50, 0),
    100,
    150
  );
  scene.add(enemy);
  enemies.push(enemy);
}

const shootingMechanism = new ShootingMechanism (rocket, new THREE.Vector3(0,0,0), scene, enemies, scoreBalance, projectiles)

// Controls
let keyboardControls = new Controls(rocket, shootingMechanism ) // keyboardControls.setControls("i","","j","l")
const gamepadController = new GamepadController(rocket, shootingMechanism);

setupPlanetList(populateSpace, rocket, renderer, scene, perspectiveCamera);

// ***********************************

let nearestPlanet=null;
let hasRocketLanded = false;
// let landingInitiated = false;

const astronaut = new Player(scene, perspectiveCamera, renderer, nearestPlanet, rocket)


// const planets = populateSpace.planets.filter((planet) => planet.name !== "Sun"); // Exclude Sun or include only landable planets

handlePlanetLanding(rocket, planets, astronaut);

// ************************************

astronaut.hasAstronautsRocketLanded = hasRocketLanded;
// astronaut.setNearestPlanet(nearestPlanet);

astronaut.isAstronautActive=false;

const offset = new THREE.Vector3(0, 0, 80);
const offset2 = new THREE.Vector3(0, 5, 30);

// Animate method
function animate() {
  const delta = clock.getDelta();
  requestAnimationFrame(animate);
  const rocketPosition = rocket.position;
  keyboardControls.controlsListener(rocket, shootingMechanism, astronaut.isAstronautActive, astronaut,/* nearestPlanet,*/ astronaut.hasAstronautsRocketLanded/*hasRocketLanded*/);
  checkRocketCollision(rocket, populateSpace.stars, scene, scoreBalance);  shootingMechanism.updateShooting();
  enemies.forEach((enemy) => {
    enemy.update(delta, rocketPosition, enemies);
  });
  shootingMechanism.checkCollisions();
  followCamera(perspectiveCamera, rocket, astronaut, hasRocketLanded);
  renderer.render(scene, perspectiveCamera);
  populateSpace.updateSun();
}
gamepadController.gameLoop();
animate();
