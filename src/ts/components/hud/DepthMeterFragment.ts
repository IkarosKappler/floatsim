/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */

import * as THREE from "three";
import { Bounds2Immutable, getColorStyle } from "../../utils/Helpers";
import { HudComponent } from "./HudComponent";

import { IDimension2Immutable, HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";

export class DepthMeterFragment implements RenderableComponent {
  private hudComponent: HudComponent;

  private depthMeterTexture: HTMLImageElement;
  private static ASSET_PATH: string = "resources/img/depth-meter-a.png";
  private static ASSET_SIZE = new Bounds2Immutable({ x: 0, y: 0, width: 600, height: 1347 });
  private static ASSETS_LEFT_SCALE_BOUNDS = Bounds2Immutable.fromMinMax({ x: 150, y: 192 }, { x: 252, y: 1156 });
  private static ASSETS_RIGHT_SCALE_BOUNDS = Bounds2Immutable.fromMinMax({ x: 386, y: 94 }, { x: 480, y: 1248 });
  private static HUD_RATIO = DepthMeterFragment.ASSET_SIZE.width / DepthMeterFragment.ASSET_SIZE.height;

  static readonly MAX_DEPTH_METER = -12000;

  private currentHudScale: number;
  private currentHudBounds: Bounds2Immutable;
  private leftSubBounds: Bounds2Immutable;
  private rightSubBounds: Bounds2Immutable;

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;
    this.depthMeterTexture = new THREE.ImageLoader().load(DepthMeterFragment.ASSET_PATH);

    // Initialize the current bounds
    this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
  }

  private drawIndicator(mPct: number, tweakParams: TweakParams, subBounds: Bounds2Immutable, pointToLeft: boolean) {
    const triangleSize: IDimension2Immutable = {
      height: this.currentHudBounds.height / 20.0,
      width: this.currentHudBounds.height / 40.0
    };

    if (tweakParams.highlightHudFragments) {
      const colorStyleBg = getColorStyle(this.hudComponent.primaryColor, 0.25);
      this.hudComponent.hudBitmap.fillStyle = colorStyleBg;
      this.hudComponent.hudBitmap.fillRect(subBounds.min.x, subBounds.min.y, subBounds.width, subBounds.height);
    }

    // TODO: buffer color style string in class variable (is rarely changed)
    const colorStyle = getColorStyle(this.hudComponent.primaryColor, 1.0);
    this.hudComponent.hudBitmap.fillStyle = colorStyle;

    // Draw indicator (left or right)
    if (pointToLeft) {
      // Left Triangle
      var triangleBoundsLeft = new Bounds2Immutable({
        x: subBounds.max.x,
        y: subBounds.min.y + subBounds.height * mPct - triangleSize.height / 2.0,
        width: triangleSize.width,
        height: triangleSize.height
      });
      this.hudComponent.hudBitmap.moveTo(triangleBoundsLeft.max.x, triangleBoundsLeft.min.y);
      this.hudComponent.hudBitmap.lineTo(triangleBoundsLeft.max.x, triangleBoundsLeft.max.y);
      this.hudComponent.hudBitmap.lineTo(triangleBoundsLeft.min.x, triangleBoundsLeft.min.y + triangleBoundsLeft.height / 2.0);
      this.hudComponent.hudBitmap.lineTo(triangleBoundsLeft.max.x, triangleBoundsLeft.min.y);
    } else {
      // Right Triangle
      var triangleBoundsRight = new Bounds2Immutable({
        x: subBounds.min.x - triangleSize.width,
        y: subBounds.min.y + subBounds.height * mPct - triangleSize.height / 2.0,
        width: triangleSize.width,
        height: triangleSize.height
      });
      this.hudComponent.hudBitmap.moveTo(triangleBoundsRight.min.x, triangleBoundsRight.min.y);
      this.hudComponent.hudBitmap.lineTo(triangleBoundsRight.min.x, triangleBoundsRight.max.y);
      this.hudComponent.hudBitmap.lineTo(triangleBoundsRight.max.x, triangleBoundsRight.min.y + triangleBoundsRight.height / 2.0);
      this.hudComponent.hudBitmap.lineTo(triangleBoundsRight.min.x, triangleBoundsRight.min.y);
    }
  }

  /**
   * @implement RenderableComponent.befoRerender
   */
  beforeRender(_sceneContainer: ISceneContainer, data: HUDData, tweakParams: TweakParams) {
    // Calculate depth in kilometers
    const maxDepthPct = data.depth / DepthMeterFragment.MAX_DEPTH_METER;
    const subKilometerPct = Math.abs((data.depth % 1000) / 1000);

    this.hudComponent.hudBitmap.save();
    this.hudComponent.hudBitmap.beginPath();

    if (tweakParams.highlightHudFragments) {
      const colorStyleBg = getColorStyle(this.hudComponent.primaryColor, 0.25);
      this.hudComponent.hudBitmap.fillStyle = colorStyleBg;
      this.hudComponent.hudBitmap.fillRect(
        this.currentHudBounds.min.x,
        this.currentHudBounds.min.y,
        this.currentHudBounds.width,
        this.currentHudBounds.height
      );
    }

    this.drawIndicator(subKilometerPct, tweakParams, this.leftSubBounds, true);
    this.drawIndicator(maxDepthPct, tweakParams, this.rightSubBounds, false);

    this.hudComponent.hudBitmap.fill();
    this.hudComponent.hudBitmap.closePath();

    // Draw texture with primary color (source-atop)
    this.hudComponent.hudBitmap.drawImage(
      this.depthMeterTexture,
      this.currentHudBounds.min.x,
      this.currentHudBounds.min.y,
      this.currentHudBounds.width,
      this.currentHudBounds.height
    );
    this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
    this.hudComponent.hudBitmap.fillRect(
      this.currentHudBounds.min.x,
      this.currentHudBounds.min.y,
      this.currentHudBounds.width,
      this.currentHudBounds.height
    );

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
    console.log("Resized", this.hudComponent.hudCanvas.width);
    // When the viewport sizes changes then then the HUD fragment bounds
    // need to be re-calculated as well.

    // Use one third of the total viewport height for this HUD fragment.
    const desiredHudHeight = height / 3.0;
    this.currentHudScale = desiredHudHeight / DepthMeterFragment.ASSET_SIZE.height;
    this.currentHudBounds = new Bounds2Immutable({
      // Place at least 30 pixel from left border
      x: Math.max(30, this.hudComponent.hudCanvas.width / 100),
      y: (height - desiredHudHeight) / 2.0,
      width: desiredHudHeight * DepthMeterFragment.HUD_RATIO,
      height: desiredHudHeight
    });
    this.leftSubBounds = DepthMeterFragment.ASSETS_LEFT_SCALE_BOUNDS.scale(this.currentHudScale).move(this.currentHudBounds.min);
    this.rightSubBounds = DepthMeterFragment.ASSETS_RIGHT_SCALE_BOUNDS.scale(this.currentHudScale).move(
      this.currentHudBounds.min
    );
  }
}
