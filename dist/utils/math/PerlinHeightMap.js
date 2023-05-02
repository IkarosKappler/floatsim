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
        var _a, _b, _c, _d, _e, _f;
        this.widthSegments = widthSegments;
        this.depthSegments = depthSegments;
        var iterations = (_a = options === null || options === void 0 ? void 0 : options.iterations) !== null && _a !== void 0 ? _a : 5;
        var initialQuality = (_b = options === null || options === void 0 ? void 0 : options.quality) !== null && _b !== void 0 ? _b : 1.5;
        var offset = { x: (_d = (_c = options === null || options === void 0 ? void 0 : options.offset) === null || _c === void 0 ? void 0 : _c.x) !== null && _d !== void 0 ? _d : 0, y: (_f = (_e = options === null || options === void 0 ? void 0 : options.offset) === null || _e === void 0 ? void 0 : _e.y) !== null && _f !== void 0 ? _f : 0 };
        // console.log("iterations", iterations, "initialQuality", initialQuality);
        var useCustomNoise = true;
        var seed = Math.PI / 4;
        var size = widthSegments * depthSegments;
        // this.data = new Uint8Array(size);
        this.data = new Float32Array(size);
        // Todo: keep track of the height data and find min/max
        var minHeightValue = Number.MAX_VALUE;
        var maxHeightValue = Number.MIN_VALUE;
        var perlin = new ImprovedNoise_1.ImprovedNoise();
        var getHeight = function (x, y, z) {
            // if (useCustomNoise) {
            //   return noise.perlin3(x, y, z);
            // } else {
            //   return perlin.noise(x, y, z);
            // }
            if (useCustomNoise) {
                return perlin_1.noise.perlin3(offset.x + x, offset.y + y, z);
            }
            else {
                return perlin.noise(offset.x + x, offset.y + y, z);
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
                // minHeightValue = Math.min(minHeightValue, pValue);
                // maxHeightValue = Math.max(maxHeightValue, pValue);
                this.data[i] += Math.abs(pValue * resolution * depthFactor);
                if (j + 1 === iterations) {
                    minHeightValue = Math.min(minHeightValue, this.data[i]);
                    maxHeightValue = Math.max(maxHeightValue, this.data[i]);
                }
            }
            resolution *= qualityFactor;
            // quality *= quality;
        }
        // console.log("minHeightValue", minHeightValue, "maxHeightvalue", maxHeightValue);
        this.minHeightValue = minHeightValue;
        this.maxHeightValue = maxHeightValue;
    } // END constructor
    /**
     * Convert a position on the heightmap's x-y-grid to an offset inside the
     * underlying data array.
     *
     * @param {number} x - The x position in 0 <= x < widthSegments.
     * @param {number} z - The z position in 0 <= z < depthSegments.
     * @returns {number} The array offset (index) of the grid value in the data array.
     */
    PerlinHeightMap.prototype.getOffset = function (x, z) {
        return Math.max(0, Math.min(z * this.depthSegments + x, this.data.length - 1));
    };
    PerlinHeightMap.prototype.getValueAt = function (x, z) {
        return this.data[this.getOffset(x, z)];
    };
    PerlinHeightMap.prototype.setValueAt = function (x, z, newValue) {
        var index = this.getOffset(x, z);
        this.data[index] = newValue;
    };
    PerlinHeightMap.prototype.bilinearSmoothstep = function (squareSize) {
        // const squareArea = squareSize * squareSize;
        for (var x = 0; x < this.widthSegments; x++) {
            for (var z = 0; z < this.depthSegments; z++) {
                this.setValueAt(x, z, this.aggregateNeightbourValues(x, z, squareSize));
            }
        }
        return this;
    };
    PerlinHeightMap.prototype.aggregateNeightbourValues = function (x, z, squareSize) {
        var value = 0;
        var count = 0;
        for (var i = 0; i < squareSize && x + i < this.widthSegments; i++) {
            for (var j = 0; j < squareSize && z + j < this.depthSegments; j++) {
                value += this.getValueAt(x + i, z + j);
                count++;
            }
        }
        return value / count;
    };
    return PerlinHeightMap;
}());
exports.PerlinHeightMap = PerlinHeightMap;
//# sourceMappingURL=PerlinHeightMap.js.map