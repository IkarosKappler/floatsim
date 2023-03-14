/**
 * @author  Ikaros Kappler
 * @date    2023-03-11
 * @version 1.0.0
 */
import * as THREE from "three";
import Ammo from "ammojs-typed";
import { PerlinTerrain } from "./PerlinTerrain";
import { SceneContainer } from "./SceneContainer";
type TAmmo = typeof Ammo;
export declare class PhysicsHandler {
    sceneContainer: SceneContainer;
    terrain: PerlinTerrain;
    ammo: TAmmo;
    private ammoIsReady;
    readonly heightData: Float32Array;
    ammoHeightData: number;
    physicsWorld: Ammo.btDiscreteDynamicsWorld;
    readonly dynamicObjects: Array<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>;
    worldTransform: Ammo.btTransform;
    collisionConfiguration: Ammo.btDefaultCollisionConfiguration;
    dispatcher: Ammo.btCollisionDispatcher;
    broadphase: Ammo.btDbvtBroadphase;
    solver: Ammo.btSequentialImpulseConstraintSolver;
    constructor(sceneContainer: SceneContainer, terrain: PerlinTerrain);
    start(): Promise<boolean>;
    initTestGraphics(): void;
    /**
     * This function must be called on each main render cycle. It
     * will calculate the next frame in the physics simulation.
     */
    render(): void;
    private updatePhysics;
    private initPhysics;
}
export {};
