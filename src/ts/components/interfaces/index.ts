/**
 * Global interfaces.
 */

import type preact from "preact";
import type axios from "axios";
import { PerlinTerrain } from "../environment/PerlinTerrain";
import { SceneContainer } from "../SceneContainer";

export interface DirectionalRotation {
  upAngle: number;
}

export interface HUDData {
  depth: number;
  groundDepth: number;
  shipRotation: DirectionalRotation; // Triple<number>;
  pressure: number;
  temperature: number;
}

export interface Tuple<T> {
  x: T;
  y: T;
}

export interface TupleImmutable<T> {
  readonly x: T;
  readonly y: T;
}

export interface TripleImmutable<T> {
  readonly x: T;
  readonly y: T;
  readonly z: T;
}

export interface Triple<T> {
  x: T;
  y: T;
  z: T;
}

export interface TweakParams {
  compassX: number; // currently not visible
  compassY: number; // currently not visible
  compassZ: number;
  sonarX: number; // currently not visible
  sonarY: number; // currently not visible
  sonarZ: number;
  isRendering: boolean;
  highlightHudFragments: boolean;
  // Must be in [0.0..1.0]
  cutsceneShutterValue: number;
  lineHeight: number;
  fontSize: number;
  maxShipUpAngle: number;
  minShipUpAngle: number;
  cameraFov: number;
  fogDensity: number;
  isBatteryDamaged: boolean;
}

export interface IDimension2 {
  width: number;
  height: number;
}

export interface IDimension2Immutable {
  readonly width: number;
  readonly height: number;
}

export interface MinMax {
  min: number;
  max: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IBounds2Immutable {
  readonly min: TupleImmutable<number>;
  readonly max: TupleImmutable<number>;
  readonly width: number;
  readonly height: number;
  contains(point: Tuple<number>): boolean;
}

export interface SceneData {
  initialDepth: number;
  deepFogDepth: MinMax;
  highFogDepth: MinMax;
}

export interface Size2Immutable {
  readonly width: number;
  readonly height: number;
}

export interface Size3Immutable {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
}

export interface IHeightMap {
  readonly widthSegments: number;
  readonly depthSegments: number;
  readonly minHeightValue: number;
  readonly maxHeightValue: number;
  readonly computationalMin: number;
  readonly computationalMax: number;
  data: Float32Array;
  /**
   * Convert a position on the heightmap's x-y-grid to an offset inside the
   * underlying data array.
   *
   * @param {number} x - The x position in 0 <= x < widthSegments.
   * @param {number} z - The z position in 0 <= z < depthSegments.
   * @returns {number} The array offset (index) of the grid value in the data array.
   */
  getOffset(x: number, z: number): number;
}

export interface TextureData {
  readonly imageData: ImageData;
  readonly imageDataArray: Uint8ClampedArray;
  readonly imageCanvas: HTMLCanvasElement;
}

export type NavPointType = "default" | "nav";

export interface Navpoint {
  position: Triple<number>;
  label: string;
  detectionDistance: number;
  isDisabled: boolean;
  type: NavPointType;
  userData: { isCurrentlyInRange: boolean };
  object3D: THREE.Object3D; // Required to properly render the 2D position
}

export interface ISceneContainer {
  readonly rendererSize: Size2Immutable;
  readonly camera: THREE.PerspectiveCamera;
  readonly clock: THREE.Clock;
  readonly collidableMeshes: Array<THREE.Object3D>;
  readonly terrainSegments: Array<PerlinTerrain>;
  readonly navpoints: Array<Navpoint>;
}

export interface UpdateableComponent {
  update(elapsedTime: number, deltaTime: number);
}

export interface RenderableComponent {
  beforeRender(sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams): void;
  renderFragment(renderer: THREE.WebGLRenderer): void;
  updateSize(width: number, height: number): void;
}

export interface NavigationEventListener {
  onNavpointEntered: (navpoint: Navpoint) => void;
  onNavpointExited: (navpoint: Navpoint) => void;
}

export type GameRunningListener = (isRunning: boolean, isPaused: boolean) => void;

export type GameReadyListener = () => void;

export interface IGlobalLibs {
  axios: typeof axios;
  preact: typeof preact;
}
