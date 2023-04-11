import * as THREE from "three";
import { CausticShaderMaterial } from "../../utils/texture/CausticShaderMaterial";
import { IHeightMap, Size3Immutable, TextureData } from "../interfaces";
export declare class PerlinTerrain {
    readonly heightMap: IHeightMap;
    readonly worldSize: Size3Immutable;
    readonly bounds: THREE.Box3;
    readonly texture: THREE.CanvasTexture;
    readonly geometry: THREE.PlaneGeometry;
    readonly mesh: THREE.Mesh;
    readonly causticShaderMaterial: CausticShaderMaterial;
    constructor(heightMap: IHeightMap, worldBunds: THREE.Box3, baseTexture: TextureData);
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
    getHeightAt(x: number, z: number): number;
    static heightMapToPlaneGeometry(heightMap: IHeightMap, worldSize: Size3Immutable): THREE.PlaneGeometry;
}
