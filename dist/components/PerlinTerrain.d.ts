import * as THREE from "three";
import { PerlinHeightMap, Size3Immutable } from "./interfaces";
export declare class PerlinTerrain {
    readonly heightMap: PerlinHeightMap;
    readonly worldSize: Size3Immutable;
    readonly texture: THREE.CanvasTexture;
    readonly geometry: THREE.PlaneGeometry;
    readonly material: THREE.Material;
    readonly mesh: THREE.Mesh;
    constructor(heightMap: PerlinHeightMap, worldSize: Size3Immutable);
    static generateTexture(data: Uint8Array, width: number, height: number): {
        imageData: ImageData;
        imageDataArray: Uint8ClampedArray;
        imageCanvas: HTMLCanvasElement;
    };
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
