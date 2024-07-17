import * as THREE from 'three'; 


class Planet {
    constructor(name, texturePath, position = { x: 0, y: 0, z: 0 }, radius, sphereDetail) {
      this.name = name;
      this.texturePath = texturePath;
      this.position = position;
      this.radius = radius;
      this.sphereDetail = sphereDetail;
      this.lod = null;
      this.loaded = false;
      this.mesh = null; // Add mesh property and initialize it as null
      this.geometry = null;
      this.material  = new THREE.MeshBasicMaterial({ color: 0xffffff });
    }
  
    load(callback) {
      const texture = new THREE.TextureLoader().load(this.texturePath, callback);
      this.material = new THREE.MeshStandardMaterial({ map: texture });
  
      this.lod = new THREE.LOD();
      this.sphereDetail.forEach(detail => {
        const geometry = new THREE.SphereBufferGeometry(this.radius, detail.segments, detail.segments);
        const mesh = new THREE.Mesh(geometry, this.material);
        mesh.distance = detail.distance;
        this.lod.addLevel(mesh, detail.distance);
      });
  
      this.lod.position.copy(this.position);
      this.loaded = true;
      this.mesh = this.lod; // Assign the lod as the mesh
      
      this.geometry = this.lod.children[0].geometry; // Assign the geometry from the first child mesh

      // console.log(this.geometry)


      return this.lod;
    }

    getObjectForCurrentLOD(distance) {
      const currentLOD = this.lod._currentLevel;
      console.log(this.lod.children[currentLOD])
      return this.lod.children[currentLOD];
    }
  
    addToScene(scene) {
      if (this.loaded) {
        scene.add(this.lod);
      }
    }
  
    update(camera) {
      if (this.loaded) {
        // console.log("evo me ovde!!!!!!")
        const frustum = new THREE.Frustum();
        const cameraViewProjectionMatrix = new THREE.Matrix4();
        cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        // console.log(camera.projectionMatrix)
        frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);
  
        const sphere = new THREE.Sphere(this.position, this.radius);
        if (frustum.intersectsSphere(sphere)) {
          // console.log("evo me sad ovde!!!")
          this.lod.update(camera);
        }
      }
    }
  }

  export { Planet }
  