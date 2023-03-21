/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */

import * as THREE from "three";
import PlaySound from "play-sound";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { Stats } from "../Stats";
import { PerlinTerrain } from "./PerlinTerrain";
import { CockpitPlane } from "./CockpitPlane";
import { HudComponent } from "./HudComponent";
import { PerlinHeightMap, SceneData, Size3Immutable } from "./interfaces";
import { FogHandler } from "./FogHandler";
import { PhysicsHandler } from "./PhysicsHandler";
import { Params } from "../utils/Params";
import { PerlinTexture } from "../utils/texture/PerlinTexture";
import { AudioPlayer } from "../utils/AudioPlayer";

export class SceneContainer {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly clock: THREE.Clock;
  readonly stats: Stats;
  readonly controls: OrbitControls | FirstPersonControls;
  readonly cockpit: CockpitPlane;
  readonly hud: HudComponent;
  readonly fogHandler: FogHandler;

  readonly sceneData: SceneData;

  // Example cube
  cube: THREE.Mesh;

  constructor(params: Params) {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    this.sceneData = {
      initialDepth: params.getNumber("initialDepth", -898.0), // -898.0,
      deepFogDepth: {
        max: -1200,
        min: -2000
      },
      highFogDepth: {
        max: -100,
        min: -500
      }
    };

    // Initialize a new THREE renderer (you are also allowed
    // to pass an existing canvas for rendering).
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // this.renderer.setClearColor(0xffffff, 0);
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = !params.getBoolean("disableShadows", false);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 10000);

    this.fogHandler = new FogHandler(this);
    this.scene.background = new THREE.Color(this.fogHandler.fogNormalColor);
    this.scene.fog = new THREE.FogExp2(this.fogHandler.fogNormalColor.getHex(), 0.0021);

    // ... and append it to the DOM
    document.body.appendChild(this.renderer.domElement);

    // Create a geometry conaining the logical 3D information (here: a cube)
    var cubeGeometry = new THREE.BoxGeometry(12, 12, 12);

    // Pick a material, something like MeshBasicMaterial, PhongMaterial,
    var cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    // const layerMaterial = new THREE.Layers();
    // cubeGeometry.clearGroups();
    // cubeGeometry.addGroup( 0, Number.POSITIVE_INFINITY, 0 );
    // cubeGeometry.addGroup( 0, Number.POSITIVE_INFINITY, 1 );

    // Create the cube from the geometry and the material ...
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.position.set(12, 12 + this.sceneData.initialDepth, 12);

    // ... and add it to your scene.
    this.scene.add(this.cube);

    // Add some light
    var pointLight = new THREE.PointLight(0xffffff);
    // var pointLight = new THREE.AmbientLight(0xffffff);
    pointLight.position.x = 10;
    pointLight.position.y = 50 + this.sceneData.initialDepth;
    pointLight.position.z = 130;
    this.scene.add(pointLight);

    // Add a directional light (for shadows)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    const dLight = 200;
    const sLight = dLight * 0.25;
    directionalLight.shadow.camera.left = -sLight;
    directionalLight.shadow.camera.right = sLight;
    directionalLight.shadow.camera.top = sLight;
    directionalLight.shadow.camera.bottom = -sLight;

    directionalLight.shadow.camera.near = dLight / 30;
    directionalLight.shadow.camera.far = dLight;

    directionalLight.shadow.mapSize.x = 1024 * 2;
    directionalLight.shadow.mapSize.y = 1024 * 2;
    this.scene.add(directionalLight);

    // Add grid helper
    var gridHelper = new THREE.GridHelper(90, 9, 0xff0000, 0xe8e8e8);
    gridHelper.position.y += this.sceneData.initialDepth;
    this.scene.add(gridHelper);

    // Add an axes helper
    var ah = new THREE.AxesHelper(50);
    ah.position.y -= 0.1; // The axis helper should not intefere with the grid helper
    ah.position.y += this.sceneData.initialDepth;
    this.scene.add(ah);

    // Set the camera position
    this.camera.position.set(75, 75 + this.sceneData.initialDepth, 75);
    // And look at the cube again
    this.camera.lookAt(this.cube.position);

    // Add cockpit
    this.cockpit = new CockpitPlane();
    this.camera.add(this.cockpit.mesh);

    this.hud = new HudComponent(this.renderer.domElement.width, this.renderer.domElement.height);

    // To get the Cockpit visible we also need to add the camera to the scene
    this.scene.add(this.camera);

    // Finally we want to be able to rotate the whole scene with the mouse:
    // add an orbit control helper.
    var _self = this;

    /*
    const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    // Always move the point light with the camera. Looks much better ;)
    orbitControls.addEventListener("change", () => {
      pointLight.position.copy(_self.camera.position);
    });
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 1.0;
    orbitControls.enableZoom = true;
    orbitControls.target.copy(this.cube.position);
    */

