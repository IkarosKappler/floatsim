/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { Stats } from "../Stats";
import { PerlinTerrain } from "./environment/PerlinTerrain";
import { HudComponent } from "./hud/HudComponent";
import {
  HUDData,
  IDimension2,
  IHeightMap,
  ISceneContainer,
  Navpoint,
  SceneData,
  Size2Immutable,
  Size3Immutable,
  TweakParams,
  UpdateableComponent
} from "./interfaces";
import { FogHandler } from "./environment/FogHandler";
import { PhysicsHandler } from "./PhysicsHandler";
import { Params } from "../utils/Params";
import { PerlinTexture } from "../utils/texture/PerlinTexture";
import { AudioPlayer } from "../utils/AudioPlayer";
import { FloatingParticles } from "./environment/FloatingParticles";
import { Concrete } from "./environment/Concrete";
import { PerlinHeightMap } from "../utils/math/PerlinHeightMap";
import { CockpitScene } from "./cockpit/CockpitScene";

export class SceneContainer implements ISceneContainer {
  readonly scene: THREE.Scene;
  readonly renderer: THREE.WebGLRenderer;
  readonly rendererSize: Size2Immutable;
  readonly stats: Stats;
  readonly controls: OrbitControls | FirstPersonControls;
  readonly cockpitScene: CockpitScene;
  readonly hud: HudComponent;
  readonly fogHandler: FogHandler;
  readonly sceneData: SceneData;
  readonly tweakParams: TweakParams;

  // Implement ISceneContainer
  readonly camera: THREE.PerspectiveCamera;
  readonly clock: THREE.Clock;
  readonly collidableMeshes: Array<THREE.Object3D>;
  readonly terrainSegments: Array<PerlinTerrain>;
  readonly navpoints: Array<Navpoint>;

  private isGameRunning: boolean = false;

  // Example cube
  cube: THREE.Mesh;

