import * as THREE from "three";
import { HUDData, ISceneContainer, TweakParams } from "../interfaces";
import { CockpitScene } from "./CockpitScene";
/**
 * A sonar component for the cockpit.
 * This is not a HUD component.
 *
 * @authos  Ikaros Kappler
 * @date    2023-04-14
 * @version 1.0.0
 */
export declare class SonarComponent {
    private readonly cockpitScene;
    private readonly sonarGroup;
    private readonly containingBox;
    private readonly particles;
    private readonly pointsGeometry;
    private static readonly DEFAULT_OFFSET;
    constructor(cockpitScene: CockpitScene);
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
