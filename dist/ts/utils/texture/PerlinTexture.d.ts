import * as THREE from "three";
import { TextureData, IHeightMap, Size3Immutable } from "../../components/interfaces";
export declare class PerlinTexture implements TextureData {
    readonly material: THREE.Material;
    readonly imageData: ImageData;
    readonly imageDataArray: Uint8ClampedArray;
    readonly imageCanvas: HTMLCanvasElement;
    constructor(heightMap: IHeightMap, worldSize: Size3Immutable);
    static generateTexture(data: Float32Array | Uint8Array, width: number, height: number, minHeightValue: number, worldHeight: number): TextureData;
    private static generateTexturePixelColor;
    private static addPixelNoise;
}
