/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */

import * as THREE from "three";
// import { clamp } from ""
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
// import * as SceneUtils from "three/examples/jsm/utils/SceneUtils.js";
import { PerlinTerrain } from "./PerlinTerrain";
import { CockpitPlane } from "./CockpitPlane";

export class SceneContainer {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls | FirstPersonControls;
  cockpit: CockpitPlane;

  constructor() {
    const clock = new THREE.Clock();
    // Create new scene
    this.scene = new THREE.Scene();

    // Initialize a new THREE renderer (you are also allowed
    // to pass an existing canvas for rendering).
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);

    const fogLowerColor = new THREE.Color(0x021a38);
    const fogUpperColor = new THREE.Color(0x004001);
    this.scene.background = new THREE.Color(fogLowerColor);
    this.scene.fog = new THREE.FogExp2(fogLowerColor.getHex(), 0.0021);

    // const zStartOffset = 800.0; // ImprovedNoise
    const zStartOffset = 300.0; // Custom noise
    const zMaxOffset = zStartOffset + 500;

    // ... and append it to the DOM
    document.body.appendChild(this.renderer.domElement);

    // Create a geometry conaining the logical 3D information (here: a cube)
    var geometry = new THREE.BoxGeometry(12, 12, 12);

    // Pick a material, something like MeshBasicMaterial, PhongMaterial,
    var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    // Create the cube from the geometry and the material ...
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(12, 12 + zStartOffset, 12);

    // ... and add it to your scene.
    this.scene.add(cube);

    // Add some light
    var pointLight = new THREE.PointLight(0xffffff);
    // var pointLight = new THREE.AmbientLight(0xffffff);

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50 + zStartOffset;
    pointLight.position.z = 130;

    // add to the scene
    this.scene.add(pointLight);

    // Add grid helper
    var gridHelper = new THREE.GridHelper(90, 9, 0xff0000, 0xe8e8e8);
    gridHelper.position.y += zStartOffset;
    this.scene.add(gridHelper);

    // Add an axes helper
    var ah = new THREE.AxesHelper(50);
    ah.position.y -= 0.1; // The axis helper should not intefere with the grid helper
    ah.position.y += zStartOffset;
    this.scene.add(ah);

    // Set the camera position
    this.camera.position.set(75, 75 + zStartOffset, 75);
    // And look at the cube again
    this.camera.lookAt(cube.position);

    // Add cockpit
    this.cockpit = new CockpitPlane();
    // cockpit.mesh.position.y = -10;
    // cockpit.mesh.position.x = 10;
    // cockpit.mesh.position.y = 100;
    this.camera.add(this.cockpit.mesh);
    // To get the Cockpit visible we also need to add the camera to the scene
    this.scene.add(this.camera);

    // Finally we want to be able to rotate the whole scene with the mouse:
    // add an orbit control helper.
    var _self = this;

    // TODO: Use FirstPersonControls!

    /*
    const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    // Always move the point light with the camera. Looks much better ;)
    orbitControls.addEventListener("change", () => {
      pointLight.position.copy(_self.camera.position);
    });
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 1.0;
    orbitControls.enableZoom = true;
    orbitControls.target.copy(cube.position);
*/

    const firstPersonControls = new FirstPersonControls(this.camera, this.renderer.domElement);
    firstPersonControls.movementSpeed = 50;
    firstPersonControls.lookSpeed = 0.05;
    // firstPersonControls.noFly = true;
    firstPersonControls.lookVertical = true;
    firstPersonControls.constrainVertical = true;
    firstPersonControls.verticalMin = Math.PI * 0.25; // in radians
    firstPersonControls.verticalMax = Math.PI * 0.75; // in radians
    // firstPersonControls.lon = -150;
    // firstPersonControls.lat = 120;

    this.controls = firstPersonControls;

    console.log("Stats", Stats);
    const stats = new (Stats as any)();
    document.querySelector("body").appendChild(stats.domElement);

    const updateFogColor = () => {
      var curOffset = this.camera.position.y;
      var pct = (THREE.MathUtils.clamp(curOffset, zStartOffset, zMaxOffset) - zStartOffset) / (zMaxOffset - zStartOffset);
      // console.log("curOffset", curOffset, "zStartOffset", zStartOffset, "zMaxOffset", zMaxOffset, "pct", pct);
      // var color = Math.floor(fogLowerColor + (fogUpperColor - fogLowerColor) * pct);
      this.scene.fog.color.lerpColors(fogLowerColor, fogUpperColor, pct); //set(color);
      (this.scene.background as THREE.Color).set(this.scene.fog.color);
    };

    // This is the basic render function. It will be called perpetual, again and again,
    // depending on your machines possible frame rate.
    const _render = () => {
      // Pass the render function itself

      updateFogColor();
      firstPersonControls.update(clock.getDelta());
      stats.update();

      // Let's animate the cube: a rotation.
      cube.rotation.x += 0.05;
      cube.rotation.y += 0.04;

      this.renderer.render(this.scene, this.camera);
      // drawHUD();

      requestAnimationFrame(_render);
    };

