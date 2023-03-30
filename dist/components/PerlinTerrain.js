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
        this.heightMap = heightMap;
        this.worldSize = worldSize;
        this.geometry = new THREE.PlaneGeometry(worldSize.width, worldSize.depth, heightMap.widthSegments - 1, heightMap.depthSegments - 1);
        // Add to layers: base texture and caustic effect layer
        this.geometry.clearGroups();
        this.geometry.addGroup(0, Number.POSITIVE_INFINITY, 0);
        this.geometry.addGroup(0, Number.POSITIVE_INFINITY, 1);
        this.geometry.rotateX(-Math.PI / 2);
        this.causticShaderMaterial = new CausticShaderMaterial_1.CausticShaderMaterial(baseTexture);
        this.mesh = new THREE.Mesh(this.geometry, this.causticShaderMaterial.waterMaterial);
        // !!! TODO: check this
        var vertices = this.geometry.attributes.position.array;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = this.heightMap.data[i] * 10;
        }
    }
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