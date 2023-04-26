import * as THREE from "three";
import { HudComponent } from "./HudComponent";
import { HUDData, ISceneContainer, Navpoint, RenderableComponent, Tuple, TweakParams } from "../interfaces";
import { Bounds2Immutable, getColorStyle } from "../../utils/Helpers";

export class HorizonFragment implements RenderableComponent {
  private hudComponent: HudComponent;
  private currentFragmentBounds: Bounds2Immutable;

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;

    this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
  }

  private drawLineWithGap(minX: number, xAFrac: number, xBFrac: number, width: number, y: number) {
    // Draw horizon
    this.hudComponent.hudBitmap.moveTo(minX, y);
    this.hudComponent.hudBitmap.lineTo(minX + width * xAFrac, y);
    this.hudComponent.hudBitmap.moveTo(minX + width * xBFrac, y);
    this.hudComponent.hudBitmap.lineTo(minX + width, y);

    // this.hudComponent.hudBitmap.closePath();
    // this.hudComponent.hudBitmap.stroke();
  }

  private drawStaticHorizon(y: number) {
    // Draw artificial horizon
    const colorHorizon = getColorStyle(this.hudComponent.primaryColor, 1.0);
    this.hudComponent.hudBitmap.strokeStyle = colorHorizon;
    this.drawLineWithGap(this.currentFragmentBounds.min.x, 0.2, 0.9, this.currentFragmentBounds.width * 0.45, y);
    this.drawLineWithGap(this.currentFragmentBounds.max.x, 0.2, 0.9, -this.currentFragmentBounds.width * 0.45, y);
  }

  private drawDynamicHorizon(minShipUpAngle: number, maxShipUpAngle: number, shipRotation: number) {
    // Draw artificial horizon

    // maxShipUpAngle: Math.PI * 0.25, // 45 degree
    // minShipUpAngle: -Math.PI * 0.25 // -45 degree

    // TODO: read these from the global scene config
    const defaultZero = Math.PI * 0.5;
    const verticalControlMin = Math.PI * 0.25; // in radians, default PI
    const verticalControlMax = Math.PI * 0.75; // in radians, default 0
    const verticalMin = Math.PI - verticalControlMin - defaultZero;
    const verticalMax = Math.PI - verticalControlMax - defaultZero;
    const anglePct = shipRotation / (verticalMax - verticalMin);
    // console.log("anglePct", anglePct, "shipRotation", shipRotation);

    const colorHorizon = getColorStyle(this.hudComponent.primaryColor, 1.0);
    this.hudComponent.hudBitmap.strokeStyle = colorHorizon;

    const y = this.currentFragmentBounds.min.y - this.currentFragmentBounds.height * (anglePct - 0.5);

    this.hudComponent.hudBitmap.moveTo(this.currentFragmentBounds.min.x + this.currentFragmentBounds.width * 0.09, y);
    this.hudComponent.hudBitmap.lineTo(
      this.currentFragmentBounds.min.x + this.currentFragmentBounds.width * 0.09 + this.currentFragmentBounds.width * 0.315,
      y
    );
    this.hudComponent.hudBitmap.moveTo(this.currentFragmentBounds.max.x - this.currentFragmentBounds.width * 0.09, y);
    this.hudComponent.hudBitmap.lineTo(
      this.currentFragmentBounds.max.x - this.currentFragmentBounds.width * 0.09 - this.currentFragmentBounds.width * 0.315,
      y
    );
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
    const colorStrokeStyle = getColorStyle(this.hudComponent.primaryColor, 1.0);
    this.hudComponent.hudBitmap.strokeStyle = colorStrokeStyle;
    const colorFillStyle = getColorStyle(this.hudComponent.primaryColor, 0.5);
    this.hudComponent.hudBitmap.fillStyle = colorFillStyle;

    const center = this.currentFragmentBounds.getCenter();
    this.drawStaticHorizon(this.currentFragmentBounds.min.y + this.currentFragmentBounds.height / 2);
    this.drawDynamicHorizon(tweakParams.minShipUpAngle, tweakParams.maxShipUpAngle, data.shipRotation.upAngle);
    this.hudComponent.hudBitmap.stroke();

    this.hudComponent.hudBitmap.restore();
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
      width * safeAreaHPct,
      height * safeAreaVPct,
      width * (1.0 - 2 * safeAreaHPct),
      height * (1.0 - 2 * safeAreaVPct)
    );
  }
}
