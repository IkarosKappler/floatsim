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
exports.PerlinTexture = void 0;
var THREE = __importStar(require("three"));
var PerlinTexture = /** @class */ (function () {
    function PerlinTexture(heightMap, worldSize) {
        // const textureData = PerlinTexture.generateTexture(heightMap.data, heightMap.widthSegments, heightMap.depthSegments);
        // const textureData = PerlinTexture.generateTexture(heightMap.data, worldSize.width, worldSize.depth);
        var textureData = PerlinTexture.generateTexture(heightMap.data, heightMap.widthSegments, heightMap.depthSegments, heightMap.minHeightValue, heightMap.maxHeightValue - heightMap.minHeightValue //  worldSize.height
        );
        this.imageCanvas = textureData.imageCanvas;
        this.imageData = textureData.imageData;
        this.imageDataArray = textureData.imageDataArray;
        var texture = new THREE.CanvasTexture(textureData.imageCanvas);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        this.material = new THREE.MeshBasicMaterial({ map: texture });
    }
    PerlinTexture.generateTexture = function (data, width, height, minHeightValue, worldHeight) {
        var context;
        var imageData;
        var imageDataArray;
        // let shade: number;
        // const vector3: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        // const sun = new THREE.Vector3(1, 1, 1);
        // sun.normalize();
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        context = canvas.getContext("2d");
        context.fillStyle = "#000";
        context.fillRect(0, 0, width, height);
        imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // !!! TODO Check
        imageDataArray = imageData.data; //  as any as Array<number>;
        // Generate first level pixel data from terrain data
        PerlinTexture.generateTexturePixelColor(data, imageDataArray, width);
        // PerlinTexture.lerpColorByDepth(data, imageDataArray, width, height, minHeightValue, worldHeight);
        context.putImageData(imageData, 0, 0);
        // Scaled 4x
        var canvasScaled = document.createElement("canvas");
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;
        context = canvasScaled.getContext("2d");
        context.scale(4, 4);
        var cw = canvas.width;
        var ch = canvas.height;
        // Rotate and flip the texture so it fits with the terrain
        context.translate(cw, ch / cw);
        context.rotate(-Math.PI / 2);
        context.scale(-1, -1);
        context.drawImage(canvas, 0 * cw, 0 * ch); //0, 0);
        // context.drawImage(canvas, -canvas.width, 0 * canvas.height);
        imageData = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
        imageDataArray = imageData.data;
        // Add a little bit of pixel noise
        PerlinTexture.addPixelNoise(imageDataArray);
        context.putImageData(imageData, 0, 0);
        return { imageData: imageData, imageDataArray: imageDataArray, imageCanvas: canvasScaled };
    };
    PerlinTexture.generateTexturePixelColor = function (data, imageDataArray, width) {
        var sun = new THREE.Vector3(1, 1, 1);
        sun.normalize();
        var vector3 = new THREE.Vector3(0, 0, 0);
        var shade;
        // const baseColor = [96, 32, 0];
        var baseColor = [82, 82, 132];
        for (var i = 0, j = 0, l = imageDataArray.length; i < l; i += 4, j++) {
            vector3.x = data[j - 2] - data[j + 2];
            vector3.y = 2;
            vector3.z = data[j - width * 2] - data[j + width * 2];
            vector3.normalize();
            shade = vector3.dot(sun);
            // imageDataArray[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
            // imageDataArray[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
            // imageDataArray[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
            // imageDataArray[i + 3] = 255;
            // imageDataArray[i] = (96 + shade * baseColor[0]) * (0.5 + data[j] * 0.007);
            // imageDataArray[i + 1] = (32 + shade * baseColor[1]) * (0.5 + data[j] * 0.007);
            // imageDataArray[i + 2] = shade * baseColor[2] * (0.5 + data[j] * 0.007);
            // imageDataArray[i + 3] = 255;
            imageDataArray[i] = (baseColor[0] + shade * 64) * (0.5 + data[j] * 0.007);
            imageDataArray[i + 1] = (baseColor[1] + shade * 96) * (0.5 + data[j] * 0.007);
            imageDataArray[i + 2] = (baseColor[2] + shade * 124) * (0.5 + data[j] * 0.007);
            imageDataArray[i + 3] = 255;
        }
    };
    // private static lerpColorByDepth(
    //   data: Float32Array | Uint8Array,
    //   imageDataArray: Uint8ClampedArray,
    //   width: number,
    //   depth: number,
    //   minHeightValue: number,
    //   worldHeight: number
    // ) {
    //   // const sun = new THREE.Vector3(1, 1, 1);
    //   // sun.normalize();
    //   const vector3: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    //   let heightValue: number;
    //   let shade: number;
    //   let minShade = Number.MAX_VALUE;
    //   let maxShade = Number.MIN_VALUE;
    //   for (let i = 0, j = 0, l = imageDataArray.length; i < l; i += 4, j++) {
    //     // vector3.x = data[j - 2] - data[j + 2];
    //     // vector3.y = 2;
    //     // vector3.z = data[j - width * 2] - data[j + width * 2];
    //     // vector3.normalize();
    //     heightValue = data[data.length - 1 - j];
    //     // heightValue = data[Math.floor(j * width) + (j % width)] - minHeightValue;
    //     // shade = vector3.dot(sun);
    //     shade = heightValue / worldHeight;
    //     if (i < 20 || (i > 100 && i < 200)) {
    //       console.log("i", i, "worldHeight", worldHeight, "heightValue", heightValue, "shade", shade);
    //     }
    //     if (Number.isNaN(shade)) {
    //       console.log("SHADE IS NOT A NUMBER i", i, "worldHeight", worldHeight, "heightValue", heightValue, "shade", shade);
    //     } else {
    //       minShade = Math.min(minShade, shade);
    //       maxShade = Math.max(maxShade, shade);
    //     }
    //     // imageDataArray[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
    //     // imageDataArray[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
    //     // imageDataArray[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
    //     // imageDataArray[i + 3] = 255;
    //     // imageDataArray[i] = imageDataArray[i] * shade;
    //     // imageDataArray[i + 1] = imageDataArray[i + 1] * shade;
    //     // imageDataArray[i + 2] = imageDataArray[i + 2] * shade;
    //     imageDataArray[i] = 255 * shade;
    //     imageDataArray[i + 1] = 255 * shade;
    //     imageDataArray[i + 2] = 255 * shade;
    //     // imageDataArray[i + 3] = 255;
    //   }
    //   console.log("minShade", minShade, "maxShade", maxShade);
    // }
    PerlinTexture.addPixelNoise = function (imageDataArray) {
        // Add a little bit of pixel noise
        for (var i = 0, l = imageDataArray.length; i < l; i += 4) {
            var v = ~~(Math.random() * 5);
            imageDataArray[i] += v;
            imageDataArray[i + 1] += v;
            imageDataArray[i + 2] += v;
        }
    };
    return PerlinTexture;
}());
exports.PerlinTexture = PerlinTexture;
//# sourceMappingURL=PerlinTexture.js.map