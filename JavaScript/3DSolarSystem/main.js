import './style.css'
import * as THREE from 'three'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// https://youtu.be/DSUGOZTJ0Lg
// https://www.youtube.com/watch?v=zjMuIxRvygQ&ab_channel=3Blue1Brown
// https://www.youtube.com/watch?v=lcE3s5noEE4&ab_channel=kwynintelligence

// Scene object
const scene = new THREE.Scene();
const clock = new THREE.Clock();


var keys, goal, follow;

var time = 0;
var newPosition = new THREE.Vector3();
var matrix = new THREE.Matrix4();

var stop = 1;
var DEGTORAD = 0.01745327;
var temp = new THREE.Vector3;
var dir = new THREE.Vector3;
var a = new THREE.Vector3;
var b = new THREE.Vector3;
var distance = 0.3;
var velocity = 0.0;
var speed = 0.0;

let sceneMeshes = [];

// Camera object
const perspectiveCamera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 50, 1e7 )
perspectiveCamera.lookAt(scene.position)

// Renderer object
const renderer = new THREE.WebGLRenderer({
});
document.body.appendChild( renderer.domElement );

// Renderer
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
perspectiveCamera.position.setZ(30);
renderer.render( scene, perspectiveCamera )



// Light
// PointLight
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(20,20,20)
// AmbientLight
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

// Helper classes
const lightHelper = new THREE.PointLightHelper(pointLight);
const axesHelper = new THREE.AxesHelper(5);
scene.add(lightHelper, axesHelper)

// Controls - to help us move
const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
controls.movementSpeed = 1000;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = false;
let rocket = new THREE.Object3D();

// Loader
const loader = new GLTFLoader();
loader.load( '3DModels/rocket/scene.gltf', function ( gltf ) {
  rocket = gltf.scene;
  rocket.name = 'rocket';
	scene.add( rocket );
} );

goal = new THREE.Object3D;
follow = new THREE.Object3D;
follow.position.z = -distance;
rocket.add(follow);
goal.add(perspectiveCamera);
scene.add(rocket);

// Space
const spaceTexture = new THREE.TextureLoader().load('img/Universe/2k_stars_milky_way.jpg');
scene.background = spaceTexture;

// Objects
// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 500 ));
  star.position.set(x,y,z);
  scene.add(star)
}
Array(1500).fill().forEach(addStar)

// Sun

const sunTexture = new THREE.TextureLoader().load('img/Stars/2k_sun.jpg');
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(891.400,500,500), //1391.400
  new THREE.MeshBasicMaterial( { map: sunTexture } )
);
scene.add(sun);
sun.position.set(0,0,0);




// Mercury
const mercuryTexture = new THREE.TextureLoader().load('img/Planets/2k_mercury.jpg');
const mercury = new THREE.Mesh(
  new THREE.SphereGeometry(4.879,30,30),
  new THREE.MeshBasicMaterial( { map: mercuryTexture } )
);
scene.add(mercury);
mercury.position.z = 1057.91;
// mercury.position.setX(-50);

// Venus
const venusTexture = new THREE.TextureLoader().load('img/Planets/2k_venus_surface.jpg');
const venus = new THREE.Mesh(
  new THREE.SphereGeometry(12.104,30,30),
  new THREE.MeshBasicMaterial( { map: venusTexture } )
);
scene.add(venus);
venus.position.z = 1108.2;
venus.position.setX(-50);

// Earth
const earthTexture = new THREE.TextureLoader().load('img/Planets/2k_earth_daymap.jpg');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(12.756,500,500),
  new THREE.MeshBasicMaterial( { map: earthTexture } )
);
scene.add(earth);
earth.position.z = 1149.6;
earth.position.setX(-50);

// Mars
const marsTexture = new THREE.TextureLoader().load('img/Planets/2k_mars.jpg');
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(6.792,500,500),
  new THREE.MeshBasicMaterial( { map: marsTexture } )
);
scene.add(mars);
mars.position.z = 1227.9;
mars.position.setX(-50);