    const worldWidth = 256;
    const worldDepth = 256;
    // console.log("PerlinTerrain", PerlinTerrain);
    const terrainData: Uint8Array = PerlinTerrain.generatePerlinHeight(worldWidth, worldWidth);
    var terrain = new PerlinTerrain(terrainData, worldWidth, worldDepth); // .makeTerrain();
    this.scene.add(terrain.mesh);

    // var mouseEnabled = true;
    window.addEventListener("resize", () => {
      _self.onWindowResize();
    });
    // Enable and disable mouse controls when mouse leaves/re-enters the screen.
    this.renderer.domElement.addEventListener("mouseleave", () => {
      console.log("leave");
      _self.controls.enabled = false;
    });
    this.renderer.domElement.addEventListener("mouseenter", () => {
      _self.controls.enabled = true;
    });

    /*
    // BEGIN Try a HUD
    // Ok, now we have the cube. Next we'll create the hud. For that we'll
    // need a separate scene which we'll render on top of our 3D scene. We'll
    // use a dynamic texture to render the HUD.

    // We will use 2D canvas element to render our HUD.
    var hudCanvas = document.createElement("canvas");
    // hudCanvas.style.background = "rgba(255,255,255,0.5)";

    // Again, set dimensions to fit the screen.
    const width = 780; // TODO get canvas size here
    const height = 946;
    hudCanvas.width = width;
    hudCanvas.height = height;

    // Get 2D context and draw something supercool.
    var hudBitmap = hudCanvas.getContext("2d");
    // hudBitmap.globalCompositeOperation = ;
    hudBitmap.font = "Normal 40px Arial";
    hudBitmap.textAlign = "center";
    hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
    hudBitmap.fillText("Initializing...", width / 2, height / 2);
    var hudImage = new Image();
    hudImage.onload = function () {
      // hudBitmap.drawImage(hudImage, 69, 50);
    };
    hudImage.src = "img/cockpit-nasa.png";

    const hudImageAlphaMap = new THREE.TextureLoader().load("img/cockpit-nasa-alphamap.png");

    // Create the camera and set the viewport to match the screen dimensions.
    var cameraHUD = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 30);

    // Create also a custom scene for HUD.
    const sceneHUD = new THREE.Scene();

    // Create texture from rendered graphics.
    var hudTexture = new THREE.Texture(hudCanvas);
    hudTexture.needsUpdate = true;

    // Create HUD material.
    var hudMaterial = new THREE.MeshBasicMaterial({
      // color: new THREE.Color(0xffffffff),
      map: hudTexture,
      alphaMap: hudImageAlphaMap,
      transparent: true
      // opacity: 1
    });
    hudMaterial.transparent = true;
    hudMaterial.alphaTest = 0.5;
    // hudMaterial.color.

    // Create plane to render the HUD. This plane fill the whole screen.
    var planeGeometry = new THREE.PlaneGeometry(width, height);
    var plane = new THREE.Mesh(planeGeometry, hudMaterial);
    sceneHUD.add(plane);

    // Now we have two scenes. Only thing we need now is a render loop!
    // this.renderer.autoClear = true;
    this.renderer.setClearColor(0xffffff, 0.0);
    function drawHUD() {
      // Rotate cube.
      // cube.rotation.x += 0.01;
      // cube.rotation.y -= 0.01;
      // cube.rotation.z += 0.03;

      // Update HUD graphics.
      hudBitmap.globalAlpha = 0.5;
      hudBitmap.fillStyle = "rgba(255,255,255,0.5)";

      // hudBitmap.clearRect(0, 0, width, height);
      hudBitmap.drawImage(hudImage, 0, 0); // 69, 50);
      hudBitmap.fillText(
        "RAD [x:" +
          (cube.rotation.x % (2 * Math.PI)).toFixed(1) +
          ", y:" +
          (cube.rotation.y % (2 * Math.PI)).toFixed(1) +
          ", z:" +
          (cube.rotation.z % (2 * Math.PI)).toFixed(1) +
          "]",
        width / 2,
        height / 2
      );
      hudTexture.needsUpdate = true;

      // Render scene.
      // renderer.render(scene, camera);

      // Render HUD on top of the scene.
      _self.renderer.render(sceneHUD, cameraHUD);

      // Request new frame.
      // requestAnimationFrame(animate);
    }
    // END Try a HUD
    */

    // Call the rendering function. This will cause and infinite recursion (we want
    // that here, because the animation shall run forever).
    this.onWindowResize();
    _render();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.cockpit.setCockpitSize(window.innerWidth, window.innerHeight);

    if (this.controls.hasOwnProperty("handleResize")) {
      (this.controls as FirstPersonControls).handleResize();
    }
  }
}
