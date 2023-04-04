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
var ImprovedNoise_js_1 = require("three/examples/jsm/math/ImprovedNoise.js");
var perlin_1 = require("../utils/perlin");
var CausticShaderMaterial_1 = require("../utils/texture/CausticShaderMaterial");
var Helpers_1 = require("../utils/Helpers");
var PerlinTerrain = /** @class */ (function () {
    // constructor(heightMap: PerlinHeightMap, worldSize: Size3Immutable, baseTexture: TextureData) {
    function PerlinTerrain(heightMap, worldBunds, baseTexture) {
        this.heightMap = heightMap;
        // this.worldSize = worldSize;
        this.bounds = worldBunds;
        var worldSize = (0, Helpers_1.bounds2size)(worldBunds);
        this.geometry = PerlinTerrain.heightMapToPlaneGeometry(heightMap, worldSize);
        this.causticShaderMaterial = new CausticShaderMaterial_1.CausticShaderMaterial(baseTexture);
        this.mesh = new THREE.Mesh(this.geometry, this.causticShaderMaterial.waterMaterial);
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
        var maxHeightValue = Number.MIN_VALUE;
        var perlin = new ImprovedNoise_js_1.ImprovedNoise();
        var getHeight = function (x, y, z) {
            if (useCustomNoise) {
                return perlin_1.noise.perlin3(x, y, z);
            }
            else {
                return perlin.noise(x, y, z);
            }
        };
        var z = this.customRandom(seed) * 100;
        var resolution = initialQuality; // 1.5;
        // const depthFactor = 0.15; // 0.15 for custom noise
        var depthFactor = 0.12; // 0.15 for custom noise
        var qualityFactor = 4.0;
        for (var j = 0; j < iterations; j++) {
            for (var i = 0; i < size; i++) {
                var x = i % widthSegments, y = ~~(i / widthSegments);
                var pValue = getHeight(x / resolution, y / resolution, z);
                // if (i > 2 * widthSegments && i < 4 * widthSegments) {
                //   console.log("pValue", pValue);
                // }
                minHeightValue = Math.min(minHeightValue, pValue);
                maxHeightValue = Math.max(maxHeightValue, pValue);
                data[i] += Math.abs(pValue * resolution * depthFactor); // Math.pow(depthFactor, iterations - j));
                // data[i] += Math.abs((pValue * 2.0) / quality);
            }
            resolution *= qualityFactor;
            // quality *= quality;
        }
        console.log("minHeightValue", minHeightValue, "maxHeightvalue", maxHeightValue);
        return { data: data, widthSegments: widthSegments, depthSegments: depthSegments, minHeightValue: minHeightValue, maxHeightValue: maxHeightValue };
    }; // END generatePerlinHeight
    PerlinTerrain.heightMapToPlaneGeometry = function (heightMap, worldSize) {
        var geometry = new THREE.PlaneGeometry(worldSize.x, // width,
        worldSize.z, // depth,
        heightMap.widthSegments - 1, heightMap.depthSegments - 1);
        geometry.rotateX(-Math.PI / 2);
        // !!! TODO: check this
        var vertices = geometry.attributes.position.array;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = heightMap.data[i] * 10;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        return geometry;
    };
    return PerlinTerrain;
}());
exports.PerlinTerrain = PerlinTerrain;
//# sourceMappingURL=PerlinTerrain.js.map