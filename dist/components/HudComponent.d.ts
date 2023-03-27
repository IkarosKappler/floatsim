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
    private lowerInfoHud;
    constructor(width: number, height: number, primaryColor: THREE.Color);
    /**
     * @implement RenderableComponent.beforeRender
     */
    beforeRender(sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams): void;
    /**
     * @implement RenderableComponent.renderFragment
     */
    renderFragment(renderer: THREE.WebGLRenderer): void;
    /**
     * @implement RenderableComponent.updateSize
     */
    updateSize(width: number, height: number): void;
}
