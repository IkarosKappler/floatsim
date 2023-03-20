/**
 * @date    2023-03-20
 * @author  Ikaros Kappler
 * @version 1.0.0
 */
import * as THREE from "three";
import { PerlinHeightMap, TextureData } from "../../components/interfaces";
export declare class CausticShaderMaterial {
    readonly waterMaterial: THREE.ShaderMaterial;
    private loopNumber;
    constructor(terrainData: PerlinHeightMap, baseTexture: TextureData);
    update(elapsedTime: number): void;
}
