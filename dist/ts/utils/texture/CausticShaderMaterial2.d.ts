/**
 * This shader might need some rebuild in the future:
 *  - This contains a re-implementation of the fog (exp2) shader
 *  - no lights are recognized right now
 *
 * @date     2023-03-20
 * @modified 2023-05-03 Refactored to a new class that extends MeshBasicMaterial.
 * @author   Ikaros Kappler
 * @version  1.1.0
 */
import * as THREE from "three";
import { TextureData } from "../../components/interfaces";
export declare class CausticShaderMaterial2 {
    readonly waterMaterial: THREE.MeshBasicMaterial;
    private loopNumber;
    constructor(baseTexture: TextureData);
    update(elapsedTime: number, fogColor: THREE.Color): void;
}
