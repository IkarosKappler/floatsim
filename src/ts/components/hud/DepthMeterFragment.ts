/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */

import * as THREE from "three";
import { Bounds2Immutable, getColorStyle } from "../../utils/Helpers";
import { TAU } from "../constants";
import { HudComponent } from "../HudComponent";

import {
  IDimension2Immutable,
  HUDData,
  IBounds2Immutable,
  ISceneContainer,
  RenderableComponent,
  TweakParams
} from "../interfaces";

export class DepthMeterFragment implements RenderableComponent {
  private hudComponent: HudComponent;

  private depthMeterTexture: HTMLImageElement;
  private static ASSET_PATH: string = "img/depth-meter-a.png";
  // static readonly ASSET_SIZE: IDimension2Immutable = { width: 600, height: 1347 };
  private static ASSET_SIZE = new Bounds2Immutable({ x: 0, y: 0, width: 600, height: 1347 });
  private static ASSETS_LEFT_SCALE_BOUNDS = Bounds2Immutable.fromMinMax({ x: 120, y: 192 }, { x: 222, y: 1156 });
  private static ASSETS_RIGHT_SCALE_BOUNDS = Bounds2Immutable.fromMinMax({ x: 356, y: 94 }, { x: 450, y: 1248 });

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;
    this.depthMeterTexture = new THREE.ImageLoader().load(DepthMeterFragment.ASSET_PATH);
  }

  /**
   * @implement RenderableComponent.befoRerender
   */
  beforeRender(_sceneContainer: ISceneContainer, _data: HUDData, tweakParams: TweakParams) {
    // This is rather an instance attriute
    const hudRatio = DepthMeterFragment.ASSET_SIZE.width / DepthMeterFragment.ASSET_SIZE.height;

    // Testing: move indicators over time
    const time = _sceneContainer.clock.getElapsedTime();
    const mPct = ((0.22 + time) % 10.0) / 10;
    const kPct = ((0.22 + time) % 10.0) / 10;

    this.hudComponent.hudBitmap.save();
    // The lower right hud area
    const desiredHudHeight = this.hudComponent.hudCanvas.height / 3.0;
    const curHudScale = desiredHudHeight / DepthMeterFragment.ASSET_SIZE.height;
    // console.log("currentHudScale", curHudScale);
    var curHudBounds = new Bounds2Immutable({
      x: 30,
      y: (this.hudComponent.hudCanvas.height - desiredHudHeight) / 2.0,
      width: desiredHudHeight * hudRatio,
      height: desiredHudHeight
    });
    const triangleSize: IDimension2Immutable = {
      height: curHudBounds.height / 20.0,
      width: curHudBounds.height / 40.0
    };
    const leftSubBounds = DepthMeterFragment.ASSETS_LEFT_SCALE_BOUNDS.scale(curHudScale).move(curHudBounds.min);
    const rightSubBounds = DepthMeterFragment.ASSETS_RIGHT_SCALE_BOUNDS.scale(curHudScale).move(curHudBounds.min);
    // TODO: store this
    var triangleBoundsLeft = new Bounds2Immutable({
      x: leftSubBounds.max.x,
      y: leftSubBounds.min.y + leftSubBounds.height * kPct - triangleSize.height / 2.0,
      width: triangleSize.width,
      height: triangleSize.height
    });
    var triangleBoundsRight = new Bounds2Immutable({
      x: rightSubBounds.min.x - triangleSize.width,
      y: rightSubBounds.min.y + rightSubBounds.height * mPct - triangleSize.height / 2.0,
      width: triangleSize.width,
      height: triangleSize.height
    });

    if (tweakParams.highlightHudFragments) {
      const colorStyleBg = getColorStyle(this.hudComponent.primaryColor, 0.25);
      this.hudComponent.hudBitmap.fillStyle = colorStyleBg;
      this.hudComponent.hudBitmap.fillRect(curHudBounds.min.x, curHudBounds.min.y, curHudBounds.width, curHudBounds.height);
      this.hudComponent.hudBitmap.fillRect(leftSubBounds.min.x, leftSubBounds.min.y, leftSubBounds.width, leftSubBounds.height);
    }

    // TODO: buffer color style string in class variable (is rarely changed)
    const colorStyle = getColorStyle(this.hudComponent.primaryColor, 1.0);
    this.hudComponent.hudBitmap.fillStyle = colorStyle;

    // Draw indicators
    this.hudComponent.hudBitmap.beginPath();
    this.hudComponent.hudBitmap.moveTo(triangleBoundsLeft.max.x, triangleBoundsLeft.min.y);

    // Left Triangle
    this.hudComponent.hudBitmap.moveTo(triangleBoundsLeft.max.x, triangleBoundsLeft.min.y);
    this.hudComponent.hudBitmap.lineTo(triangleBoundsLeft.max.x, triangleBoundsLeft.max.y);
    this.hudComponent.hudBitmap.lineTo(triangleBoundsLeft.min.x, triangleBoundsLeft.min.y + triangleBoundsLeft.height / 2.0);
    this.hudComponent.hudBitmap.lineTo(triangleBoundsLeft.max.x, triangleBoundsLeft.min.y);

    // Right Triangle
    this.hudComponent.hudBitmap.moveTo(triangleBoundsRight.min.x, triangleBoundsRight.min.y);
    this.hudComponent.hudBitmap.lineTo(triangleBoundsRight.min.x, triangleBoundsRight.max.y);
    this.hudComponent.hudBitmap.lineTo(triangleBoundsRight.max.x, triangleBoundsRight.min.y + triangleBoundsRight.height / 2.0);
    this.hudComponent.hudBitmap.lineTo(triangleBoundsRight.min.x, triangleBoundsRight.min.y);

    // this.hudComponent.hudBitmap.moveTo(rightX, rightY);
    // this.hudComponent.hudBitmap.arc(rightX, rightY, 5, 0.0, TAU);
    this.hudComponent.hudBitmap.fill();
    this.hudComponent.hudBitmap.closePath();

    // Draw texture with primary color (source-atop)
    this.hudComponent.hudBitmap.drawImage(
      this.depthMeterTexture,
      curHudBounds.min.x,
      curHudBounds.min.y,
      curHudBounds.width,
      curHudBounds.height
    );
    this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
    this.hudComponent.hudBitmap.fillRect(curHudBounds.min.x, curHudBounds.min.y, curHudBounds.width, curHudBounds.height);
    this.hudComponent.hudBitmap.restore();
  }

  /**
   * @implement RenderableComponent.render
   */
  renderFragment(_renderer: THREE.WebGLRenderer): void {
    // NOOP
  }
}
