/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { CockpitPlane } from "./CockpitPlane";
export declare class SceneContainer {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls | FirstPersonControls;
    cockpit: CockpitPlane;
    constructor();
    onWindowResize(): void;
}
