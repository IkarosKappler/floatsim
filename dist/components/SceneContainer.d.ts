/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { Stats } from "../Stats";
import { CockpitPlane } from "./CockpitPlane";
import { HudComponent } from "./HudComponent";
import { SceneData } from "./interfaces";
import { FogHandler } from "./FogHandler";
import { Params } from "../utils/Params";
export declare class SceneContainer {
    readonly scene: THREE.Scene;
    readonly camera: THREE.PerspectiveCamera;
    readonly renderer: THREE.WebGLRenderer;
    readonly clock: THREE.Clock;
    readonly stats: Stats;
    readonly controls: OrbitControls | FirstPersonControls;
    readonly cockpit: CockpitPlane;
    readonly hud: HudComponent;
    readonly fogHandler: FogHandler;
    readonly sceneData: SceneData;
    cube: THREE.Mesh;
    constructor(params: Params);
    startAudio(): void;
    onWindowResize(): void;
}
