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
var CausticShaderMaterial_1 = require("../../utils/texture/CausticShaderMaterial");
var Helpers_1 = require("../../utils/Helpers");
var PerlinTerrain = /** @class */ (function () {
    function PerlinTerrain(heightMap, worldBunds, baseTexture) {
        this.heightMap = heightMap;
        this.bounds = worldBunds;
        this.worldSize = (0, Helpers_1.bounds2size)(worldBunds);
        this.geometry = PerlinTerrain.heightMapToPlaneGeometry(heightMap, this.worldSize);
        this.causticShaderMaterial = new CausticShaderMaterial_1.CausticShaderMaterial(baseTexture);
        this.mesh = new THREE.Mesh(this.geometry, this.causticShaderMaterial.waterMaterial);
    }
    /**
     * Get the relative height value, the y position relative to bounds.min.y at the
     * given relative world coordinates. World coordinates go from
     *   - 0 <= x < width
     *   - 0 <= y < depth
     *
     * @param {number} x - The first coordinate along the `width` axis.
     * @param {number} z - The second coordinate along the `depth` axis.
     * @returns {number} The height value along the `height` (=y) axis relative to bounds.min.y.
     */
    PerlinTerrain.prototype.getHeightAt = function (x, z) {
        // Convert absolute positions inside [0..x..width] and [0..y..depth]
        // to relative values inside the height map.
        var xRel = Math.floor((x / this.worldSize.width) * this.heightMap.widthSegments);
        var zRel = Math.floor((z / this.worldSize.depth) * this.heightMap.depthSegments);
        // const i: number = Math.max(0, Math.min(zRel * this.heightMap.depthSegments + xRel, this.heightMap.data.length - 1));
        var i = this.heightMap.getOffset(xRel, zRel);
        return this.heightMap.data[i] * this.worldSize.height;
    };
    /**
     * A static helper function to convert a heightmap to a plane geometry. Useful if
     * you need the geometry without the specific terrain material.
     * @param heightMap
     * @param worldSize
     * @returns
     */
    PerlinTerrain.heightMapToPlaneGeometry = function (heightMap, worldSize) {
        var geometry = new THREE.PlaneGeometry(worldSize.width, worldSize.depth, heightMap.widthSegments - 1, heightMap.depthSegments - 1);
        geometry.rotateX(-Math.PI / 2);
        // !!! TODO: check this
        var vertices = geometry.attributes.position.array;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = heightMap.data[i] * worldSize.height;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        return geometry;
    };
    return PerlinTerrain;
}());
exports.PerlinTerrain = PerlinTerrain;
//# sourceMappingURL=PerlinTerrain.js.map