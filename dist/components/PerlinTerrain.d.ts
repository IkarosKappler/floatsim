import * as THREE from "three";
import { PerlinHeightMap, Size3Immutable, TextureData } from "./interfaces";
export declare class PerlinTerrain {
    readonly heightMap: PerlinHeightMap;
    readonly worldSize: Size3Immutable;
    readonly texture: THREE.CanvasTexture;
    readonly geometry: THREE.PlaneGeometry;
    readonly material: THREE.Material;
    readonly mesh: THREE.Mesh;
    constructor(heightMap: PerlinHeightMap, worldSize: Size3Immutable, texture: TextureData);
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
