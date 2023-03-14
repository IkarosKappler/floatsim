/**
 * @author  Ikaros Kappler
 * @date    2023-03-11
 * @version 1.0.0
 */
import { PerlinTerrain } from "./PerlinTerrain";
import { SceneContainer } from "./SceneContainer";
export declare class PhysicsHandler {
    sceneContainer: SceneContainer;
    terrain: PerlinTerrain;
    ammo: any;
    private ammoIsReady;
    constructor(sceneContainer: SceneContainer, terrain: PerlinTerrain);
    start(): void;
    initTestGraphics(): void;
    /**
     * This function must be called on each main render cycle. It
     * will calculate the next frame in the physics simulation.
     */
    render(): void;
    private updatePhysics;
}