  constructor(params: Params) {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.collidableMeshes = [];
    this.terrainSegments = [];
    this.navpoints = [];
    this.rendererSize = { width: window.innerWidth, height: window.innerHeight };

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
    this.tweakParams = {
      sonarX: 0,
      sonarY: 0,
      sonarZ: 0,
      compassX: 0,
      compassY: 0,
      compassZ: 0,
      isRendering: true,
      highlightHudFragments: false,
      cutsceneShutterValue: 1.0
    };

    // Initialize a new THREE renderer (you are also allowed
    // to pass an existing canvas for rendering).
    const rendererOptions = {
      // logarithmicDepthBuffer: true,  // Test for particles with alpha
      // alpha: true,
      antialias: true
    };
    this.renderer = new THREE.WebGLRenderer(rendererOptions);
    // this.renderer.setPixelRatio(window.devicePixelRatio);
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
    // this.cockpit = new CockpitPlane();
    // this.camera.add(this.cockpit.mesh);

    this.cockpitScene = new CockpitScene(this, this.renderer.domElement.width, this.renderer.domElement.height);

    const hudPrimaryColor = new THREE.Color(params.getString("hudColor", "#00c868"));
    const hudWarningColor = new THREE.Color(params.getString("hudWarningColor", "#c88800"));

    this.hud = new HudComponent(
      this.renderer.domElement.width,
      this.renderer.domElement.height,
      hudPrimaryColor,
      hudWarningColor
    );

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
    // PI/2.0 is the middle
    firstPersonControls.verticalMin = Math.PI * 0.25; // in radians, default PI
    firstPersonControls.verticalMax = Math.PI * 0.75; // in radians, default 0

    this.controls = firstPersonControls;

    this.stats = new (Stats as any).Stats();
    document.querySelector("body").appendChild(this.stats.domElement);

    const hudData: HUDData = {
      depth: this.camera.position.y,
      shipRotation: { x: 0.0, y: 0.0, z: 0.0 } // this.camera.rotation
    };

    const terrain = this.makeTerrain();
    this.terrainSegments.push(terrain);

    const updateables: Array<UpdateableComponent> = [];
    // Initialize particles
    updateables.push(new FloatingParticles(this, `resources/img/particle-a-256.png`, terrain.bounds, 0.00001));
    updateables.push(new FloatingParticles(this, `resources/img/particle-b-256.png`, terrain.bounds, 0.00001));

    // // This is the basic render function. It will be called perpetual, again and again,
    // // depending on your machines possible frame rate.
    const _render = () => {
      if (this.tweakParams.isRendering) {
        // Pass the render function itself
        let deltaTime = this.clock.getDelta();
        let elapsedTime = _self.clock.getElapsedTime();

        this.fogHandler.updateFogColor();
        firstPersonControls.update(deltaTime);
        this.stats.update();
        for (var i in updateables) {
          updateables[i].update(elapsedTime, deltaTime);
        }

        this.renderer.render(this.scene, this.camera);

        this.cockpitScene.beforeRender(this, hudData, this.tweakParams);
        this.hud.beforeRender(this, hudData, this.tweakParams);

        // Update HUD data
        hudData.shipRotation.z = this.getShipVerticalInclination();
        hudData.depth = this.camera.position.y;

        this.cockpitScene.renderFragment(this.renderer);
        this.hud.renderFragment(this.renderer);

        terrain.causticShaderMaterial.update(elapsedTime, this.scene.fog.color);

        if (this.isGameRunning) {
          // Let's animate the cube: a rotation.
          this.cube.rotation.x += 0.05;
          this.cube.rotation.y += 0.04;

          // Update physica
          physicsHandler.render();
        }
      }

      requestAnimationFrame(_render);
    }; // END render

    this.loadConcrete(terrain);
    this.addGroundBuoys(terrain);
    this.addNavpoints(terrain);

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

    const waitingFor = [
      // This will start the physics engine and them immediately begin rendering.
      physicsHandler.start().then(_render),

      // Only after the "Start" button was hit (user interaction) audio can play.
      this.initializeAudio()
    ];
    Promise.all(waitingFor).then(() => {
      this.isGameRunning = true;
    });
  }

  makeTerrain(): PerlinTerrain {
    //--- MAKE TERRAIN ---
    const zStartOffset = -320.0; // for ImprovedNoise
    // const zStartOffset = 300.0; // for Custom noise
    const worldWidthSegments = 256;
    const worldDepthSegments = 256;
    const perlinOptions = { iterations: 5, quality: 2.5 };
    const terrainData: IHeightMap = new PerlinHeightMap(worldWidthSegments, worldDepthSegments, perlinOptions);

    const terrainSize: Size3Immutable = { width: 2048.0, depth: 2048.0, height: 10.0 };
    const terrainCenter: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const terrainBounds: THREE.Box3 = new THREE.Box3(
      new THREE.Vector3(
        terrainCenter.x - terrainSize.width / 2.0,
        terrainCenter.y - terrainSize.height / 2.0,
        terrainCenter.z - terrainSize.depth / 2.0
      ),
      new THREE.Vector3(
        terrainCenter.x + terrainSize.width / 2.0,
        terrainCenter.y + terrainSize.height / 2.0,
        terrainCenter.z + terrainSize.depth / 2.0
      )
    );
    const terrainTexture = new PerlinTexture(terrainData, terrainSize);
    // const terrain = new PerlinTerrain(terrainData, terrainSize, terrainTexture);
    const terrain = new PerlinTerrain(terrainData, terrainBounds, terrainTexture);

    console.log("terrainData", terrainData);
    terrain.mesh.position.y = this.sceneData.initialDepth + zStartOffset;
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
    //---END--- MAKE TERRAIN

    // Add to collidables
    this.collidableMeshes.push(terrain.mesh);

    return terrain;
  }

