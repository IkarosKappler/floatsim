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
// import Stats from 'three/addons/libs/stats.module.js';
// import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
var ImprovedNoise_js_1 = require("three/examples/jsm/math/ImprovedNoise.js");
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
        this.worldDepth = worldDepth;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        // !!! TODO: check this
        var vertices = this.geometry.attributes.position.array;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = this.data[i] * 10;
        }
    }
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
        var useCustomNoise = true;
        var seed = Math.PI / 4;
        var size = width * height, data = new Uint8Array(size);
        if (useCustomNoise) {
            var z = this.customRandom(seed) * 100;
            var quality = 1.5;
            var depthFactor = 0.15;
            for (var j = 0; j < 5; j++) {
                for (var i = 0; i < size; i++) {
                    var x = i % width, y = ~~(i / width);
                    data[i] += Math.abs(perlin_1.noise.perlin3(x / quality, y / quality, z) * quality * depthFactor);
                }
                quality *= 5;
            }
        }
        else {
            console.log("Improved Noise: ", ImprovedNoise_js_1.ImprovedNoise);
            var perlin = new ImprovedNoise_js_1.ImprovedNoise();
            //   z = Math.random() * 100;
            var z = this.customRandom(seed) * 100;
            var quality = 1.5;
            var depthFactor = 0.25;
            for (var j = 0; j < 5; j++) {
                for (var i = 0; i < size; i++) {
                    var x = i % width, y = ~~(i / width);
                    data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * depthFactor);
                }
                quality *= 5;
            }
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