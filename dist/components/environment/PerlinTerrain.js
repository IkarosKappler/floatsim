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
var CausticShaderMaterial2_1 = require("../../utils/texture/CausticShaderMaterial2");
var Helpers_1 = require("../../utils/Helpers");
var PerlinTerrain = /** @class */ (function () {
    function PerlinTerrain(heightMap, worldBunds, baseTexture) {
        this.heightMap = heightMap;
        this.bounds = worldBunds;
        this.worldSize = (0, Helpers_1.bounds2size)(worldBunds);
        this.geometry = PerlinTerrain.heightMapToPlaneGeometry(heightMap, this.worldSize);
        this.causticShaderMaterial = new CausticShaderMaterial2_1.CausticShaderMaterial2(baseTexture);
        this.mesh = new THREE.Mesh(this.geometry, this.causticShaderMaterial.waterMaterial);
    }
    /**
     * Get the absolute height position, at the given absolute world coordinates. World coordinates
     * don't have any bouds. If the given coordinates a beyond the limits of this terrain segment
     * then the closest bound position is used.
     *
     * @param {number} absX - The first coordinate along the `width` axis (local coordinates).
     * @param {number} absZ - The second coordinate along the `depth` axis (local coordinates).
     * @returns {number} The absolute height value along the `height` (=y) axis.
     */
    PerlinTerrain.prototype.getHeightAtWorldPosition = function (absX, absZ) {
        return (this.mesh.position.y +
            this.getHeightAtRelativePosition(absX - this.mesh.position.x + this.worldSize.width / 2, absZ - this.mesh.position.z + this.worldSize.depth / 2));
    };
    // The heightmap has an internal measure [computationalMin ... computationalMax]
    // This function maps these values the terrain bounds.
    PerlinTerrain.prototype.mapValueToHeight = function (heightValue) {
        var relativeHeightRange = this.heightMap.computationalMax - this.heightMap.computationalMin;
        var normalizedHeightValue = (heightValue - this.heightMap.computationalMin) / relativeHeightRange;
        return normalizedHeightValue * this.worldSize.height;
    };
    /**
     * Get the relative height value, the y position relative to bounds.min.y at the
     * given relative world (local) coordinates. Local coordinates go from
     *   - 0 <= x < width
     *   - 0 <= y < depth
     *
     * @param {number} x - The first coordinate along the `width` axis (local coordinates).
     * @param {number} z - The second coordinate along the `depth` axis (local coordinates).
     * @returns {number} The height value along the `height` (=y) axis relative to bounds.min.y.
     */
    PerlinTerrain.prototype.getHeightAtRelativePosition = function (x, z) {
        // Convert absolute positions inside [0..x..width] and [0..y..depth]
        // to relative values inside the height map.
        var xRel = Math.floor((x / this.worldSize.width) * this.heightMap.widthSegments);
        var zRel = Math.floor((z / this.worldSize.depth) * this.heightMap.depthSegments);
        // const i: number = Math.max(0, Math.min(zRel * this.heightMap.depthSegments + xRel, this.heightMap.data.length - 1));
        var i = this.heightMap.getOffset(xRel, zRel);
        // return this.heightMap.data[i] * this.worldSize.height;
        return this.mapValueToHeight(this.heightMap.data[i]);
    };
    /**
     * Check if the given world coordinates are located in this segment's bounds.
     *
     * @param {number} absX - The x position in world coordinates.
     * @param {number} absZ - The z position in world coordinates.
     * @returns {boolean}
     */
    PerlinTerrain.prototype.containsAbsolutePosition = function (absX, absZ) {
        var relX = absX - this.mesh.position.x + this.worldSize.width / 2;
        var relZ = absZ - this.mesh.position.z + this.worldSize.depth / 2;
        return relX >= 0 && relX < this.worldSize.width && relZ >= 0 && relZ < this.worldSize.depth;
    };
    /**
     * Get the absolute position in this terrain for the given x-z coordinates,
     * the y position relative to bounds.min.y at the
     * given relative world coordinates. World coordinates go from
     *   - 0 <= x < width
     *   - 0 <= y < depth
     *
     * @param {Triple<number>} position - The x-z position to use. Result will be stored in the y component.
     * @returns {Triple<number>} The same vector but with new y value.
     */
    // getThreePositionAt(position: Triple<number>): Triple<number> {
    //   position.y = this.bounds.min.y + this.getHeightAt(position.x, position.z);
    //   return position;
    // }
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
        var relativeHeightRange = heightMap.computationalMax - heightMap.computationalMin;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            // vertices[j + 1] = heightMap.data[i] * worldSize.height;
            // Map to [0 ... 1], then map to desired size.
            var normalizedHeightValue = (heightMap.data[i] - heightMap.computationalMin) / relativeHeightRange;
            // if (normalizedHeightValue < 0.5 || normalizedHeightValue > 1) {
            //   console.log("tmp", normalizedHeightValue);
            // }
            vertices[j + 1] = normalizedHeightValue * worldSize.height;
            // vertices[j+1] = this.co(heightMap.data[i]);
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        return geometry;
    };
    return PerlinTerrain;
}());
exports.PerlinTerrain = PerlinTerrain;
//# sourceMappingURL=PerlinTerrain.js.map