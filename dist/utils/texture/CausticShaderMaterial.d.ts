/**
 * This shader might need some rebuild in the future:
 *  - This contains a re-implementation of the fog (exp2) shader
 *  - no lights are recognized right now
 *
 * @date    2023-03-20
 * @author  Ikaros Kappler
 * @version 1.0.0
 */
import * as THREE from "three";
import { TextureData } from "../../components/interfaces";
export declare class CausticShaderMaterial {
    readonly waterMaterial: THREE.ShaderMaterial;
    private loopNumber;
    constructor(baseTexture: TextureData);
    update(elapsedTime: number, fogColor: THREE.Color): void;
}
