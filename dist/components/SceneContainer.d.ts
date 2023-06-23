/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { Stats } from "../Stats";
import { PerlinTerrain } from "./environment/PerlinTerrain";
import { HudComponent } from "./hud/HudComponent";
import { ISceneContainer, Navpoint, SceneData, Size2Immutable, TweakParams } from "./interfaces";
import { FogHandler } from "./environment/FogHandler";
import { Params } from "../utils/Params";
import { CockpitScene } from "./cockpit/CockpitScene";
export declare class SceneContainer implements ISceneContainer {
    readonly scene: THREE.Scene;
    readonly renderer: THREE.WebGLRenderer;
    readonly rendererSize: Size2Immutable;
    readonly stats: Stats;
    readonly controls: OrbitControls | FirstPersonControls;
    readonly cockpitScene: CockpitScene;
    readonly hud: HudComponent;
    readonly fogHandler: FogHandler;
    readonly sceneData: SceneData;
    readonly tweakParams: TweakParams;
    readonly camera: THREE.PerspectiveCamera;
    readonly clock: THREE.Clock;
    readonly collidableMeshes: Array<THREE.Object3D>;
    readonly terrainSegments: Array<PerlinTerrain>;
    readonly navpoints: Array<Navpoint>;
    private isGameRunning;
    cube: THREE.Mesh;
    constructor(params: Params);
    makeTerrain(): PerlinTerrain;
    loadConcrete(terrain: PerlinTerrain): void;
    loadConcreteRing(terrain: PerlinTerrain): void;
    loadConcreteWalls(terrain: PerlinTerrain): void;
    addGroundBuoys(terrain: PerlinTerrain): void;
    addNavpoints(terrain: PerlinTerrain): void;
    private addBuoysAt;
    private addGeometer;
    getShipVerticalInclination(): number;
    getGroundDepthAt(xPosAbs: number, zPosAbs: number, terrain: PerlinTerrain): number;
    addVisibleBoundingBox(object: THREE.Object3D, color?: THREE.ColorRepresentation): void;
    initializeAudio(): Promise<void>;
    onWindowResize(): void;
}
