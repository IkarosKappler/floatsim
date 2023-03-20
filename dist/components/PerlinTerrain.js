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
var CausticShaderMaterial_1 = require("../utils/texture/CausticShaderMaterial");
var PerlinTerrain = /** @class */ (function () {
    function PerlinTerrain(heightMap, worldSize, baseTexture) {
        // }, worldWidthSegments: number, worldDepthSegments: number) {
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
        this.heightMap = heightMap;
        this.worldSize = worldSize;
        this.geometry = new THREE.PlaneGeometry(worldSize.width, worldSize.depth, heightMap.widthSegments - 1, heightMap.depthSegments - 1);
        // this.material = PerlinTerrain.generateMeshMaterial(this.heightMap.data, heightMap.widthSegments, heightMap.depthSegments);
        this.geometry.rotateX(-Math.PI / 2);
        // this.mesh = new THREE.Mesh(this.geometry, this.material);
        var canvasTexture = new THREE.CanvasTexture(baseTexture.imageCanvas);
        // this.material = new THREE.MeshBasicMaterial({ map: canvasTexture });
        this.causticShaderMaterial = new CausticShaderMaterial_1.CausticShaderMaterial(heightMap, baseTexture); // canvasTexture);
        // this.material = this.causticShaderMaterial.waterMaterial;
        this.mesh = new THREE.Mesh(this.geometry, this.causticShaderMaterial.waterMaterial); // this.material);
        // !!! TODO: check this
        var vertices = this.geometry.attributes.position.array;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = this.heightMap.data[i] * 10;
        }
    }
    /*
    public static generateTexture(
      data: Uint8Array,
      width: number,
      height: number
    ): { imageData: ImageData; imageDataArray: Uint8ClampedArray; imageCanvas: HTMLCanvasElement } {
      let context: CanvasRenderingContext2D;
      let imageData: ImageData;
      let imageDataArray: Uint8ClampedArray;
      let shade: number;
  
      const vector3: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  
      const sun = new THREE.Vector3(1, 1, 1);
      sun.normalize();
  
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
  
      context = canvas.getContext("2d");
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);
  
      imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      // !!! TODO Check
      imageDataArray = imageData.data; //  as any as Array<number>;
  
      for (let i = 0, j = 0, l = imageDataArray.length; i < l; i += 4, j++) {
        vector3.x = data[j - 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();
  
        shade = vector3.dot(sun);
  
        imageDataArray[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
        imageDataArray[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        imageDataArray[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
        imageDataArray[i + 3] = 255;
      }
  
      context.putImageData(imageData, 0, 0);
  
      // Scaled 4x
  
      const canvasScaled = document.createElement("canvas");
      canvasScaled.width = width * 4;
      canvasScaled.height = height * 4;
  
      context = canvasScaled.getContext("2d");
      context.scale(4, 4);
      context.drawImage(canvas, 0, 0);
  
      imageData = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
      imageDataArray = imageData.data;
  
      for (let i = 0, l = imageDataArray.length; i < l; i += 4) {
        const v = ~~(Math.random() * 5);
  
        imageDataArray[i] += v;
        imageDataArray[i + 1] += v;
        imageDataArray[i + 2] += v;
      }
  
      context.putImageData(imageData, 0, 0);
  
      return { imageData, imageDataArray, imageCanvas: canvasScaled };
    }
  
    private static generateMeshMaterial = (data: Uint8Array, worldWidth: number, worldDepth: number) => {
      const textureData = PerlinTerrain.generateTexture(data, worldWidth, worldDepth);
      const texture = new THREE.CanvasTexture(textureData.imageCanvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return new THREE.MeshBasicMaterial({ map: texture });
    };
    */
    PerlinTerrain.customRandom = function (seed) {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
    /**
     * Create the raw perlin terrain data.
     *
     * @param widthSegments
     * @param depthSegments
     * @param options
     * @returns PerlinHeightMap
     */
    PerlinTerrain.generatePerlinHeight = function (widthSegments, depthSegments, options) {
        var _a, _b;
        var iterations = (_a = options === null || options === void 0 ? void 0 : options.iterations) !== null && _a !== void 0 ? _a : 5;
        var initialQuality = (_b = options === null || options === void 0 ? void 0 : options.quality) !== null && _b !== void 0 ? _b : 1.5;
        console.log("iterations", iterations, "initialQuality", initialQuality);
        var useCustomNoise = true;
        var seed = Math.PI / 4;
        var size = widthSegments * depthSegments;
        var data = new Uint8Array(size);
        // Todo: keep track of the height data and find min/max
        var minHeightValue = Number.MAX_VALUE;
        var maxHeightvalue = Number.MIN_VALUE;
        if (useCustomNoise) {
            var z = this.customRandom(seed) * 100;
            var quality = initialQuality; // 1.5;
            var depthFactor = 0.15;
            for (var j = 0; j < iterations; j++) {
                for (var i = 0; i < size; i++) {
                    var x = i % widthSegments, y = ~~(i / widthSegments);
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
            var quality = initialQuality; //1.5;
            var depthFactor = 0.25;
            for (var j = 0; j < iterations; j++) {
                for (var i = 0; i < size; i++) {
                    var x = i % widthSegments, y = ~~(i / widthSegments);
                    data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * depthFactor);
                }
                quality *= 5;
            }
        }
        return { data: data, widthSegments: widthSegments, depthSegments: depthSegments, minHeightValue: 0.0, maxHeightValue: 0.0 };
    };
    return PerlinTerrain;
}());
exports.PerlinTerrain = PerlinTerrain;
//# sourceMappingURL=PerlinTerrain.js.map