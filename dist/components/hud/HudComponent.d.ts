import * as THREE from "three";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
export declare class HudComponent implements RenderableComponent {
    readonly hudCanvas: HTMLCanvasElement;
    readonly hudBitmap: CanvasRenderingContext2D;
    readonly hudCamera: THREE.Camera;
    readonly hudScene: THREE.Scene;
    private hudImage;
    private hudDynamicTexture;
    private hudMaterial;
    private plane;
    private compass;
    readonly primaryColor: THREE.Color;
    readonly warningColor: THREE.Color;
    private depthMeter;
    private lowerInfoHud;
    private variometer;
    private navpoints;
    private horizon;
    private systemStatus;
    constructor(width: number, height: number, primaryColor: THREE.Color, warningColor: THREE.Color);
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
