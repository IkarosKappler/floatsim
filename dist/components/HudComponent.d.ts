import * as THREE from "three";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "./interfaces";
export declare class HudComponent implements RenderableComponent {
    private hudCanvas;
    private hudBitmap;
    private hudCamera;
    readonly hudScene: THREE.Scene;
    private hudImage;
    private hudDynamicTexture;
    private hudMaterial;
    private plane;
    private compass;
    readonly primaryColor: THREE.Color;
    constructor(width: number, height: number, primaryColor: THREE.Color);
    setHudSize(width: number, height: number): void;
    /**
     * @implement RenderableComponent
     */
    beforeRender(sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams): void;
    renderHud(renderer: THREE.WebGLRenderer): void;
}
