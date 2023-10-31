import * as THREE from "three";
import { HudComponent } from "./HudComponent";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
export declare class SystemStatusFragment implements RenderableComponent {
    private hudComponent;
    private currentFragmentBounds;
    private static ASSET_PATHS_BATTERY_CHARGES;
    private static ASSET_PATHS_THERMOMETER_STATES;
    private batteryChargesTextures;
    private batteryErrorTexture;
    private thermometerStateTextures;
    private thermometerErrorTexture;
    private dockingIconTexture;
    private radiationTexture;
    private corrosionTexture;
    private static ASSET_PATH_BATTERY_ERROR;
    private static ASSET_SIZE_BATTERY;
    private static ASSET_RATIO;
    private static ASSET_PATH_THERMOMETER_ERROR;
    private static ASSET_PATH_DOCKING_ICON;
    private static ASSET_PATH_RADIATION;
    private static ASSET_PATH_CORROSIVE;
    constructor(hudComponent: HudComponent);
    /**
     * @implement RenderableComponent.befoRerender
     */
    beforeRender(_sceneContainer: ISceneContainer, data: HUDData, tweakParams: TweakParams): void;
    private drawBatteryIcon;
    private drawThemometerIcon;
    drawDockingIndicator(iconWidth: number, tweakParams: TweakParams): void;
    private drawRadiationIcon;
    private drawCorrosionIcon;
    private drawIcon;
    private drawText;
    /**
     * @implement RenderableComponent.renderFragment
     */
    renderFragment(_renderer: THREE.WebGLRenderer): void;
    /**
     * @implement RenderableComponent.updateSize
     */
    updateSize(width: number, height: number): void;
}
