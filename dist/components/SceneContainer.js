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
var PerlinTerrain_1 = require("./environment/PerlinTerrain");
var HudComponent_1 = require("./hud/HudComponent");
var FogHandler_1 = require("./environment/FogHandler");
var PhysicsHandler_1 = require("./PhysicsHandler");
var PerlinTexture_1 = require("../utils/texture/PerlinTexture");
var AudioPlayer_1 = require("../utils/AudioPlayer");
var FloatingParticles_1 = require("./environment/FloatingParticles");
var ObjFileHandler_1 = require("../io/ObjFileHandler");
var ColladaFileHandler_1 = require("../io/ColladaFileHandler");
var PerlinHeightMap_1 = require("../utils/math/PerlinHeightMap");
var CockpitScene_1 = require("./cockpit/CockpitScene");
var FbxFileHandler_1 = require("../io/FbxFileHandler");
var GameLogicManager_1 = require("../gamelogic/GameLogicManager");
var MessageBox_1 = require("../dom/MessageBox");
var GameListeners_1 = require("../utils/GameListeners");
var SceneContainer = /** @class */ (function () {
    function SceneContainer(params) {
        var _this = this;
        this.isGameRunning = false;
        this.isGamePaused = false;
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.collidableMeshes = [];
        this.terrainSegments = [];
        this.navpoints = [];
        this.rendererSize = { width: window.innerWidth, height: window.innerHeight };
        this.gameListeners = new GameListeners_1.GameListeners();
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
        this.tweakParams = {
            sonarX: 0,
            sonarY: 0,
            sonarZ: 0,
            compassX: 0,
            compassY: 0,
            compassZ: 0,
            isRendering: true,
            highlightHudFragments: false,
            cutsceneShutterValue: 1.0,
            lineHeight: 14,
            fontSize: 14,
            maxShipUpAngle: Math.PI * 0.25,
            minShipUpAngle: -Math.PI * 0.25,
            cameraFov: 30
        };
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
        this.camera = new THREE.PerspectiveCamera(this.tweakParams.cameraFov, window.innerWidth / window.innerHeight, 1, 10000);
        this.fogHandler = new FogHandler_1.FogHandler(this);
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
        // this.cockpit = new CockpitPlane();
        // this.camera.add(this.cockpit.mesh);
        this.cockpitScene = new CockpitScene_1.CockpitScene(this, this.renderer.domElement.width, this.renderer.domElement.height);
        var hudPrimaryColor = new THREE.Color(params.getString("hudColor", "#00c868"));
        var hudWarningColor = new THREE.Color(params.getString("hudWarningColor", "#c88800"));
        this.hud = new HudComponent_1.HudComponent(this.renderer.domElement.width, this.renderer.domElement.height, hudPrimaryColor, hudWarningColor);
        // To get the Cockpit visible we also need to add the camera to the scene
        this.scene.add(this.camera);
        // Finally we want to be able to rotate the whole scene with the mouse:
        // add an orbit control helper.
        var _self = this;
        var fpcDefaultZero = Math.PI * 0.5;
        var firstPersonControls = new FirstPersonControls_js_1.FirstPersonControls(this.camera, this.renderer.domElement);
        firstPersonControls.movementSpeed = 35; // 50;
        firstPersonControls.lookSpeed = 0.05;
        // firstPersonControls.noFly = true;
        firstPersonControls.lookVertical = true;
        firstPersonControls.constrainVertical = true;
        // PI/2.0 is the middle
        // Map [min,max] to [PI,0]
        firstPersonControls.verticalMin = this.tweakParams.minShipUpAngle + fpcDefaultZero;
        firstPersonControls.verticalMax = this.tweakParams.maxShipUpAngle + fpcDefaultZero;
        this.controls = firstPersonControls;
        this.stats = new Stats_1.Stats.Stats();
        document.querySelector("body").appendChild(this.stats.domElement);
        var hudData = {
            depth: this.camera.position.y,
            groundDepth: 0.0,
            shipRotation: { upAngle: 0.0 },
            pressure: 0.0,
            temperature: 0.0
        };
        var terrain = this.makeTerrain();
        this.terrainSegments.push(terrain);
        // TODO: terrain.bounds is always at (0,0,0), the initialDepth is ignored!
        console.log("Terrain Bounds", terrain.bounds);
        var updateables = [];
        // Initialize particles
        var particleDensity = 0.00001;
        var particleBounds = terrain.bounds.clone();
        particleBounds.min.y += this.sceneData.initialDepth;
        particleBounds.max.y += this.sceneData.initialDepth;
        console.log("particleBounds", particleBounds);
        updateables.push(new FloatingParticles_1.FloatingParticles(this, "resources/img/particle-a-256.png", particleBounds, particleDensity));
        updateables.push(new FloatingParticles_1.FloatingParticles(this, "resources/img/particle-b-256.png", particleBounds, particleDensity));
        var discreteDetectionTime = _self.clock.getElapsedTime();
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
                _this.cockpitScene.beforeRender(_this, hudData, _this.tweakParams);
                _this.hud.beforeRender(_this, hudData, _this.tweakParams);
                // Update HUD data
                hudData.shipRotation.upAngle = _this.getShipVerticalInclination();
                hudData.depth = _this.camera.position.y;
                hudData.groundDepth = _this.getGroundDepthAt(_this.camera.position.x, _this.camera.position.z, terrain) - hudData.depth;
                hudData.pressure = hudData.depth < 0 ? 1.0 + -0.0981 * hudData.depth : 0.9998; // Fake some nice overair pressure
                hudData.temperature = hudData.depth < 0 ? 4.0 - Math.exp(hudData.depth / 1000) : 32.0; // Degrees
                _this.cockpitScene.renderFragment(_this.renderer);
                _this.hud.renderFragment(_this.renderer);
                terrain.causticShaderMaterial.update(elapsedTime, _this.scene.fog.color);
                if (_this.isGameRunning) {
                    // Let's animate the cube: a rotation.
                    _this.cube.rotation.x += 0.05;
                    _this.cube.rotation.y += 0.04;
                    // Check each second.
                    if (elapsedTime - discreteDetectionTime > 1) {
                        _self.gameLogicManager.update(elapsedTime, discreteDetectionTime);
                        discreteDetectionTime = elapsedTime;
                    }
                    // Update physica
                    physicsHandler.render();
                }
            }
            requestAnimationFrame(_render);
        }; // END render
        this.gameLogicManager = new GameLogicManager_1.GameLogicManager(this);
        this.messageBox = new MessageBox_1.MessageBox();
        this.loadConcrete(terrain);
        this.addGroundBuoys(terrain);
        this.addNavpoints(terrain);
        this.addGeometer(terrain);
        window.addEventListener("resize", function () {
            _self.onWindowResize();
        });
        // Enable and disable mouse controls when mouse leaves/re-enters the screen.
        this.renderer.domElement.addEventListener("mouseleave", function () {
            // console.log("leave");
            _self.controls.enabled = false;
        });
        this.renderer.domElement.addEventListener("mouseenter", function () {
            // console.log("enter");
            _self.controls.enabled = true;
            // console.log(_self.controls);
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
        this.initializationPromise = Promise.all(waitingFor); /* .then(() => {
          // this.isGameRunning = true;
          // this.messageBox.showMessage("Game started.\nGo to Nav A.\nFor help press H.");
          this.gameListeners.fireGameReadyChanged();
        }); */
    } // END constructor
    SceneContainer.prototype.initializGame = function () {
        var _this = this;
        this.initializationPromise.then(function () {
            // this.isGameRunning = true;
            // this.messageBox.showMessage("Game started.\nGo to Nav A.\nFor help press H.");
            _this.gameListeners.fireGameReadyChanged();
        });
    };
    SceneContainer.prototype.startGame = function () {
        if (this.isGameRunning) {
            console.debug("[SceneContainer] Cannot start game a second time. Game is already running.");
            return;
        }
        this.isGameRunning = true;
        this.messageBox.showMessage("Game started.\nGo to Nav A.\nFor help press H.");
    };
    SceneContainer.prototype.togglePause = function () {
        this.isGameRunning = !this.isGameRunning;
        this.isGamePaused = !this.isGameRunning;
        this.controls.enabled = !this.isGamePaused;
        this.gameListeners.fireGameRunningChanged(this.isGameRunning, this.isGamePaused);
    };
    SceneContainer.prototype.makeTerrain = function () {
        //--- MAKE TERRAIN ---
        var zStartOffset = -20.0; // for ImprovedNoise
        // const zStartOffset = 300.0; // for Custom noise
        var worldWidthSegments = 256; // 256;
        var worldDepthSegments = 256; // 256;
        var perlinOptions = { iterations: 4, quality: 2.5 };
        var terrainData = new PerlinHeightMap_1.PerlinHeightMap(worldWidthSegments, worldDepthSegments, perlinOptions);
        var terrainSize = { width: 1024.0, depth: 1024.0, height: 92.0 };
        var terrainCenter = new THREE.Vector3(0, 0, 0);
        var terrainBounds = new THREE.Box3(new THREE.Vector3(terrainCenter.x - terrainSize.width / 2.0, terrainCenter.y - terrainSize.height / 2.0, terrainCenter.z - terrainSize.depth / 2.0), new THREE.Vector3(terrainCenter.x + terrainSize.width / 2.0, terrainCenter.y + terrainSize.height / 2.0, terrainCenter.z + terrainSize.depth / 2.0));
        var visibleBox = new THREE.Mesh(new THREE.BoxGeometry(terrainSize.width, terrainSize.height, terrainSize.depth));
        visibleBox.position.set(terrainCenter.x, terrainCenter.y, terrainCenter.z);
        visibleBox.scale.set(0.1, 0.1, 0.1);
        this.addVisibleBoundingBox(visibleBox, 0xff0000);
        var terrainTexture = new PerlinTexture_1.PerlinTexture(terrainData, terrainSize);
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
        // Add to collidables
        this.collidableMeshes.push(terrain.mesh);
        return terrain;
    };
    SceneContainer.prototype.loadConcrete = function (terrain) {
        this.loadConcreteRing(terrain);
        this.loadConcreteWalls(terrain);
        this.loadFBXStruff(terrain);
    };
    SceneContainer.prototype.loadConcreteRing = function (terrain) {
        var _this = this;
        // Load some "concrete" asset
        var basePath = "resources/meshes/wavefront/concrete-ring/";
        var objFileName = "newscene.obj";
        var targetBounds = { width: 40.0, depth: 40.0, height: 12.0 };
        var targetPosition = { x: -130.0, y: 0.0, z: -135.0 };
        // targetPosition.y = terrain.getHeightAtRelativePosition(targetPosition.x, targetPosition.z);
        // targetPosition.y += terrain.bounds.min.y;
        targetPosition.y = this.getGroundDepthAt(targetPosition.x, targetPosition.z, terrain);
        console.log("targetPosition", targetPosition);
        var callback = function (loadedObject) {
            _this.addVisibleBoundingBox(loadedObject);
            _this.collidableMeshes.push(loadedObject);
            _this.addNavpoint({
                position: loadedObject.position,
                label: "OBJ Object",
                detectionDistance: 0.0,
                isDisabled: false,
                type: "default",
                userData: { isCurrentlyInRange: false }
            });
        };
        new ObjFileHandler_1.ObjFileHandler(this).loadObjFile(basePath, objFileName, { targetBounds: targetBounds, targetPosition: targetPosition }, callback);
    };
    SceneContainer.prototype.loadConcreteWalls = function (terrain) {
        var _this = this;
        // Load some "concrete" asset
        var basePath = "resources/meshes/collada/concrete-walls/";
        var objFileName = "concrete-walls-a-1-png2.dae";
        var targetBounds = { width: 20.0, depth: 20.0, height: 40.0 };
        var targetPosition = { x: -130.0, y: 0.0, z: -135.0 };
        targetPosition.y = this.getGroundDepthAt(targetPosition.x, targetPosition.z, terrain) + 5.0;
        var callback = function (loadedObject) {
            _this.addVisibleBoundingBox(loadedObject);
            _this.collidableMeshes.push(loadedObject);
            _this.addNavpoint({
                position: loadedObject.position,
                label: "Collada Object",
                detectionDistance: 0.0,
                isDisabled: false,
                type: "default",
                userData: { isCurrentlyInRange: false }
            });
        };
        new ColladaFileHandler_1.ColladaFileHandler(this).loadColladaFile(basePath, objFileName, { targetBounds: targetBounds, targetPosition: targetPosition }, callback);
    };
    SceneContainer.prototype.loadFBXStruff = function (terrain) {
        var _this = this;
        // Load some "concrete" asset
        var basePath = "resources/meshes/fbx/concrete-walls/";
        var objFileName = "concrete-walls-a.fbx";
        var targetBounds = { width: 20.0, depth: 20.0, height: 40.0 };
        var targetPosition = { x: -110.0, y: 0.0, z: -115.0 };
        targetPosition.y = this.getGroundDepthAt(targetPosition.x, targetPosition.z, terrain);
        console.log("targetPosition", targetPosition);
        var callback = function (loadedObject) {
            _this.addVisibleBoundingBox(loadedObject);
            _this.collidableMeshes.push(loadedObject);
            _this.addNavpoint({
                position: loadedObject.position,
                label: "FBX Object",
                detectionDistance: 0.0,
                isDisabled: false,
                type: "default",
                userData: { isCurrentlyInRange: false }
            });
        };
        new FbxFileHandler_1.FbxFileHandler(this).loadFbxFile(basePath, objFileName, { targetBounds: targetBounds, targetPosition: targetPosition }, callback);
    };
    SceneContainer.prototype.addGroundBuoys = function (terrain) {
        // Test x-y- height positioning in the terrain class
        var countPerAxis = 25;
        var stepSizeX = terrain.worldSize.width / countPerAxis;
        var stepSizeZ = terrain.worldSize.depth / countPerAxis;
        console.log("terrain.worldSize.width", terrain.worldSize.width, "terrain.worldSize.depth", terrain.worldSize.depth, "terrain.worldSize.height", terrain.worldSize.height, "stepSizeX", stepSizeX, "stepSizeZ", stepSizeZ, "terrain.bounds", terrain.bounds);
        var buoyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        for (var x = 0; x < terrain.worldSize.width; x += stepSizeX) {
            for (var z = 0; z < terrain.worldSize.depth; z += stepSizeZ) {
                var heightValue = terrain.getHeightAtRelativePosition(x, z);
                var buoy = new THREE.Mesh(new THREE.SphereGeometry(1.5), buoyMaterial);
                buoy.position.set(terrain.bounds.min.x + x, terrain.bounds.min.y + heightValue, terrain.bounds.min.z + z);
                buoy.position.add(terrain.mesh.position);
                buoy.position.y += 46.0; // Add 6m so the ground buoys are definitely visible (above ground)
                this.scene.add(buoy);
            }
        }
    };
    SceneContainer.prototype.addNavpoints = function (terrain) {
        var targetPositionA = new THREE.Vector3(terrain.worldSize.width / 2.0 - 160.0, 0.0, terrain.worldSize.depth / 2.0 - 20.0);
        targetPositionA.y = this.getGroundDepthAt(targetPositionA.x, targetPositionA.z, terrain) + 25.0;
        var targetPositionB = new THREE.Vector3(terrain.worldSize.width / 2.0 - 20.0, 0.0, terrain.worldSize.depth / 2.0 - 160.0);
        targetPositionB.y = this.getGroundDepthAt(targetPositionB.x, targetPositionB.z, terrain) + 25.0;
        this.addNavpoint({
            position: targetPositionA,
            label: "Nav A",
            detectionDistance: 25.0,
            isDisabled: true,
            type: "nav",
            userData: { isCurrentlyInRange: false }
        }, true);
        this.addNavpoint({
            position: targetPositionB,
            label: "Nav B",
            detectionDistance: 25.0,
            isDisabled: true,
            type: "nav",
            userData: { isCurrentlyInRange: false }
        }, true);
        this.addBuoysAt([targetPositionA, targetPositionB]);
    };
    SceneContainer.prototype.addNavpoint = function (navpoint, addToRoute) {
        // Add to visible nav points
        this.navpoints.push(navpoint);
        this.gameLogicManager.navigationManager.addNavpoint(navpoint);
        // And add to navpoint router?
        if (addToRoute) {
            this.gameLogicManager.navpointRouter.addToRoute(navpoint);
        }
    };
    SceneContainer.prototype.addBuoysAt = function (targetPositions) {
        var _this = this;
        if (targetPositions.length === 0) {
            return;
        }
        // Also load visual nav buoys
        var basePath = "resources/meshes/wavefront/buoy-blender/";
        var objFileName = "buoy-blender-v1.obj";
        var targetBounds = { width: 1.2, depth: 1.2, height: 1.5 };
        var buoyObjectLoaded = function (_loadedObject) {
            console.log("Buoy mesh loaded");
            // NOOP
        };
        var buoyMaterialsLoaded = function (loadedObject) {
            console.log("Buoy material loaded");
            // loadedObject.rotateX(-Math.PI / 2.0);
            console.log("[Buoy material loaded] ", loadedObject);
            loadedObject.traverse(function (child) {
                if (child.isMesh) {
                    // TODO: check type
                    var childMesh = child;
                    console.log("addBuoyAt", child);
                    if (Array.isArray(childMesh.material)) {
                        childMesh.material.forEach(function (mat) {
                            mat.side = THREE.BackSide;
                            mat.needsUpdate = true;
                        });
                    }
                    else {
                        childMesh.material.side = THREE.BackSide;
                        childMesh.material.needsUpdate = true;
                    }
                }
                // Clone.
            });
            console.log("Creating buoy clones ...", targetPositions.length);
            for (var i = 1; i < targetPositions.length; i++) {
                var buoyCopy = loadedObject.clone();
                buoyCopy.position.set(targetPositions[i].x, targetPositions[i].y, targetPositions[i].z);
                _this.scene.add(buoyCopy);
            }
        };
        new ObjFileHandler_1.ObjFileHandler(this).loadObjFile(basePath, objFileName, { targetBounds: targetBounds, targetPosition: targetPositions[0] }, buoyObjectLoaded, buoyMaterialsLoaded);
    };
    SceneContainer.prototype.addGeometer = function (terrain) {
        var geometerCoords = { x: -80.0, z: -40.0 };
        var heightValue = terrain.getHeightAtRelativePosition(geometerCoords.x, geometerCoords.z);
        var geometerTexture = new THREE.TextureLoader().load("resources/img/geometer-128x1024.png", function (tex) {
            // geometerMaterial.map = tex;
            // geometerMaterial.
        });
        var geometerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: geometerTexture });
        var geometerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, 0.1), geometerMaterial);
        // geometerMesh.position.y = heightValue; // this.sceneData.initialDepth;
        geometerMesh.position.set(geometerCoords.x, heightValue, geometerCoords.z);
        this.scene.add(geometerMesh);
    };
    SceneContainer.prototype.getShipVerticalInclination = function () {
        var worldDir = new THREE.Vector3();
        this.camera.getWorldDirection(worldDir);
        var horizontalVector = new THREE.Vector3(worldDir.x, 0, worldDir.z);
        var isNegative = worldDir.y < 0;
        var angle = worldDir.angleTo(horizontalVector);
        return isNegative ? -angle : angle;
    };
    SceneContainer.prototype.getGroundDepthAt = function (xPosAbs, zPosAbs, terrain) {
        // TODO: find containing terrain segment
        if (terrain.containsAbsolutePosition(xPosAbs, zPosAbs)) {
            return terrain.getHeightAtWorldPosition(xPosAbs, zPosAbs);
        }
        else {
            return Number.NEGATIVE_INFINITY;
        }
    };
    SceneContainer.prototype.addVisibleBoundingBox = function (object, color) {
        var box = new THREE.BoxHelper(object, color || 0x000000);
        this.scene.add(box);
    };
    SceneContainer.prototype.initializeAudio = function () {
        var audioPlayer = new AudioPlayer_1.AudioPlayer("resources/audio/underwater-ambiencewav-14428.mp3", "audio/mp3");
        // return new Promise<void>((accept, _reject) => {
        //   const startButton = document.querySelector("#button-start");
        //   startButton.addEventListener("click", () => {
        //     const overlay = document.querySelector("#overlay");
        //     overlay.classList.add("d-none");
        //     audioPlayer.play();
        //     accept();
        //   });
        // });
        return new Promise(function (accept, _reject) {
            // Well, this new implementation accepts immediately.
            accept();
        });
    };
    SceneContainer.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        // console.log(this.renderer.getSize)
        this.rendererSize.width = window.innerWidth;
        this.rendererSize.height = window.innerHeight;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.cockpitScene.updateSize(window.innerWidth, window.innerHeight);
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