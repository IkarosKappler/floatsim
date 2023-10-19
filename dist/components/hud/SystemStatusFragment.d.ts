import * as THREE from "three";
import { HudComponent } from "./HudComponent";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
export declare class SystemStatusFragment implements RenderableComponent {
    private hudComponent;
    private currentFragmentBounds;
    private depthMeterTexture;
    private thermometerrTexture;
    private static ASSET_PATH;
    private static ASSET_SIZE;
    private static ASSET_RATIO;
    private static ASSET_PATH_THERMOMETER;
    private static ASSET_SIZE_THERMOMETER;
    private static ASSET_RATIO_THERMOMETER;
    constructor(hudComponent: HudComponent);
    /**
     * @implement RenderableComponent.befoRerender
     */
    beforeRender(_sceneContainer: ISceneContainer, data: HUDData, tweakParams: TweakParams): void;
    private drawIcon;
    /**
     * @implement RenderableComponent.renderFragment
     */
    renderFragment(_renderer: THREE.WebGLRenderer): void;
    /**
     * @implement RenderableComponent.updateSize
     */
    updateSize(width: number, height: number): void;
}
