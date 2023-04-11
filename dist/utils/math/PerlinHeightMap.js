"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerlinHeightMap = void 0;
var ImprovedNoise_1 = require("three/examples/jsm/math/ImprovedNoise");
var Helpers_1 = require("../Helpers");
var perlin_1 = require("./perlin");
/**
 * A wrapper class for holding terrain data (generated from Perlin noise).
 */
var PerlinHeightMap = /** @class */ (function () {
    /**
     * Create the raw perlin terrain data.
     *
     * @param widthSegments
     * @param depthSegments
     * @param options
     * @returns PerlinHeightMap
     */
    function PerlinHeightMap(widthSegments, depthSegments, options) {
        var _a, _b;
        this.widthSegments = widthSegments;
        this.depthSegments = depthSegments;
        var iterations = (_a = options === null || options === void 0 ? void 0 : options.iterations) !== null && _a !== void 0 ? _a : 5;
        var initialQuality = (_b = options === null || options === void 0 ? void 0 : options.quality) !== null && _b !== void 0 ? _b : 1.5;
        console.log("iterations", iterations, "initialQuality", initialQuality);
        var useCustomNoise = true;
        var seed = Math.PI / 4;
        var size = widthSegments * depthSegments;
        this.data = new Uint8Array(size);
        // Todo: keep track of the height data and find min/max
        var minHeightValue = Number.MAX_VALUE;
        var maxHeightValue = Number.MIN_VALUE;
        var perlin = new ImprovedNoise_1.ImprovedNoise();
        var getHeight = function (x, y, z) {
            if (useCustomNoise) {
                return perlin_1.noise.perlin3(x, y, z);
            }
            else {
                return perlin.noise(x, y, z);
            }
        };
        var randomizer = new Helpers_1.CustomRandom(seed);
        // z in [0..1]
        var z = randomizer.next(); // customRandom(seed) * 100;
        var resolution = initialQuality; // 1.5;
        // const depthFactor = 0.15; // 0.15 for custom noise
        var depthFactor = 0.12; // 0.15 for custom noise
        var qualityFactor = 4.0;
        for (var j = 0; j < iterations; j++) {
            for (var i = 0; i < size; i++) {
                var x = i % widthSegments, y = ~~(i / widthSegments);
                var pValue = getHeight(x / resolution, y / resolution, z);
                minHeightValue = Math.min(minHeightValue, pValue);
                maxHeightValue = Math.max(maxHeightValue, pValue);
                this.data[i] += Math.abs(pValue * resolution * depthFactor);
            }
            resolution *= qualityFactor;
            // quality *= quality;
        }
        console.log("minHeightValue", minHeightValue, "maxHeightvalue", maxHeightValue);
        this.minHeightValue = minHeightValue;
        this.maxHeightValue = maxHeightValue;
    } // END constructor
    PerlinHeightMap.prototype.bilinearSmoothStep = function () {
        // ...
        return this;
    };
    return PerlinHeightMap;
}());
exports.PerlinHeightMap = PerlinHeightMap;
//# sourceMappingURL=PerlinHeightMap.js.map