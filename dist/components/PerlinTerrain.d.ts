import * as THREE from "three";
export declare class PerlinTerrain {
    readonly data: Uint8Array;
    readonly worldWidth: number;
    readonly worldDepth: number;
    readonly texture: THREE.CanvasTexture;
    readonly geometry: THREE.PlaneGeometry;
    readonly material: THREE.Material;
    readonly mesh: THREE.Mesh;
    constructor(data: Uint8Array, worldWidth: number, worldDepth: number);
    private static generateTexture;
    private static customRandom;
    private static generateMeshMaterial;
    static generatePerlinHeight(width: number, height: number): Uint8Array;
}
