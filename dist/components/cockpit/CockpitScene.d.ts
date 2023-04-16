/**
 * A custom scene renderer for everything that happens in the cockpit.
 *
 * Replacement for cockpitPlane?
 *
 * @author  Ikaros Kappler
 * @date    2023-04-14
 * @version 1.0.0
 */
import * as THREE from "three";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
export declare class CockpitScene implements RenderableComponent {
    readonly sceneContainer: ISceneContainer;
    readonly cockpitScene: THREE.Scene;
    private readonly cockpitCamera;
    private readonly cockpitPlane;
    private readonly sonarComponent;
    constructor(sceneContainer: ISceneContainer, width: number, height: number);
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
