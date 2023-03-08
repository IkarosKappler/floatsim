/**
 * @author  Ikaros Kappler
 * @date    2023-03-08
 * @version 1.0.0
 */
import * as THREE from "three";
export declare class CockpitPlane {
    readonly mesh: THREE.Mesh;
    constructor();
    setCockpitSize(width: number, height: number): void;
}
