/**
 * A custom scene renderer for everything that happens in the cockpit.
 *
 * Replacement for cockpitPlane?
 *
 * @author  Ikaros Kappler
 * @date    2023-04-14
 * @version 1.0.0
 */
import * as THREE from "three";
export declare class CockpitScene {
    readonly mesh: THREE.Mesh;
    private readonly cockpitCamera;
    private readonly cockpitScene;
    private readonly cockpitPlane;
    constructor(width: number, height: number);
    setCockpitSize(width: number, height: number): void;
}
