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
    function PerlinTerrain(data, worldWidth, worldDepth) {
        // TODO: solve subclassing problem with ES5
        // super(
        //   new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1),
        //   PerlinTerrain.generateMeshMaterial(data, worldWidth, worldDepth)
        // );
        // THREE.Mesh.call(
        //   this,
        //   new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1),
        //   PerlinTerrain.generateMeshMaterial(data, worldWidth, worldDepth)
        // );
        this.data = data;
        this.geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
        this.material = PerlinTerrain.generateMeshMaterial(data, worldWidth, worldDepth);
        this.geometry.rotateX(-Math.PI / 2);
        this.worldWidth = worldWidth;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        // this.data = this.generateHeight(this.worldWidth, this.worldWidth);
        // this.init();
        //   }
        //   init() {
        // this.data = PerlinTerrain.generateHeight(this.worldWidth, this.worldWidth);
        // const geometry = new THREE.PlaneGeometry(7500, 7500, this.worldWidth - 1, this.worldDepth - 1);
        // geometry.rotateX(-Math.PI / 2);
        // !!! TODO: check this
        var vertices = this.geometry.attributes.position.array;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = this.data[i] * 10;
        }
        // this.texture = new THREE.CanvasTexture(PerlinTerrain.generateTexture(this.data, this.worldWidth, this.worldDepth));
        // this.texture.wrapS = THREE.ClampToEdgeWrapping;
        // this.texture.wrapT = THREE.ClampToEdgeWrapping;
        // mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
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
    }
    PerlinTerrain.prototype.makeTerrain = function () {
        // let container;
        var camera, scene, renderer;
        var mesh, texture;
        var worldWidth = 256, worldDepth = 256;
        var clock = new THREE.Clock();
        // const init = () => {
        //   this.data = generateHeight(worldWidth, worldDepth);
        //   const geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
        //   geometry.rotateX(-Math.PI / 2);
        //   // !!! TODO: check this
        //   const vertices = (geometry.attributes.position as any).array;
        //   for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
        //     vertices[j + 1] = data[i] * 10;
        //   }
        //   texture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth));
        //   texture.wrapS = THREE.ClampToEdgeWrapping;
        //   texture.wrapT = THREE.ClampToEdgeWrapping;
        //   mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
        //   // scene.add(mesh);
        //   // renderer = new THREE.WebGLRenderer();
        //   // renderer.setPixelRatio(window.devicePixelRatio);
        //   // renderer.setSize(window.innerWidth, window.innerHeight);
        //   // container.appendChild(renderer.domElement);
        //   //   controls = new FirstPersonControls(camera, renderer.domElement);
        //   // controls.movementSpeed = 150;
        //   // controls.lookSpeed = 0.1;
        //   //   stats = new Stats();
        //   // container.appendChild(stats.dom);
        //   //
        //   // window.addEventListener("resize", onWindowResize);
        // };
        // function onWindowResize() {
        //   camera.aspect = window.innerWidth / window.innerHeight;
        //   camera.updateProjectionMatrix();
        //   renderer.setSize(window.innerWidth, window.innerHeight);
        //   controls.handleResize();
        // }
        // const customRandom = (seed: number) => {
        //   const x = Math.sin(seed++) * 10000;
        //   return x - Math.floor(x);
        // };
        // const generateHeight = (width: number, height: number) => {
        //   let seed = Math.PI / 4;
        //   // window.Math.random = function () {
        //   //   const x = Math.sin(seed++) * 10000;
        //   //   return x - Math.floor(x);
        //   // };
        //   const size = width * height,
        //     data = new Uint8Array(size);
        //   //   console.log("Improved Noise: ", ImprovedNoise);
        //   //   const perlin = new ImprovedNoise(),
        //   //   z = Math.random() * 100;
        //   const z = customRandom(seed) * 100;
        //   let quality = 1;
        //   //   let depth = 1;
        //   for (let j = 0; j < 4; j++) {
        //     for (let i = 0; i < size; i++) {
        //       const x = i % width,
        //         y = ~~(i / width);
        //       //   data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
        //       data[i] += Math.abs(noise.perlin3(x / quality, y / quality, z) * quality * 0.5);
        //     }
        //     quality *= 5;
        //   }
        //   return data;
        // };
        // const generateTexture = (data: Uint8Array, width: number, height: number) => {
        //   let context, image, imageData, shade;
        //   const vector3 = new THREE.Vector3(0, 0, 0);
        //   const sun = new THREE.Vector3(1, 1, 1);
        //   sun.normalize();
        //   const canvas = document.createElement("canvas");
        //   canvas.width = width;
        //   canvas.height = height;
        //   context = canvas.getContext("2d");
        //   context.fillStyle = "#000";
        //   context.fillRect(0, 0, width, height);
        //   image = context.getImageData(0, 0, canvas.width, canvas.height);
        //   // !!! TODO Check
        //   imageData = image.data; //  as any as Array<number>;
        //   for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
        //     vector3.x = data[j - 2] - data[j + 2];
        //     vector3.y = 2;
        //     vector3.z = data[j - width * 2] - data[j + width * 2];
        //     vector3.normalize();
        //     shade = vector3.dot(sun);
        //     imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
        //     imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        //     imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
        //   }
        //   context.putImageData(image, 0, 0);
        //   // Scaled 4x
        //   const canvasScaled = document.createElement("canvas");
        //   canvasScaled.width = width * 4;
        //   canvasScaled.height = height * 4;
        //   context = canvasScaled.getContext("2d");
        //   context.scale(4, 4);
        //   context.drawImage(canvas, 0, 0);
        //   image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
        //   imageData = image.data;
        //   for (let i = 0, l = imageData.length; i < l; i += 4) {
        //     const v = ~~(Math.random() * 5);
        //     imageData[i] += v;
        //     imageData[i + 1] += v;
        //     imageData[i + 2] += v;
        //   }
        //   context.putImageData(image, 0, 0);
        //   return canvasScaled;
        // };
        // this.init();
        // return mesh;
    }; // END constructor
    PerlinTerrain.generateTexture = function (data, width, height) {
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
    PerlinTerrain.customRandom = function (seed) {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
    PerlinTerrain.generatePerlinHeight = function (width, height) {
        var seed = Math.PI / 4;
        // window.Math.random = function () {
        //   const x = Math.sin(seed++) * 10000;
        //   return x - Math.floor(x);
        // };
        var size = width * height, data = new Uint8Array(size);
        //   console.log("Improved Noise: ", ImprovedNoise);
        //   const perlin = new ImprovedNoise(),
        //   z = Math.random() * 100;
        var z = this.customRandom(seed) * 100;
        var quality = 1.5;
        var depthFactor = 0.15;
        for (var j = 0; j < 5; j++) {
            for (var i = 0; i < size; i++) {
                var x = i % width, y = ~~(i / width);
                //   data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
                data[i] += Math.abs(perlin_1.noise.perlin3(x / quality, y / quality, z) * quality * depthFactor);
            }
            quality *= 5;
        }
        return data;
    };
    PerlinTerrain.generateMeshMaterial = function (data, worldWidth, worldDepth) {
        var texture = new THREE.CanvasTexture(PerlinTerrain.generateTexture(data, worldWidth, worldDepth));
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        return new THREE.MeshBasicMaterial({ map: texture });
    };
    return PerlinTerrain;
}());
exports.PerlinTerrain = PerlinTerrain;
//# sourceMappingURL=PerlinTerrain.js.map