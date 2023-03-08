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
var OrbitControls_js_1 = require("three/examples/jsm/controls/OrbitControls.js");
// import * as SceneUtils from "three/examples/jsm/utils/SceneUtils.js";
var PerlinTerrain_1 = require("./PerlinTerrain");
// import * as perlin from "perlin-noise/index.js";
// import { noise } from "../utils/perlin";
var SceneContainer = /** @class */ (function () {
    function SceneContainer() {
        /**
         * Example for a basic THREE.js scene setup.
         *
         * @author  Ikaros Kappler
         * @date    2015-11-09
         * @version 1.0.0
         **/
        var _this = this;
        console.log("THREE.Scene", THREE);
        // Create new scene
        this.scene = new THREE.Scene();
        // Create a camera to look through
        // this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // Initialize a new THREE renderer (you are also allowed
        // to pass an existing canvas for rendering).
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.scene.background = new THREE.Color(0x021a38);
        this.scene.fog = new THREE.FogExp2(0x021a38, 0.0021);
        var zStartOffset = 200.0;
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
        //this.pointLight = new THREE.AmbientLight(0xFFFFFF);
        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50 + 200;
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
        ah.position.y += 200;
        this.scene.add(ah);
        // Set the camera position
        this.camera.position.set(75, 75 + 200, 75);
        // And look at the cube again
        this.camera.lookAt(cube.position);
        // Finally we want to be able to rotate the whole scene with the mouse:
        // add an orbit control helper.
        var _self = this;
        // TODO: Use FirstPersonControls!
        var orbitControls = new OrbitControls_js_1.OrbitControls(this.camera, this.renderer.domElement);
        // Always move the point light with the camera. Looks much better ;)
        orbitControls.addEventListener("change", function () {
            pointLight.position.copy(_self.camera.position);
        });
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 1.0;
        orbitControls.enableZoom = true;
        orbitControls.target.copy(cube.position);
        /*
        const controls = new FirstPersonControls(this.camera, this.renderer.domElement);
        controls.movementSpeed = 150;
        controls.lookSpeed = 0.1;
        */
        // This is the basic render function. It will be called perpetual, again and again,
        // depending on your machines possible frame rate.
        var _render = function () {
            // Pass the render function itself
            requestAnimationFrame(_render);
            // Let's animate the cube: a rotation.
            cube.rotation.x += 0.05;
            cube.rotation.y += 0.04;
            _this.renderer.render(_this.scene, _this.camera);
        };
        // Call the rendering function. This will cause and infinite recursion (we want
        // that here, because the animation shall run forever).
        _render();
        // // ADD A SCENE FROM PERLIN NOISE
        // //    https://codepen.io/ptc24/pen/BpXbOW
        // var pgeom = new THREE.PlaneGeometry(5, 5, 99, 99);
        // var plane = SceneUtils.createMultiMaterialObject(pgeom, [
        //   new THREE.MeshPhongMaterial({
        //     color: 0x33ff33,
        //     specular: 0x773300,
        //     side: THREE.DoubleSide,
        //     // shading: THREE.FlatShading,
        //     shininess: 3
        //   })
        //   //    new THREE.MeshStandardMaterial( { color: 0x33ff33, metalness: 0.3, side: THREE.DoubleSide, roughness: 1.0, shading: THREE.FlatShading} )
        //   //,new THREE.MeshLambertMaterial( {
        //   //    color:0xffffff, wireframe:true
        //   //  })
        // ]);
        // //var plane = new THREE.Mesh(pgeom, material);
        // this.scene.add(plane);
        // plane.rotation.x = -3.14 / 3.5;
        // noise.seed(Math.random());
        // for (var i = 0; i < 100; i++) {
        //   for (var j = 0; j < 100; j++) {
        //     var ex = 0.5;
        //     pgeom.vertices[i + j * 100].z =
        //       (noise.simplex2(i / 100, j / 100) +
        //         noise.simplex2((i + 200) / 50, j / 50) * Math.pow(ex, 1) +
        //         noise.simplex2((i + 400) / 25, j / 25) * Math.pow(ex, 2) +
        //         noise.simplex2((i + 600) / 12.5, j / 12.5) * Math.pow(ex, 3) +
        //         +(noise.simplex2((i + 800) / 6.25, j / 6.25) * Math.pow(ex, 4))) /
        //       2;
        //   }
        // }
        console.log("PerlinTerrain", PerlinTerrain_1.PerlinTerrain);
        var terrain = new PerlinTerrain_1.PerlinTerrain().makeTerrain();
        this.scene.add(terrain);
    }
    return SceneContainer;
}());
exports.SceneContainer = SceneContainer;
//# sourceMappingURL=SceneContainer.js.map