import * as THREE from "three";
import { HudComponent } from "./HudComponent";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
import { Bounds2Immutable, getColorStyle } from "../../utils/Helpers";

export class SystemStatusFragment implements RenderableComponent {
  private hudComponent: HudComponent;
  private currentFragmentBounds: Bounds2Immutable;

  private static ASSET_PATHS_BATTERY_CHARGES: string[] = [
    "resources/img/icons/battery/battery-0-0pct.png",
    "resources/img/icons/battery/battery-12-5pct.png",
    "resources/img/icons/battery/battery-25-0pct.png",
    "resources/img/icons/battery/battery-37-5pct.png",
    "resources/img/icons/battery/battery-50-0pct.png",
    "resources/img/icons/battery/battery-62-5pct.png",
    "resources/img/icons/battery/battery-75-0pct.png",
    "resources/img/icons/battery/battery-87-5pct.png",
    "resources/img/icons/battery/battery-100-0pct.png"
  ];

  private static ASSET_PATHS_THERMOMETER_STATES: string[] = [
    "resources/img/icons/thermometer/thermometer-0pct.png",
    "resources/img/icons/thermometer/thermometer-20pct.png",
    "resources/img/icons/thermometer/thermometer-40pct.png",
    "resources/img/icons/thermometer/thermometer-60pct.png",
    "resources/img/icons/thermometer/thermometer-80pct.png",
    "resources/img/icons/thermometer/thermometer-100pct.png"
  ];

  // TODO: put these two icons inside an array
  private batteryChargesTextures: HTMLImageElement[];
  private batteryErrorTexture: HTMLImageElement;
  private thermometerStateTextures: HTMLImageElement[];
  private thermometerErrorTexture: HTMLImageElement;
  private dockingIconTexture: HTMLImageElement;
  private radiationTexture: HTMLImageElement;
  private corrosionTexture: HTMLImageElement;

  private static ASSET_PATH_BATTERY_ERROR: string = "resources/img/icons/battery/battery-error.png";
  private static ASSET_SIZE_BATTERY = new Bounds2Immutable({ x: 0, y: 0, width: 620, height: 620 });
  private static ASSET_RATIO = SystemStatusFragment.ASSET_SIZE_BATTERY.width / SystemStatusFragment.ASSET_SIZE_BATTERY.height;
  private static ASSET_PATH_THERMOMETER_ERROR = "resources/img/icons/thermometer/thermometer-error.png";
  private static ASSET_PATH_DOCKING_ICON: string = "resources/img/icons/docking/docking-base.png";
  private static ASSET_PATH_RADIATION = "resources/img/icons/radiation/radiation-base.png";
  private static ASSET_PATH_CORROSIVE = "resources/img/icons/corrosive/corrosive-base.png";

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;
    const imageLoader = new THREE.ImageLoader();

    this.batteryChargesTextures = SystemStatusFragment.ASSET_PATHS_BATTERY_CHARGES.map((texturePath: string) => {
      return imageLoader.load(texturePath);
    });
    this.batteryErrorTexture = imageLoader.load(SystemStatusFragment.ASSET_PATH_BATTERY_ERROR);
    this.thermometerStateTextures = SystemStatusFragment.ASSET_PATHS_THERMOMETER_STATES.map((texturePath: string) => {
      return imageLoader.load(texturePath);
    });
    imageLoader.load(SystemStatusFragment.ASSET_PATH_THERMOMETER_ERROR, (loadedImage: HTMLImageElement) => {
      this.thermometerErrorTexture = loadedImage;
    });
    imageLoader.load(SystemStatusFragment.ASSET_PATH_DOCKING_ICON, (loadedImage: HTMLImageElement) => {
      this.dockingIconTexture = loadedImage;
    });
    imageLoader.load(SystemStatusFragment.ASSET_PATH_RADIATION, (loadedImage: HTMLImageElement) => {
      this.radiationTexture = loadedImage;
    });
    imageLoader.load(SystemStatusFragment.ASSET_PATH_CORROSIVE, (loadedImage: HTMLImageElement) => {
      this.corrosionTexture = loadedImage;
    });
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
    const iconWidth = this.currentFragmentBounds.height * SystemStatusFragment.ASSET_RATIO;

    // Draw battery texture with primary color (source-atop)
    this.drawBatteryIcon(_sceneContainer, data, iconWidth);

    // Draw temperature texture with primary color (source-atop)
    // Draw image inside fragment height, keep ratio
    this.drawThemometerIcon(_sceneContainer, data, iconWidth, tweakParams);

    if (data.isDockingPossible) {
      this.drawDockingIndicator(iconWidth, tweakParams);
    }

    this.drawRadiationIcon(_sceneContainer, data, iconWidth, tweakParams);
    this.drawCorrosionIcon(_sceneContainer, data, iconWidth, tweakParams);

