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
        var textureData = PerlinTexture.generateTexture(heightMap.data, heightMap.widthSegments, heightMap.depthSegments);
        this.imageCanvas = textureData.imageCanvas;
        this.imageData = textureData.imageData;
        this.imageDataArray = textureData.imageDataArray;
        var texture = new THREE.CanvasTexture(textureData.imageCanvas);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        this.material = new THREE.MeshBasicMaterial({ map: texture });
    }
    PerlinTexture.generateTexture = function (data, width, height) {
        var context;
        var imageData;
        var imageDataArray;
        var shade;
        var vector3 = new THREE.Vector3(0, 0, 0);
        var sun = new THREE.Vector3(1, 1, 1);
        sun.normalize();
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        context = canvas.getContext("2d");
        context.fillStyle = "#000";
        context.fillRect(0, 0, width, height);
        imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // !!! TODO Check
        imageDataArray = imageData.data; //  as any as Array<number>;
        for (var i = 0, j = 0, l = imageDataArray.length; i < l; i += 4, j++) {
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
        var canvasScaled = document.createElement("canvas");
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;
        context = canvasScaled.getContext("2d");
        context.scale(4, 4);
        context.drawImage(canvas, 0, 0);
        imageData = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
        imageDataArray = imageData.data;
        for (var i = 0, l = imageDataArray.length; i < l; i += 4) {
            var v = ~~(Math.random() * 5);
            imageDataArray[i] += v;
            imageDataArray[i + 1] += v;
            imageDataArray[i + 2] += v;
        }
        context.putImageData(imageData, 0, 0);
        return { imageData: imageData, imageDataArray: imageDataArray, imageCanvas: canvasScaled };
    };
    return PerlinTexture;
}());
exports.PerlinTexture = PerlinTexture;
//# sourceMappingURL=PerlinTexture.js.map