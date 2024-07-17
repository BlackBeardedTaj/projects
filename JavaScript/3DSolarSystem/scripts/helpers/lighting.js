import * as THREE from 'three';

export function initializeLighting(scene) {
  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(20, 20, 20);
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(pointLight, ambientLight);

  const axesHelper = new THREE.AxesHelper(5);
  const lightHelper = new THREE.PointLightHelper(pointLight);
  const lightHelper2 = new THREE.PointLightHelper(ambientLight);
  scene.add(axesHelper, lightHelper, lightHelper2);
}