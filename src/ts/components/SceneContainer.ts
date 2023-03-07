/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class SceneContainer {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;

  constructor() {
    /**
     * Example for a basic THREE.js scene setup.
     *
     * @author  Ikaros Kappler
     * @date    2015-11-09
     * @version 1.0.0
     **/

    // Create new scene
    this.scene = new THREE.Scene();

    // Create a camera to look through
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Initialize a new THREE renderer (you are also allowed
    // to pass an existing canvas for rendering).
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // ... and append it to the DOM
    document.body.appendChild(this.renderer.domElement);

    // Create a geometry conaining the logical 3D information (here: a cube)
    var geometry = new THREE.BoxGeometry(12, 12, 12);

    // Pick a material, something like MeshBasicMaterial, PhongMaterial,
    var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    // Create the cube from the geometry and the material ...
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(12, 12, 12);

    // ... and add it to your scene.
    this.scene.add(cube);

    // Add some light
    var pointLight = new THREE.PointLight(0xffffff);
    //this.pointLight = new THREE.AmbientLight(0xFFFFFF);

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    // add to the scene
    this.scene.add(pointLight);

    // Add grid helper
    var gridHelper = new THREE.GridHelper(90, 9, 0xff0000, 0xe8e8e8);
    this.scene.add(gridHelper);

    // Add an axes helper
    var ah = new THREE.AxesHelper(50);
    ah.position.y -= 0.1; // The axis helper should not intefere with the grid helper
    this.scene.add(ah);

    // Set the camera position
    this.camera.position.set(75, 75, 75);
    // And look at the cube again
    this.camera.lookAt(cube.position);

    // Finally we want to be able to rotate the whole scene with the mouse:
    // add an orbit control helper.
    var _self = this;
    const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    // Always move the point light with the camera. Looks much better ;)
    orbitControls.addEventListener("change", function () {
      pointLight.position.copy(_self.camera.position);
    });
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 1.0;
    orbitControls.enableZoom = true;
    orbitControls.target.copy(cube.position);

    // This is the basic render function. It will be called perpetual, again and again,
    // depending on your machines possible frame rate.
    const _render = () => {
      // Pass the render function itself
      requestAnimationFrame(_render);

      // Let's animate the cube: a rotation.
      cube.rotation.x += 0.05;
      cube.rotation.y += 0.04;

      this.renderer.render(this.scene, this.camera);
    };
    // Call the rendering function. This will cause and infinite recursion (we want
    // that here, because the animation shall run forever).
    _render();
  }
}
