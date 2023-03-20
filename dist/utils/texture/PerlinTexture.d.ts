import * as THREE from "three";
import { TextureData, PerlinHeightMap, Size3Immutable } from "../../components/interfaces";
export declare class PerlinTexture implements TextureData {
    readonly material: THREE.Material;
    readonly imageData: ImageData;
    readonly imageDataArray: Uint8ClampedArray;
    readonly imageCanvas: HTMLCanvasElement;
    constructor(heightMap: PerlinHeightMap, worldSize: Size3Immutable);
    static generateTexture(data: Uint8Array, width: number, height: number): TextureData;
}
