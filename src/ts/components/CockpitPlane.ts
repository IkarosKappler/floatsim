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
    const cockpitTexture = new THREE.TextureLoader().load("resources/img/cockpit-nasa.png");
    const cockpitAlpahMap = new THREE.TextureLoader().load("resources/img/cockpit-nasa-alphamap.png");
    var material = new THREE.MeshBasicMaterial({
      color: 0x888888, // Make the cockpit a bit darker
      map: cockpitTexture,
      alphaMap: cockpitAlpahMap,
      transparent: true,
      side: THREE.DoubleSide
    });
    cockpitTexture.wrapS = THREE.ClampToEdgeWrapping;
    cockpitTexture.wrapT = THREE.ClampToEdgeWrapping;
    cockpitAlpahMap.wrapS = THREE.ClampToEdgeWrapping;
    cockpitAlpahMap.wrapT = THREE.ClampToEdgeWrapping;

    var geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
    geometry.rotateX(-Math.PI / 4);
    geometry.translate(0, 0, -12);
    this.mesh = new THREE.Mesh(geometry, material);
  }

  setCockpitSize(width: number, height: number) {
    this.mesh.scale.set(width / 40, height / 40, 1);
  }
}