    const firstPersonControls = new FirstPersonControls(this.camera, this.renderer.domElement);
    firstPersonControls.movementSpeed = 35; // 50;
    firstPersonControls.lookSpeed = 0.05;
    // firstPersonControls.noFly = true;
    firstPersonControls.lookVertical = true;
    firstPersonControls.constrainVertical = true;
    firstPersonControls.verticalMin = Math.PI * 0.25; // in radians
    firstPersonControls.verticalMax = Math.PI * 0.75; // in radians
    // firstPersonControls.lon = -150;
    // firstPersonControls.lat = 120;
    // firstPersonControls.enabled = true;
    // console.log("firstPersonControls", firstPersonControls);

    this.controls = firstPersonControls;

    // console.log("Stats", Stats);
    this.stats = new (Stats as any).Stats();
    document.querySelector("body").appendChild(this.stats.domElement);

    // // This is the basic render function. It will be called perpetual, again and again,
    // // depending on your machines possible frame rate.
    const _render = () => {
      // Pass the render function itself
      let delta = this.clock.getDelta();
      let elapsedTime = _self.clock.getElapsedTime();

      this.fogHandler.updateFogColor();
      firstPersonControls.update(delta);
      this.stats.update();

      // Let's animate the cube: a rotation.
      this.cube.rotation.x += 0.05;
      this.cube.rotation.y += 0.04;

      this.renderer.render(this.scene, this.camera);
      this.hud.renderHud(this.renderer, { depth: this.camera.position.y });

      terrain.causticShaderMaterial.update(elapsedTime, this.scene.fog.color);

      physicsHandler.render();

      requestAnimationFrame(_render);
    };

    // const zStartOffset = 800.0; // for ImprovedNoise
    const zStartOffset = 300.0; // for Custom noise
    const worldWidthSegments = 256;
    const worldDepthSegments = 256;
    const perlinOptions = { iterations: 5, quality: 1.5 };
    const terrainData: PerlinHeightMap = PerlinTerrain.generatePerlinHeight(
      worldWidthSegments,
      worldDepthSegments,
      perlinOptions
    );
    const terrainSize: Size3Immutable = { width: 7500, depth: 7500, height: 0 };
    const terrainTexture = new PerlinTexture(terrainData, terrainSize);
    const terrain = new PerlinTerrain(terrainData, terrainSize, terrainTexture); // , worldWidthSegments, worldDepthSegments); // .makeTerrain();
    console.log("terrainData", terrainData);
    terrain.mesh.position.y = this.sceneData.initialDepth - zStartOffset;
    this.scene.add(terrain.mesh);

    var imageData = terrainTexture.imageData;
    var buffer = imageData.data.buffer; // ArrayBuffer
    var arrayBuffer = new ArrayBuffer(imageData.data.length);
    var binary = new Uint8Array(arrayBuffer);
    for (var i = 0; i < binary.length; i++) {
      binary[i] = imageData.data[i];
    }
    var dTex = new THREE.DataTexture(arrayBuffer, worldWidthSegments, worldDepthSegments, THREE.RGBAFormat);
    //   var dTex = baseTexture.imageDataArray; //new THREE.DataTexture(baseTexture.imageDataArray, worldWidthSegments, worldDepthSegments, THREE.RGBAFormat);
    dTex.needsUpdate = true;

    window.addEventListener("resize", () => {
      _self.onWindowResize();
    });
    // Enable and disable mouse controls when mouse leaves/re-enters the screen.
    this.renderer.domElement.addEventListener("mouseleave", () => {
      console.log("leave");
      _self.controls.enabled = false;
    });
    this.renderer.domElement.addEventListener("mouseenter", () => {
      console.log("enter");
      _self.controls.enabled = true;
      console.log(_self.controls);
    });

    // Call the rendering function. This will cause and infinite recursion (we want
    // that here, because the animation shall run forever).
    this.onWindowResize();

    // Initialize physics
    const physicsHandler = new PhysicsHandler(this, terrain);
    physicsHandler.start().then(_render);
    // _render();

    this.startAudio();
  }

  startAudio() {
    const audioPlayer = new AudioPlayer("audio/underwater-ambiencewav-14428.mp3", "audio/mp3");
    const startButton = document.querySelector("#button-start");
    startButton.addEventListener("click", () => {
      const overlay = document.querySelector("#overlay");
      overlay.classList.add("d-none");
      audioPlayer.play();
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.cockpit.setCockpitSize(window.innerWidth, window.innerHeight);
    this.hud.setHudSize(this.renderer.domElement.width, this.renderer.domElement.height);

    if (this.controls.hasOwnProperty("handleResize")) {
      (this.controls as FirstPersonControls).handleResize();
    }
  }
}
