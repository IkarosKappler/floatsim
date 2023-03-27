import * as THREE from "three";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
import { HudComponent } from "../HudComponent";
export declare class Compass implements RenderableComponent {
    readonly hudComponent: HudComponent;
    private readonly compassMesh;
    constructor(hudComponent: HudComponent);
    /**
     * @implement RenderableComponent.befoRerender
     */
    beforeRender(_sceneContainer: ISceneContainer, _data: HUDData, tweakParams: TweakParams): void;
    /**
     * @implement RenderableComponent.renderFragment
     */
    renderFragment(_renderer: THREE.WebGLRenderer): void;
    /**
     * @implement RenderableComponent.updateSize
     */
    updateSize(): void;
}
