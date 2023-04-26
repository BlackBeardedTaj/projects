import './style.css'
import * as THREE from 'three'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene object
const scene = new THREE.Scene();
const clock = new THREE.Clock();

var keys;
var velocity = 0.0;
var speed;

let score = 0;

// Camera object
let perspectiveCamera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 1e7 )

// Renderer object
const renderer = new THREE.WebGLRenderer({
  canvas: bg,
  antialias: true
});
document.body.appendChild( renderer.domElement );

// Renderer
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.render( scene, perspectiveCamera )

// PointLight
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(20,20,20)

// AmbientLight
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// Controls
const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
controls.movementSpeed = 1000;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = false;

// Rocket 
const geometry = new THREE.BoxGeometry( 1, 1, 3 );
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const rocket = new THREE.Mesh( geometry, material );
scene.add(rocket);

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 500 ));
  star.position.set(x,y,z);
  scene.add(star)

  // Create a sphere around the star object
  // const starSphere = new THREE.Sphere().setFromObject(star);

  // Add the sphere to an array of spheres
  stars.push(star);
}
const stars = [];
Array(1500).fill().forEach(addStar)

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

// 
let goal = new THREE.Object3D;
goal.add(perspectiveCamera);

// Create a Vector3 to represent the camera's offset from the object
var offset = new THREE.Vector3(0, 0, 80);

function followCamera()
{
    // Set the camera position to the rocket's position
    perspectiveCamera.position.copy(rocket.position).add(offset.clone().applyQuaternion(rocket.quaternion));

    // Rotate the camera to match the rocket's rotation
    perspectiveCamera.rotation.copy(rocket.rotation);
}

function updateScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.innerHTML = `Score: ${score}`;
}

// Animate method
function animate() {
  const delta = clock.getDelta();
  requestAnimationFrame( animate );

  speed = 0.0;
    
  if ( keys.w )
    rocket.rotateX(0.02);

  if ( keys.s )
    rocket.rotateX(-0.02);

  if ( keys.a )
    rocket.rotateY(0.02);

  if ( keys.d )
    rocket.rotateY(-0.02);

  if ( keys.q )
    rocket.rotateZ(-0.05);

  if ( keys.e )
    rocket.rotateZ(0.05);

  if ( keys.space )
    speed = -0.8;
    velocity += ( speed - velocity ) * .2;
    rocket.translateZ( velocity );

  if ( keys.shiftleft )
    speed = 0.8*5;
    velocity += ( speed - velocity ) * .2; 
    rocket.translateZ( velocity );
  

    for ( let i = 0; i < stars.length; i++ ) {
      const star = stars[i];
  
      const rocketSphere = new THREE.Sphere();
      rocketSphere.center.copy(rocket.position);
      rocketSphere.radius = rocket.scale.x * 0.5;

      // Create a sphere around the star
      const starSphere = new THREE.Sphere();
      starSphere.center.copy(star.position);
      starSphere.radius = star.geometry.parameters.radius;
  
      // Check if the rocket intersects with the star sphere
      if (rocketSphere.intersectsSphere(starSphere)) {
        // Handle collision
        scene.remove(star);
        stars.splice(i, 1);
        score++;
        updateScore();
      }
    }
    
  followCamera()
  
  controls.update(delta);
  renderer.render( scene, perspectiveCamera );
}
animate();
