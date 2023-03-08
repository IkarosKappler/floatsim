import * as THREE from "three";
export declare class PerlinTerrain extends THREE.Mesh<THREE.PlaneGeometry> {
    readonly data: Uint8Array;
    readonly worldWidth: number;
    readonly worldDepth: number;
    readonly texture: THREE.CanvasTexture;
    constructor(data: Uint8Array, worldWidth: number, worldDepth: number);
    private makeTerrain;
    private static generateTexture;
    private static customRandom;
    private static generateMeshMaterial;
    static generatePerlinHeight(width: number, height: number): Uint8Array;
}
