import * as THREE from "three";
import { CausticShaderMaterial2 } from "../../utils/texture/CausticShaderMaterial2";
import { IHeightMap, Size3Immutable, TextureData } from "../interfaces";
export declare class PerlinTerrain {
    readonly heightMap: IHeightMap;
    readonly worldSize: Size3Immutable;
    readonly bounds: THREE.Box3;
    readonly texture: THREE.CanvasTexture;
    readonly geometry: THREE.PlaneGeometry;
    readonly mesh: THREE.Mesh;
    readonly causticShaderMaterial: CausticShaderMaterial2;
    constructor(heightMap: IHeightMap, worldBunds: THREE.Box3, baseTexture: TextureData);
    /**
     * Get the absolute height position, at the given absolute world coordinates. World coordinates
     * don't have any bouds. If the given coordinates a beyond the limits of this terrain segment
     * then the closest bound position is used.
     *
     * @param {number} absX - The first coordinate along the `width` axis (local coordinates).
     * @param {number} absZ - The second coordinate along the `depth` axis (local coordinates).
     * @returns {number} The absolute height value along the `height` (=y) axis.
     */
    getHeightAtWorldPosition(absX: number, absZ: number): number;
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
    getHeightAtRelativePosition(x: number, z: number): number;
    /**
     * Check if the given world coordinates are located in this segment's bounds.
     *
     * @param {number} absX - The x position in world coordinates.
     * @param {number} absZ - The z position in world coordinates.
     * @returns {boolean}
     */
    containsAbsolutePosition(absX: number, absZ: number): boolean;
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
    /**
     * A static helper function to convert a heightmap to a plane geometry. Useful if
     * you need the geometry without the specific terrain material.
     * @param heightMap
     * @param worldSize
     * @returns
     */
    static heightMapToPlaneGeometry(heightMap: IHeightMap, worldSize: Size3Immutable): THREE.PlaneGeometry;
}
