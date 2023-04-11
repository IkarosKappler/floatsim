/**
 * Global interfaces.
 */

export interface HUDData {
  depth: number;
  shipRotation: Triple<number>;
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
  z: 0;
  isRendering: boolean;
  highlightHudFragments: boolean;
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
}

export interface SceneData {
  initialDepth: number;
  deepFogDepth: MinMax;
  highFogDepth: MinMax;
}

export interface Size3Immutable {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
}

export interface IHeightMap {
  widthSegments: number;
  depthSegments: number;
  minHeightValue: number;
  maxHeightValue: number;
  data: Uint8Array;
}

export interface TextureData {
  readonly imageData: ImageData;
  readonly imageDataArray: Uint8ClampedArray;
  readonly imageCanvas: HTMLCanvasElement;
}

export interface ISceneContainer {
  readonly camera: THREE.PerspectiveCamera;
  readonly clock: THREE.Clock;
}

export interface UpdateableComponent {
  update(elapsedTime: number, deltaTime: number);
}

export interface RenderableComponent {
  beforeRender(sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams): void;
  renderFragment(renderer: THREE.WebGLRenderer): void;
  updateSize(width: number, height: number): void;
}
