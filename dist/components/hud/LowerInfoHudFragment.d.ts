/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */
import * as THREE from "three";
import { HudComponent } from "../HudComponent";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
export declare class LowerInfoHudFragment implements RenderableComponent {
    private hudComponent;
    constructor(hudComponent: HudComponent);
    /**
     * @implement RenderableComponent.befoRerender
     */
    beforeRender(_sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams): void;
    /**
     * @implement RenderableComponent.renderFragment
     */
    renderFragment(_renderer: THREE.WebGLRenderer): void;
    /**
     * @implement RenderableComponent.updateSize
     */
    updateSize(width: number, height: number): void;
}
