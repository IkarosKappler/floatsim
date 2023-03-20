import * as THREE from "three";
import { CausticShaderMaterial } from "../utils/texture/CausticShaderMaterial";
import { PerlinHeightMap, Size3Immutable, TextureData } from "./interfaces";
export declare class PerlinTerrain {
    readonly heightMap: PerlinHeightMap;
    readonly worldSize: Size3Immutable;
    readonly texture: THREE.CanvasTexture;
    readonly geometry: THREE.PlaneGeometry;
    readonly mesh: THREE.Mesh;
    readonly causticShaderMaterial: CausticShaderMaterial;
    constructor(heightMap: PerlinHeightMap, worldSize: Size3Immutable, baseTexture: TextureData);
    private static customRandom;
    /**
     * Create the raw perlin terrain data.
     *
     * @param widthSegments
     * @param depthSegments
     * @param options
     * @returns PerlinHeightMap
     */
    static generatePerlinHeight(widthSegments: number, depthSegments: number, options?: {
        iterations?: number;
        quality?: number;
    }): PerlinHeightMap;
}