    this.hudComponent.hudBitmap.restore();
  }

  private drawBatteryIcon(_sceneContainer: ISceneContainer, data: HUDData, iconWidth: number) {
    // Draw battery texture with primary color (source-atop)
    if (data.isBatteryDamaged) {
      const isBlinkingVisible = Math.round(_sceneContainer.clock.getElapsedTime() / 2.0) % 2 === 0;
      if (isBlinkingVisible) {
        this.drawIcon(this.batteryErrorTexture, iconWidth, 0, "red");
      }
    } else {
      // Show normal battery charge indicator
      // There are nine battery charge textures in steps of 12.5%
      const batteryChargeIndex = Math.max(
        0,
        Math.min(Math.round((data.batteryCharge * 1000) / 125), this.batteryChargesTextures.length - 1)
      );
      // console.log("batteryChargeIndex", batteryChargeIndex);
      this.drawIcon(this.batteryChargesTextures[batteryChargeIndex], iconWidth, 0, undefined);
    }
  }

  private drawThemometerIcon(_sceneContainer: ISceneContainer, data: HUDData, iconWidth: number, tweakParams: TweakParams) {
    // Draw temperature texture with primary color (source-atop)
    // Draw image inside fragment height, keep ratio
    if (data.isThermometerDamaged) {
      this.drawIcon(this.thermometerErrorTexture, iconWidth, iconWidth, undefined);
    } else {
      // Note: temperature is in degrees Celsius
      const thermometerStateIndex = Math.max(
        0,
        Math.min(Math.ceil(data.temperature / 20), this.thermometerStateTextures.length - 1)
      );
      // console.log("thermometerStateIndex", thermometerStateIndex);
      this.drawIcon(this.thermometerStateTextures[thermometerStateIndex], iconWidth, iconWidth, undefined);
      const degFahrenheit = data.temperature * (9 / 5) + 32.0;
      const temperatureTextDeg: string = `${data.temperature.toFixed(1)}°C`;
      const temperatureTextFahr: string = `${degFahrenheit.toFixed(1)}°F`;

      this.drawText(temperatureTextDeg, iconWidth, -tweakParams.lineHeight, "white");
      this.drawText(temperatureTextFahr, iconWidth, this.currentFragmentBounds.height + tweakParams.lineHeight, "white");
    }
    this.hudComponent.hudBitmap.restore();
  }

  drawDockingIndicator(iconWidth: number, tweakParams: TweakParams) {
    this.drawIcon(this.dockingIconTexture, iconWidth, 2 * iconWidth, undefined);
  }

  private drawRadiationIcon(_sceneContainer: ISceneContainer, data: HUDData, iconWidth: number, tweakParams: TweakParams) {
    // Draw temperature texture with primary color (source-atop)
    // Draw image inside fragment height, keep ratio
    if (data.isRadiationDanger) {
      const isBlinkingVisible = Math.round(_sceneContainer.clock.getElapsedTime() / 2.0) % 2 === 0;
      if (isBlinkingVisible) {
        this.drawIcon(this.radiationTexture, iconWidth, iconWidth * 3, undefined);
      }
    }
    this.hudComponent.hudBitmap.restore();
  }

  private drawCorrosionIcon(_sceneContainer: ISceneContainer, data: HUDData, iconWidth: number, tweakParams: TweakParams) {
    // Draw temperature texture with primary color (source-atop)
    // Draw image inside fragment height, keep ratio
    if (data.isCorrosionDanger) {
      const isBlinkingVisible = Math.round(_sceneContainer.clock.getElapsedTime() / 2.0) % 2 === 0;
      if (isBlinkingVisible) {
        this.drawIcon(this.corrosionTexture, iconWidth, iconWidth * 4, undefined);
      }
    }
    this.hudComponent.hudBitmap.restore();
  }

  private drawIcon(texture: HTMLImageElement, width: number, offsetX: number, color?: string) {
    if (texture == null || !texture.complete) {
      console.warn("[SystemStatusFragment] Cannot draw icon. It's not loaded yet.");
      return;
    }
    this.hudComponent.hudBitmap.save();
    this.hudComponent.hudBitmap.drawImage(
      texture,
      this.currentFragmentBounds.min.x + offsetX,
      this.currentFragmentBounds.min.y,
      width,
      this.currentFragmentBounds.height
    );

    // Draw icon in the desired color
    if (color) {
      this.hudComponent.hudBitmap.fillStyle = color;
      this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
      this.hudComponent.hudBitmap.fillRect(
        this.currentFragmentBounds.min.x + offsetX,
        this.currentFragmentBounds.min.y,
        width,
        this.currentFragmentBounds.height
      );
    }
    this.hudComponent.hudBitmap.restore();
  }

  private drawText(text: string, offsetX: number, yOffsetY: number, color: string) {
    this.hudComponent.hudBitmap.fillStyle = color;
    this.hudComponent.hudBitmap.fillText(
      text,
      this.currentFragmentBounds.min.x + offsetX,
      this.currentFragmentBounds.min.y + yOffsetY
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
      width / 3,
      height / 18
    );
  }
}
