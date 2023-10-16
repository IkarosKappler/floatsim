import * as THREE from "three";
import { HudComponent } from "./HudComponent";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
export declare class NavpointsFragment implements RenderableComponent {
    private hudComponent;
    private currentFragmentBounds;
    constructor(hudComponent: HudComponent);
    private toScreenPosition;
    private drawNavpoint;
    private drawMarkerAt;
    private drawLabelAt;
    /**
     * @implement RenderableComponent.befoRerender
     */
    beforeRender(sceneContainer: ISceneContainer, _data: HUDData, tweakParams: TweakParams): void;
    /**
     * @implement RenderableComponent.renderFragment
     */
    renderFragment(_renderer: THREE.WebGLRenderer): void;
    /**
     * @implement RenderableComponent.updateSize
     */
    updateSize(width: number, height: number): void;
}
