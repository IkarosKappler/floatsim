import * as THREE from "three";
import { PerlinHeightMap, Size3Immutable } from "./interfaces";
export declare class PerlinTerrain {
    readonly heightMap: PerlinHeightMap;
    readonly worldSize: Size3Immutable;
    readonly worldWidthSegments: number;
    readonly worldDepthSegments: number;
    readonly texture: THREE.CanvasTexture;
    readonly geometry: THREE.PlaneGeometry;
    readonly material: THREE.Material;
    readonly mesh: THREE.Mesh;
    constructor(heightMap: PerlinHeightMap, size: Size3Immutable, worldWidthSegments: number, worldDepthSegments: number);
    private static generateTexture;
    private static customRandom;
    private static generateMeshMaterial;
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
