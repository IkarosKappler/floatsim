/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */
import * as THREE from "three";
import { HudComponent } from "../HudComponent";
import { Dimension2Immutable, HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
export declare class DepthMeterFragment implements RenderableComponent {
    private hudComponent;
    private depthMeterTexture;
    static readonly ASSET_PATH: string;
    static readonly ASSET_SIZE: Dimension2Immutable;
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
