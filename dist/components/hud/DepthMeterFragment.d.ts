/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */
import * as THREE from "three";
import { HudComponent } from "../HudComponent";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
export declare class DepthMeterFragment implements RenderableComponent {
    private hudComponent;
    private depthMeterTexture;
    private static ASSET_PATH;
    private static ASSET_SIZE;
    private static ASSETS_LEFT_SCALE_BOUNDS;
    private static ASSETS_RIGHT_SCALE_BOUNDS;
    constructor(hudComponent: HudComponent);
    /**
     * @implement RenderableComponent.befoRerender
     */
    beforeRender(_sceneContainer: ISceneContainer, _data: HUDData, tweakParams: TweakParams): void;
    /**
     * @implement RenderableComponent.render
     */
    renderFragment(_renderer: THREE.WebGLRenderer): void;
}
