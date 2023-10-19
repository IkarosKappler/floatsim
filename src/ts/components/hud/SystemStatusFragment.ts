import * as THREE from "three";
import { HudComponent } from "./HudComponent";
import { HUDData, ISceneContainer, Navpoint, RenderableComponent, Tuple, TweakParams } from "../interfaces";
import { Bounds2Immutable, getColorStyle } from "../../utils/Helpers";

export class SystemStatusFragment implements RenderableComponent {
  private hudComponent: HudComponent;
  private currentFragmentBounds: Bounds2Immutable;

  // TODO: put these two icons inside an array
  private depthMeterTexture: HTMLImageElement;
  private thermometerrTexture: HTMLImageElement;
  private static ASSET_PATH: string = "resources/img/icons/battery-error.png";
  private static ASSET_SIZE = new Bounds2Immutable({ x: 0, y: 0, width: 620, height: 620 });
  //   private static ASSETS_LEFT_SCALE_BOUNDS = Bounds2Immutable.fromMinMax({ x: 150, y: 192 }, { x: 252, y: 1156 });
  //   private static ASSETS_RIGHT_SCALE_BOUNDS = Bounds2Immutable.fromMinMax({ x: 386, y: 94 }, { x: 480, y: 1248 });
  private static ASSET_RATIO = SystemStatusFragment.ASSET_SIZE.width / SystemStatusFragment.ASSET_SIZE.height;

  private static ASSET_PATH_THERMOMETER = "resources/img/icons/thermometer-base.png";
  private static ASSET_SIZE_THERMOMETER = new Bounds2Immutable({ x: 0, y: 0, width: 189, height: 189 });
  private static ASSET_RATIO_THERMOMETER =
    SystemStatusFragment.ASSET_SIZE_THERMOMETER.width / SystemStatusFragment.ASSET_SIZE_THERMOMETER.height;

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;

    this.depthMeterTexture = new THREE.ImageLoader().load(SystemStatusFragment.ASSET_PATH);
    this.thermometerrTexture = new THREE.ImageLoader().load(SystemStatusFragment.ASSET_PATH_THERMOMETER);
    this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
  }

  /**
   * @implement RenderableComponent.befoRerender
   */
  beforeRender(_sceneContainer: ISceneContainer, data: HUDData, tweakParams: TweakParams) {
    this.hudComponent.hudBitmap.save();
    if (tweakParams.highlightHudFragments) {
      const colorStyleBg = getColorStyle(this.hudComponent.primaryColor, 0.25);
      this.hudComponent.hudBitmap.fillStyle = colorStyleBg;
      this.hudComponent.hudBitmap.fillRect(
        this.currentFragmentBounds.min.x,
        this.currentFragmentBounds.min.y,
        this.currentFragmentBounds.width,
        this.currentFragmentBounds.height
      );
    }

    // TODO: buffer color style string in class variable (is rarely changed)

    // console.log("_sceneContainer.clock.getElapsedTime()", _sceneContainer.clock.getElapsedTime());
    const isBlinkingVisible = Math.round(_sceneContainer.clock.getElapsedTime() / 2.0) % 2 === 0;

    const center = this.currentFragmentBounds.getCenter();
    this.hudComponent.hudBitmap.stroke();

    // Draw battery texture with primary color (source-atop)
    const batteryIconWidth = this.currentFragmentBounds.height * SystemStatusFragment.ASSET_RATIO;
    if (tweakParams.isBatteryDamaged && isBlinkingVisible) {
      this.drawIcon(this.depthMeterTexture, batteryIconWidth, this.currentFragmentBounds.min.y, "red");
    }

    // Draw temperature texture with primary color (source-atop)
    // Draw image inside fragment height, keep ratio
    // this.hudComponent.hudBitmap.fillStyle = "green";
    const iconWidth = this.currentFragmentBounds.height * SystemStatusFragment.ASSET_RATIO_THERMOMETER;
    const thermometerIconWidth = this.currentFragmentBounds.height * SystemStatusFragment.ASSET_RATIO_THERMOMETER;
    this.drawIcon(this.thermometerrTexture, thermometerIconWidth, this.currentFragmentBounds.min.y + batteryIconWidth, "white");
    this.hudComponent.hudBitmap.restore();
  }

  private drawIcon(texture: HTMLImageElement, width: number, offsetX: number, color: string) {
    this.hudComponent.hudBitmap.fillStyle = color;
    this.hudComponent.hudBitmap.drawImage(
      texture,
      this.currentFragmentBounds.min.x + offsetX,
      this.currentFragmentBounds.min.y,
      width,
      this.currentFragmentBounds.height
    );

    // Draw icon in the desired color
    this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
    this.hudComponent.hudBitmap.fillRect(
      this.currentFragmentBounds.min.x + offsetX,
      this.currentFragmentBounds.min.y,
      width,
      this.currentFragmentBounds.height
    );
  }

  /**
   * @implement RenderableComponent.renderFragment
   */
  renderFragment(_renderer: THREE.WebGLRenderer): void {
    // NOOP
  }

  /**
   * @implement RenderableComponent.updateSize
   */
  updateSize(width: number, height: number) {
    // TODO: use params here
    console.log("[HorizonFragment] Resized", this.hudComponent.hudCanvas.width);
    // When the viewport sizes changes then then the HUD fragment bounds
    // need to be re-calculated as well.
    // Use 10% safe area from the frame borders
    const safeAreaHPct = 0.3;
    const safeAreaVPct = 0.4;
    this.currentFragmentBounds = new Bounds2Immutable(
      // Place at least 30 pixel from left border
      Math.max(30, width / 10),
      height / 10,
      width / 5,
      height / 10
    );
  }
}
