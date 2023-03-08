"use strict";
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
exports.PerlinTerrain = void 0;
var THREE = __importStar(require("three"));
var perlin_1 = require("../utils/perlin");
var PerlinTerrain = /** @class */ (function () {
    function PerlinTerrain() {
    }
    PerlinTerrain.prototype.makeTerrain = function () {
        // let container;
        var camera, scene, renderer;
        var mesh, texture;
        var worldWidth = 256, worldDepth = 256;
        var clock = new THREE.Clock();
        //   init();
        // animate();
        var init = function () {
            //   container = document.getElementById("container");
            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xefd1b5);
            scene.fog = new THREE.FogExp2(0xefd1b5, 0.0025);
            var data = generateHeight(worldWidth, worldDepth);
            camera.position.set(100, 800, -800);
            camera.lookAt(-100, 810, -800);
            var geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
            geometry.rotateX(-Math.PI / 2);
            // !!! TODO: check this
            var vertices = geometry.attributes.position.array;
            for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
                vertices[j + 1] = data[i] * 10;
            }
            texture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth));
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
            // scene.add(mesh);
            // renderer = new THREE.WebGLRenderer();
            // renderer.setPixelRatio(window.devicePixelRatio);
            // renderer.setSize(window.innerWidth, window.innerHeight);
            // container.appendChild(renderer.domElement);
            //   controls = new FirstPersonControls(camera, renderer.domElement);
            // controls.movementSpeed = 150;
            // controls.lookSpeed = 0.1;
            //   stats = new Stats();
            // container.appendChild(stats.dom);
            //
            // window.addEventListener("resize", onWindowResize);
        };
        // function onWindowResize() {
        //   camera.aspect = window.innerWidth / window.innerHeight;
        //   camera.updateProjectionMatrix();
        //   renderer.setSize(window.innerWidth, window.innerHeight);
        //   controls.handleResize();
        // }
        var customRandom = function (seed) {
            var x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
        var generateHeight = function (width, height) {
            var seed = Math.PI / 4;
            // window.Math.random = function () {
            //   const x = Math.sin(seed++) * 10000;
            //   return x - Math.floor(x);
            // };
            var size = width * height, data = new Uint8Array(size);
            //   console.log("Improved Noise: ", ImprovedNoise);
            //   const perlin = new ImprovedNoise(),
            //   z = Math.random() * 100;
            var z = customRandom(seed) * 100;
            var quality = 1;
            //   let depth = 1;
            for (var j = 0; j < 4; j++) {
                for (var i = 0; i < size; i++) {
                    var x = i % width, y = ~~(i / width);
                    //   data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
                    data[i] += Math.abs(perlin_1.noise.perlin3(x / quality, y / quality, z) * quality * 0.5);
                }
                quality *= 5;
            }
            return data;
        };
        var generateTexture = function (data, width, height) {
            var context, image, imageData, shade;
            var vector3 = new THREE.Vector3(0, 0, 0);
            var sun = new THREE.Vector3(1, 1, 1);
            sun.normalize();
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            context = canvas.getContext("2d");
            context.fillStyle = "#000";
            context.fillRect(0, 0, width, height);
            image = context.getImageData(0, 0, canvas.width, canvas.height);
            // !!! TODO Check
            imageData = image.data; //  as any as Array<number>;
            for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
                vector3.x = data[j - 2] - data[j + 2];
                vector3.y = 2;
                vector3.z = data[j - width * 2] - data[j + width * 2];
                vector3.normalize();
                shade = vector3.dot(sun);
                imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
                imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
                imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
            }
            context.putImageData(image, 0, 0);
            // Scaled 4x
            var canvasScaled = document.createElement("canvas");
            canvasScaled.width = width * 4;
            canvasScaled.height = height * 4;
            context = canvasScaled.getContext("2d");
            context.scale(4, 4);
            context.drawImage(canvas, 0, 0);
            image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
            imageData = image.data;
            for (var i = 0, l = imageData.length; i < l; i += 4) {
                var v = ~~(Math.random() * 5);
                imageData[i] += v;
                imageData[i + 1] += v;
                imageData[i + 2] += v;
            }
            context.putImageData(image, 0, 0);
            return canvasScaled;
        };
        init();
        return mesh;
    };
    return PerlinTerrain;
}());
exports.PerlinTerrain = PerlinTerrain;
//# sourceMappingURL=PerlinTerrain.js.map