// Jupiter
const jupiterTexture = new THREE.TextureLoader().load('img/Planets/2k_jupiter.jpg');
const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(142.984,500,500),
  new THREE.MeshBasicMaterial( { map: jupiterTexture } )
);
scene.add(jupiter);
jupiter.position.z = 1778.5;
jupiter.position.setX(-50);

// Saturn
const saturnTexture = new THREE.TextureLoader().load('img/Planets/2k_saturn.jpg');
const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(120.536,500,500),
  new THREE.MeshBasicMaterial( { map: saturnTexture } )
);
scene.add(saturn);
saturn.position.z = 2434;
saturn.position.setX(-50);

// Uranus
const uranusTexture = new THREE.TextureLoader().load('img/Planets/2k_uranus.jpg');
const uranus = new THREE.Mesh(
  new THREE.SphereGeometry(51.118,500,500),
  new THREE.MeshBasicMaterial( { map: uranusTexture } )
);
scene.add(uranus);
uranus.position.z = 3871;
uranus.position.setX(-50);

// Nuptune
const neptuneTexture = new THREE.TextureLoader().load('img/Planets/2k_neptune.jpg');
const neptune = new THREE.Mesh(
  new THREE.SphereGeometry(49.528,500,500),
  new THREE.MeshBasicMaterial( { map: neptuneTexture } )
);
scene.add(neptune);
neptune.position.z = 5495;
neptune.position.setX(-50);

// Pluto
const plutoTexture = new THREE.TextureLoader().load('img/Planets/plutomap2k.jpg');
const pluto = new THREE.Mesh(
  new THREE.SphereGeometry(2.370,500,500),
  new THREE.MeshBasicMaterial( { map: plutoTexture } )
);
scene.add(pluto);
pluto.position.z = 6906.38;
pluto.position.setX(-50);

// Moon
const moonTexture = new THREE.TextureLoader().load('img/Moons/lroc_color_poles_1k.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshBasicMaterial( { map: moonTexture } )
);
scene.add(moon);
moon.position.z = 30;
moon.position.setX(-10);

keys = {
  a: false,
  s: false,
  d: false,
  w: false,
  q: false,
  e: false,
  space: false,
  shiftleft: false,
};

document.addEventListener("keydown", function(e) {
  console.log(e.code);
  const key = e.code.replace('Key', '').toLowerCase();
    if ( keys[ key ] !== undefined )
      keys[ key ] = true;
});

document.body.addEventListener( 'keyup', function(e) {
    
  const key = e.code.replace('Key', '').toLowerCase();
  if ( keys[ key ] !== undefined )
    keys[ key ] = false;
});

function followCamera()
{
    //Offset from camera to player
    var relativeCameraOffset = new THREE.Vector3(0,-80,0);

    //UPDATE PLAYER WORLD MATRIX FOR PERFECT CAMERA FOLLOW
    rocket.updateMatrixWorld()
    //Apply offset to player matrix
	var cameraOffset = relativeCameraOffset.applyMatrix4( rocket.matrixWorld );


    //SMOOTH CAMERA POSITION TO TARGET POSITION
    perspectiveCamera.position.lerp(cameraOffset, 0.1);
    perspectiveCamera.lookAt( rocket.position );
}

// Main method - Animate objects
function animate() {
  const delta = clock.getDelta();

  requestAnimationFrame( animate );

  speed = 0.0;
  moon.rotation.y += 0.005;
    
    let x_axis = new THREE.Vector3(1,0,0);
    let rot, cur;
  if ( keys.w )
    rocket.rotateX(0.03);

  if ( keys.s )
  rocket.rotateX(-0.03);

  if ( keys.a )
  rocket.rotateZ(0.03);

  if ( keys.d )
  rocket.rotateZ(-0.03);

  if ( keys.q )
  rocket.rotateY(-0.06);

  if ( keys.e )
  rocket.rotateY(0.06);

  if ( keys.space )
    speed = 0.9;

  velocity += ( speed - velocity ) * .3;
  rocket.translateY( velocity );

  if ( keys.shiftleft )
    speed = 0.9*5;
    velocity += ( speed - velocity ) * .3; 
    rocket.translateY( velocity );
  
  followCamera()
  controls.update(delta);
  renderer.render( scene, perspectiveCamera );
}
animate();
