/**
 * A simple cockpit: a texture plus alpha channel on a plane placed in
 * front of the camera.
 *
 * @author  Ikaros Kappler
 * @date    2023-03-08
 * @version 1.0.0
 */

import * as THREE from "three";

export class CockpitPlane {
  readonly mesh: THREE.Mesh;

  constructor() {
    const cockpitTexture = new THREE.TextureLoader().load("img/cockpit-nasa.png");
    const cockpitAlpahMap = new THREE.TextureLoader().load("img/cockpit-nasa-alphamap.png");
    var material = new THREE.MeshBasicMaterial({
      color: 0x888888,
      map: cockpitTexture,
      alphaMap: cockpitAlpahMap,
      transparent: true,
      side: THREE.DoubleSide
    });
    cockpitTexture.wrapS = THREE.ClampToEdgeWrapping;
    cockpitTexture.wrapT = THREE.ClampToEdgeWrapping;
    cockpitAlpahMap.wrapS = THREE.ClampToEdgeWrapping;
    cockpitAlpahMap.wrapT = THREE.ClampToEdgeWrapping;

    // Create a geometry conaining the logical 3D information (here: a cube)
    // var cubegeometry = new THREE.BoxGeometry(2, 2, 2);
    // // Pick a material, something like MeshBasicMaterial, PhongMaterial,
    // var cubematerial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    // // Create the cube from the geometry and the material ...
    // var cube = new THREE.Mesh(cubegeometry, cubematerial);
    // cube.position.set(0, 0, -12);

    var geometryco = new THREE.PlaneGeometry(1, 1, 10, 10);
    geometryco.rotateX(-Math.PI / 4);
    geometryco.translate(0, 0, -12);
    this.mesh = new THREE.Mesh(geometryco, material);
  }

  setCockpitSize(width: number, height: number) {
    this.mesh.scale.set(width / 40, height / 40, 1);
  }
}
