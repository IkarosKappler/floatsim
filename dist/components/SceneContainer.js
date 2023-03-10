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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneContainer = void 0;
var THREE = __importStar(require("three"));
var FirstPersonControls_js_1 = require("three/examples/jsm/controls/FirstPersonControls.js");
var stats_module_js_1 = __importDefault(require("three/examples/jsm/libs/stats.module.js"));
// import * as SceneUtils from "three/examples/jsm/utils/SceneUtils.js";
var PerlinTerrain_1 = require("./PerlinTerrain");
var CockpitPlane_1 = require("./CockpitPlane");
var HudComponent_1 = require("./HudComponent");
var FogHandler_1 = require("./FogHandler");
var PhysicsHandler_1 = require("./PhysicsHandler");
var SceneContainer = /** @class */ (function () {
    function SceneContainer(params) {
        var _this = this;
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
        // Initialize a new THREE renderer (you are also allowed
        // to pass an existing canvas for rendering).
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        // this.renderer.setClearColor(0xffffff, 0);
        this.renderer.autoClear = false;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.fogHandler = new FogHandler_1.FogHandler(this);
        this.scene.background = new THREE.Color(this.fogHandler.fogLowerColor);
        this.scene.fog = new THREE.FogExp2(this.fogHandler.fogLowerColor.getHex(), 0.0021);
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
        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50 + this.sceneData.initialDepth;
        pointLight.position.z = 130;
        // add to the scene
        this.scene.add(pointLight);
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
        this.hud = new HudComponent_1.HudComponent(this.renderer.domElement.width, this.renderer.domElement.height);
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
        orbitControls.target.copy(cube.position);
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
        this.controls = firstPersonControls;
        // console.log("Stats", Stats);
        this.stats = new stats_module_js_1.default();
        document.querySelector("body").appendChild(this.stats.domElement);
        // // This is the basic render function. It will be called perpetual, again and again,
        // // depending on your machines possible frame rate.
        var _render = function () {
            // Pass the render function itself
            _this.fogHandler.updateFogColor();
            firstPersonControls.update(_this.clock.getDelta());
            _this.stats.update();
            // Let's animate the cube: a rotation.
            _this.cube.rotation.x += 0.05;
            _this.cube.rotation.y += 0.04;
            _this.renderer.render(_this.scene, _this.camera);
            _this.hud.renderHud(_this.renderer, { depth: _this.camera.position.y });
            physicsHandler.render();
            requestAnimationFrame(_render);
        };
        // const zStartOffset = 800.0; // for ImprovedNoise
        var zStartOffset = 300.0; // for Custom noise
        var worldWidth = 256;
        var worldDepth = 256;
        var terrainData = PerlinTerrain_1.PerlinTerrain.generatePerlinHeight(worldWidth, worldWidth);
        var terrain = new PerlinTerrain_1.PerlinTerrain(terrainData, worldWidth, worldDepth); // .makeTerrain();
        terrain.mesh.position.y = this.sceneData.initialDepth - zStartOffset;
        this.scene.add(terrain.mesh);
        window.addEventListener("resize", function () {
            _self.onWindowResize();
        });
        // Enable and disable mouse controls when mouse leaves/re-enters the screen.
        this.renderer.domElement.addEventListener("mouseleave", function () {
            console.log("leave");
            _self.controls.enabled = false;
        });
        this.renderer.domElement.addEventListener("mouseenter", function () {
            _self.controls.enabled = true;
        });
        // Initialize physics
        var physicsHandler = new PhysicsHandler_1.PhysicsHandler(this, terrain);
        physicsHandler.start();
        // Call the rendering function. This will cause and infinite recursion (we want
        // that here, because the animation shall run forever).
        this.onWindowResize();
        _render();
    }
    SceneContainer.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.cockpit.setCockpitSize(window.innerWidth, window.innerHeight);
        this.hud.setHudSize(this.renderer.domElement.width, this.renderer.domElement.height);
        if (this.controls.hasOwnProperty("handleResize")) {
            this.controls.handleResize();
        }
    };
    return SceneContainer;
}());
exports.SceneContainer = SceneContainer;
//# sourceMappingURL=SceneContainer.js.map