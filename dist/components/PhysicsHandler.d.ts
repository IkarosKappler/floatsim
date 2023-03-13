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
    render(): void;
    updatePhysics(deltaTime: any): void;
}
