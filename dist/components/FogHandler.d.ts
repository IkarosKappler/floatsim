import * as THREE from "three";
import { SceneContainer } from "./SceneContainer";
/**
 * Fog is measured this way:
 *
 * ----- highGogDepth.max
 *   |
 *   | (greenish color)
 *   |
 * ----- highFogDepth.min
 *   |
 *   | (normal blue color )
 *   |
 * ----- deepFogDepdth.max
 *   |
 *   | (dark blackish blue color)
 *   |
 * ----- deepFogDeath.min
 */
export declare class FogHandler {
    private sceneContainer;
    readonly fogNormalColor: THREE.Color;
    readonly fogUpperColor: THREE.Color;
    readonly fogLowerColor: THREE.Color;
    constructor(sceneContainer: SceneContainer);
    updateFogColor(): void;
    private applyFogColor;
}
