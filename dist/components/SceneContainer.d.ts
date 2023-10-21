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
import { HUDData, ISceneContainer, Navpoint, SceneData, Size2Immutable, TweakParams } from "./interfaces";
import { FogHandler } from "./environment/FogHandler";
import { Params } from "../utils/Params";
import { CockpitScene } from "./cockpit/CockpitScene";
import { GameLogicManager } from "../gamelogic/GameLogicManager";
import { MessageBox } from "../dom/MessageBox";
import { GameListeners } from "../utils/GameListeners";
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
    readonly hudData: HUDData;
    readonly camera: THREE.PerspectiveCamera;
    readonly clock: THREE.Clock;
    readonly collidableMeshes: Array<THREE.Object3D>;
    readonly terrainSegments: Array<PerlinTerrain>;
    readonly navpoints: Array<Navpoint>;
    readonly gameLogicManager: GameLogicManager;
    readonly messageBox: MessageBox;
    private audioPlayer;
    readonly gameListeners: GameListeners;
    private isGameRunning;
    private isGamePaused;
    private initializationPromise;
    cube: THREE.Mesh;
    constructor(params: Params);
    initializGame(): Promise<void>;
    startGame(): void;
    private startShutterSequence;
    togglePause(): void;
    setChapterEnded(): void;
    initializDockingSequence(): void;
    makeTerrain(): PerlinTerrain;
    loadConcrete(terrain: PerlinTerrain): void;
    loadConcreteRing(terrain: PerlinTerrain): void;
    loadConcreteWalls(terrain: PerlinTerrain): void;
    loadFBXStruff(terrain: PerlinTerrain): void;
    addGroundBuoys(terrain: PerlinTerrain): void;
    addNavpoints(terrain: PerlinTerrain): Promise<void>;
    addNavpoint(navpoint: Navpoint, addToRoute?: boolean): void;
    private addBuoysAt;
    addBuoyAt(targetPosition: THREE.Vector3): Promise<THREE.Object3D>;
    private addGeometer;
    getShipVerticalInclination(): number;
    getGroundDepthAt(xPosAbs: number, zPosAbs: number, terrain: PerlinTerrain): number;
    addVisibleBoundingBox(object: THREE.Object3D, color?: THREE.ColorRepresentation): void;
    initializeAudio(): Promise<void>;
    onWindowResize(): void;
}
