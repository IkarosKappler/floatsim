"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneContainer = void 0;
var THREE = __importStar(require("three"));
var FirstPersonControls_js_1 = require("three/examples/jsm/controls/FirstPersonControls.js");
var Stats_1 = require("../Stats");
var PerlinTerrain_1 = require("./PerlinTerrain");
var CockpitPlane_1 = require("./CockpitPlane");
var HudComponent_1 = require("./HudComponent");
var FogHandler_1 = require("./FogHandler");
var PhysicsHandler_1 = require("./PhysicsHandler");
var PerlinTexture_1 = require("../utils/texture/PerlinTexture");
var AudioPlayer_1 = require("../utils/AudioPlayer");
var FloatingParticles_1 = require("./FloatingParticles");
var Concrete_1 = require("./environment/Concrete");
var SceneContainer = /** @class */ (function () {
    function SceneContainer(params) {
        var _this = this;
        this.isGameRunning = false;
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.sceneData = {
            initialDepth: params.getNumber("initialDepth", -898.0),
            deepFogDepth: {
                max: -1200,
                min: -2000
            },
            highFogDepth: {
                max: -100,
                min: -500
            }
        };
        this.tweakParams = { z: 0, isRendering: true, highlightHudFragments: false };
        // Initialize a new THREE renderer (you are also allowed
        // to pass an existing canvas for rendering).
        var rendererOptions = {
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
        this.fogHandler = new FogHandler_1.FogHandler(this);
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
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(100, 100, 50);
        directionalLight.castShadow = true;
        var dLight = 200;
        var sLight = dLight * 0.25;
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
        this.cockpit = new CockpitPlane_1.CockpitPlane();
        this.camera.add(this.cockpit.mesh);
        var hudPrimaryColor = new THREE.Color(params.getString("hudColor", "#00c868"));
        var hudWarningColor = new THREE.Color(params.getString("hudWarningColor", "#c88800"));
        this.hud = new HudComponent_1.HudComponent(this.renderer.domElement.width, this.renderer.domElement.height, hudPrimaryColor, hudWarningColor);
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
        var firstPersonControls = new FirstPersonControls_js_1.FirstPersonControls(this.camera, this.renderer.domElement);
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
        this.stats = new Stats_1.Stats.Stats();
        document.querySelector("body").appendChild(this.stats.domElement);
        var hudData = {
            depth: this.camera.position.y,
            shipRotation: this.camera.rotation
        };
        var terrain = this.makeTerrain();
        var updateables = [];
        // Initialize particles
        updateables.push(new FloatingParticles_1.FloatingParticles(this, "resources/img/particle-a-256.png", terrain.bounds, 0.00001));
        updateables.push(new FloatingParticles_1.FloatingParticles(this, "resources/img/particle-b-256.png", terrain.bounds, 0.00001));
        // // This is the basic render function. It will be called perpetual, again and again,
        // // depending on your machines possible frame rate.
        var _render = function () {
            if (_this.tweakParams.isRendering) {
                // Pass the render function itself
                var deltaTime = _this.clock.getDelta();
                var elapsedTime = _self.clock.getElapsedTime();
                _this.fogHandler.updateFogColor();
                firstPersonControls.update(deltaTime);
                _this.stats.update();
                for (var i in updateables) {
                    updateables[i].update(elapsedTime, deltaTime);
                }
                _this.renderer.render(_this.scene, _this.camera);
                // Updat HUD data
                // hudData.shipRotation = this.camera.rotation;
                // hudData.shipRotation = this.camera.getWorldDirection(new THREE.Vector3());
                hudData.shipRotation = { x: 0, y: 0, z: 0 };
                var euler = new THREE.Euler();
                euler.order = "XYZ";
                var rotation = euler.setFromQuaternion(_this.camera.quaternion);
                var worldDirection = _this.camera.getWorldQuaternion(new THREE.Quaternion());
                // hudData.shipRotation.z = Math.atan2(this.camera.rotation.x, this.camera.rotation.z);
                hudData.shipRotation.z = worldDirection.z; // Math.atan2(worldDirection.x, worldDirection.z);
                var rot2polar = function (euler) {
                    // Euler to polar
                    //    https://stackoverflow.com/questions/37667438/convert-three-js-scene-rotation-to-polar-coordinates
                    var length = Math.sqrt(euler.x * euler.x + euler.y * euler.y + euler.z * euler.z);
                    var theta = Math.acos(euler.z / length);
                    var phi = Math.atan(euler.y / euler.x);
                    return { theta: theta, phi: phi };
                };
                hudData.shipRotation.z = rot2polar(rotation).theta;
                hudData.depth = _this.camera.position.y;
                _this.hud.beforeRender(_this, hudData, _this.tweakParams);
                _this.hud.renderFragment(_this.renderer);
                terrain.causticShaderMaterial.update(elapsedTime, _this.scene.fog.color);
                if (_this.isGameRunning) {
                    // Let's animate the cube: a rotation.
                    _this.cube.rotation.x += 0.05;
                    _this.cube.rotation.y += 0.04;
                    // Update physica
                    physicsHandler.render();
                }
            }
            requestAnimationFrame(_render);
        };
        // // const zStartOffset = 800.0; // for ImprovedNoise
        // const zStartOffset = 300.0; // for Custom noise
        // const worldWidthSegments = 256;
        // const worldDepthSegments = 256;
        // const perlinOptions = { iterations: 5, quality: 1.5 };
        // const terrainData: PerlinHeightMap = PerlinTerrain.generatePerlinHeight(
        //   worldWidthSegments,
        //   worldDepthSegments,
        //   perlinOptions
        // );
        // const terrainSize: Size3Immutable = { width: 7500, depth: 7500, height: 0 };
        // const terrainTexture = new PerlinTexture(terrainData, terrainSize);
        // const terrain = new PerlinTerrain(terrainData, terrainSize, terrainTexture); // , worldWidthSegments, worldDepthSegments); // .makeTerrain();
        // console.log("terrainData", terrainData);
        // terrain.mesh.position.y = this.sceneData.initialDepth - zStartOffset;
        // this.scene.add(terrain.mesh);
        // var imageData = terrainTexture.imageData;
        // var buffer = imageData.data.buffer; // ArrayBuffer
        // var arrayBuffer = new ArrayBuffer(imageData.data.length);
        // var binary = new Uint8Array(arrayBuffer);
        // for (var i = 0; i < binary.length; i++) {
        //   binary[i] = imageData.data[i];
        // }
        // var dTex = new THREE.DataTexture(arrayBuffer, worldWidthSegments, worldDepthSegments, THREE.RGBAFormat);
        // //   var dTex = baseTexture.imageDataArray; //new THREE.DataTexture(baseTexture.imageDataArray, worldWidthSegments, worldDepthSegments, THREE.RGBAFormat);
        // dTex.needsUpdate = true;
        // Load some "concrete" asset
        var basePath = "resources/meshes/wavefront/concrete-ring/";
        var objFileName = "newscene.obj";
        var targetBounds = { width: 40.0, depth: 40.0, height: 12.0 };
        var targetPosition = { x: 100.0, y: -20.0, z: 0.0 };
        new Concrete_1.Concrete(this).loadObjFile(basePath, objFileName, { targetBounds: targetBounds, targetPosition: targetPosition });
        // Test x-y- height positioning in the terrain class
        var steps = 50;
        var stepSizeX = terrain.worldSize.width / steps;
        var stepSizeY = terrain.worldSize.depth / steps;
        console.log("terrain.worldSize.width", terrain.worldSize.width, "terrain.worldSize.depth", terrain.worldSize.depth, "stepSizeX", stepSizeX, "stepSizeY", stepSizeY, "terrain.bounds", terrain.bounds);
        for (var x = 0; x < terrain.worldSize.width; x += stepSizeX) {
            for (var y = 0; y < terrain.worldSize.depth; y += stepSizeY) {
                var heightValue = terrain.getHeightAt(x, y);
                if (x === 0) {
                    console.log("x", y, "y", y, "heightValue", heightValue);
                }
                var bouy = new THREE.Mesh(new THREE.SphereGeometry(1.5), new THREE.MeshPhongMaterial({ color: 0xff0000 }));
                bouy.position.set(terrain.bounds.min.x + x, terrain.bounds.min.z + y, terrain.bounds.min.y + heightValue);
                this.scene.add(bouy);
            }
        }
        window.addEventListener("resize", function () {
            _self.onWindowResize();
        });
        // Enable and disable mouse controls when mouse leaves/re-enters the screen.
        this.renderer.domElement.addEventListener("mouseleave", function () {
            console.log("leave");
            _self.controls.enabled = false;
        });
        this.renderer.domElement.addEventListener("mouseenter", function () {
            console.log("enter");
            _self.controls.enabled = true;
            console.log(_self.controls);
        });
        // Call the rendering function. This will cause and infinite recursion (we want
        // that here, because the animation shall run forever).
        this.onWindowResize();
        // Initialize physics
        var physicsHandler = new PhysicsHandler_1.PhysicsHandler(this, terrain);
        var waitingFor = [
            // This will start the physics engine and them immediately begin rendering.
            physicsHandler.start().then(_render),
            // Only after the "Start" button was hit (user interaction) audio can play.
            this.initializeAudio()
        ];
        Promise.all(waitingFor).then(function () {
            _this.isGameRunning = true;
        });
    }
    SceneContainer.prototype.makeTerrain = function () {
        //--- MAKE TERRAIN ---
        var zStartOffset = -200.0; // for ImprovedNoise
        // const zStartOffset = 300.0; // for Custom noise
        var worldWidthSegments = 256;
        var worldDepthSegments = 256;
        var perlinOptions = { iterations: 5, quality: 2.5 };
        var terrainData = PerlinTerrain_1.PerlinTerrain.generatePerlinHeight(worldWidthSegments, worldDepthSegments, perlinOptions);
        var terrainSize = { width: 2048, depth: 2048, height: 100 };
        var terrainCenter = new THREE.Vector3(0, 0, 0);
        var terrainBounds = new THREE.Box3(new THREE.Vector3(terrainCenter.x - terrainSize.width / 2.0, terrainCenter.y - terrainSize.height / 2.0, terrainCenter.z - terrainSize.depth / 2.0), new THREE.Vector3(terrainCenter.x + terrainSize.width / 2.0, terrainCenter.y + terrainSize.height / 2.0, terrainCenter.z + terrainSize.depth / 2.0));
        var terrainTexture = new PerlinTexture_1.PerlinTexture(terrainData, terrainSize);
        // const terrain = new PerlinTerrain(terrainData, terrainSize, terrainTexture);
        var terrain = new PerlinTerrain_1.PerlinTerrain(terrainData, terrainBounds, terrainTexture);
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
        return terrain;
    };
    SceneContainer.prototype.initializeAudio = function () {
        var audioPlayer = new AudioPlayer_1.AudioPlayer("resources/audio/underwater-ambiencewav-14428.mp3", "audio/mp3");
        return new Promise(function (accept, _reject) {
            var startButton = document.querySelector("#button-start");
            startButton.addEventListener("click", function () {
                var overlay = document.querySelector("#overlay");
                overlay.classList.add("d-none");
                audioPlayer.play();
                accept();
            });
        });
    };
    SceneContainer.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.cockpit.setCockpitSize(window.innerWidth, window.innerHeight);
        // this.hud.setHudSize(this.renderer.domElement.width, this.renderer.domElement.height);
        this.hud.updateSize(this.renderer.domElement.width, this.renderer.domElement.height);
        if (this.controls.hasOwnProperty("handleResize")) {
            this.controls.handleResize();
        }
    };
    return SceneContainer;
}());
exports.SceneContainer = SceneContainer;
//# sourceMappingURL=SceneContainer.js.map