  loadConcrete(terrain: PerlinTerrain) {
    // Load some "concrete" asset
    const basePath = "resources/meshes/wavefront/concrete-ring/";
    const objFileName = "newscene.obj";
    const targetBounds = { width: 40.0, depth: 40.0, height: 12.0 };
    const targetPosition = { x: -130.0, y: 0.0, z: -135.0 };
    targetPosition.y = terrain.getHeightAt(targetPosition.x, targetPosition.z);
    targetPosition.y += terrain.bounds.min.y;
    console.log("targetPosition", targetPosition);
    const callback = (loadedObject: THREE.Object3D) => {
      this.addVisibleBoundingBox(loadedObject);
      this.collidableMeshes.push(loadedObject);
    };
    new Concrete(this).loadObjFile(basePath, objFileName, { targetBounds, targetPosition }, callback);
  }

  addGroundBuoys(terrain: PerlinTerrain) {
    // Test x-y- height positioning in the terrain class
    const countPerAxis = 25;
    const stepSizeX = terrain.worldSize.width / countPerAxis;
    const stepSizeY = terrain.worldSize.depth / countPerAxis;
    console.log(
      "terrain.worldSize.width",
      terrain.worldSize.width,
      "terrain.worldSize.depth",
      terrain.worldSize.depth,
      "terrain.worldSize.height",
      terrain.worldSize.height,
      "stepSizeX",
      stepSizeX,
      "stepSizeY",
      stepSizeY,
      "terrain.bounds",
      terrain.bounds
    );
    const buoyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    for (var x = 0; x < terrain.worldSize.width; x += stepSizeX) {
      for (var y = 0; y < terrain.worldSize.depth; y += stepSizeY) {
        const heightValue = terrain.getHeightAt(x, y);
        const buoy = new THREE.Mesh(new THREE.SphereGeometry(1.5), buoyMaterial);
        buoy.position.set(terrain.bounds.min.x + x, terrain.bounds.min.y + heightValue, terrain.bounds.min.z + y);
        buoy.position.add(terrain.mesh.position);
        buoy.position.y += 2 * 3.0;
        this.scene.add(buoy);
      }
    }
  }

  addNavpoints(terrain: PerlinTerrain) {
    const navPointA = { position: new THREE.Vector3(130.0, 0.0, -135.0) };
    const navPointB = { position: new THREE.Vector3(-130.0, 0.0, 135.0) };
    navPointA.position.y += terrain.bounds.min.y;
    navPointB.position.y += terrain.bounds.min.y;
    this.navpoints.push(navPointA, navPointB);
  }

  getShipVerticalInclination() {
    const worldDir = new THREE.Vector3();
    this.camera.getWorldDirection(worldDir);
    const horizontalVector = new THREE.Vector3(worldDir.x, 0, worldDir.z);
    const isNegative = worldDir.y < 0;
    const angle = worldDir.angleTo(horizontalVector);
    return isNegative ? -angle : angle;
  }

  addVisibleBoundingBox(object: THREE.Object3D) {
    const box = new THREE.BoxHelper(object, 0x000000);
    this.scene.add(box);
  }

  initializeAudio(): Promise<void> {
    const audioPlayer = new AudioPlayer("resources/audio/underwater-ambiencewav-14428.mp3", "audio/mp3");
    return new Promise<void>((accept, _reject) => {
      const startButton = document.querySelector("#button-start");
      startButton.addEventListener("click", () => {
        const overlay = document.querySelector("#overlay");
        overlay.classList.add("d-none");
        audioPlayer.play();
        accept();
      });
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // console.log(this.renderer.getSize)
    (this.rendererSize as IDimension2).width = window.innerWidth;
    (this.rendererSize as IDimension2).height = window.innerHeight;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.cockpitScene.updateSize(window.innerWidth, window.innerHeight);
    // this.hud.setHudSize(this.renderer.domElement.width, this.renderer.domElement.height);
    this.hud.updateSize(this.renderer.domElement.width, this.renderer.domElement.height);

    if (this.controls.hasOwnProperty("handleResize")) {
      (this.controls as FirstPersonControls).handleResize();
    }
  }
}
