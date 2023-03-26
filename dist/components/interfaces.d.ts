/**
 * Global interfaces.
 */
export interface HUDData {
    depth: number;
    shipRotation: NTriple;
}
export interface NTriple {
    x: number;
    y: number;
    z: number;
}
export interface TweakParams {
    z: 0;
}
export interface MinMax {
    min: number;
    max: number;
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
export interface PerlinHeightMap {
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
}
export interface RenderableComponent {
    beforeRender(sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams): any;
}
