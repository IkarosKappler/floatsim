import * as THREE from "three";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "./interfaces";
export declare class HudComponent implements RenderableComponent {
    readonly hudCanvas: HTMLCanvasElement;
    readonly hudBitmap: CanvasRenderingContext2D;
    private hudCamera;
    readonly hudScene: THREE.Scene;
    private hudImage;
    private hudDynamicTexture;
    private hudMaterial;
    private plane;
    private compass;
    readonly primaryColor: THREE.Color;
    private depthMeter;
    constructor(width: number, height: number, primaryColor: THREE.Color);
    setHudSize(width: number, height: number): void;
    /**
     * @implement RenderableComponent
     */
    beforeRender(sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams): void;
    prepareLowerInfoDisplay(_sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams): void;
    prepareDepthMeter(sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams): void;
    renderFragment(renderer: THREE.WebGLRenderer): void;
}
