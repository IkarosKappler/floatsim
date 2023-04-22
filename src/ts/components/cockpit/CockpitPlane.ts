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
  private readonly textureSize: { width: number; height: number };

  constructor() {
    // Initially (using real size when textue is loaded)
    this.textureSize = { width: 100, height: 100 };
    const cockpitTexture = new THREE.TextureLoader().load("resources/img/cockpit-nasa.png", tex => {
      this.textureSize.width = tex.image.width;
      this.textureSize.height = tex.image.height;
      console.log("[CockpitPlane] TextureSize", this.textureSize);
    });
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
    geometry.translate(0, 0, -250); //-12);
    this.mesh = new THREE.Mesh(geometry, material);
  }

  setCockpitSize(width: number, height: number) {
    // this.mesh.scale.set(width / 40, height / 40, 1);
    // this.mesh.scale.set(width, height, 1);

    // Find best fit
    var ratio = 1.5; //height / width;
    this.mesh.scale.set(width * ratio, height * ratio, 1);
    console.log("[CockpitPlane] setCockpitSize", width, height, width / this.textureSize.width, height / this.textureSize.height);
    // this.mesh.scale.set(this.textureSize.width / width, height / this.textureSize.height, 1);
    // this.mesh.scale.set(this.textureSize.width / width, this.textureSize.height / height, 1);
  }
}
