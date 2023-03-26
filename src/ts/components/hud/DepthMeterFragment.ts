/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */

import * as THREE from "three";
import { getColorStyle } from "../../utils/Helpers";
import { TAU } from "../constants";
import { HudComponent } from "../HudComponent";

import { Dimension2Immutable, HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";

export class DepthMeterFragment implements RenderableComponent {
  private hudComponent: HudComponent;

  private depthMeterTexture: HTMLImageElement;
  static readonly ASSET_PATH: string = "img/depth-meter-a.png";
  static readonly ASSET_SIZE: Dimension2Immutable = { width: 576, height: 1357 };

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;
    this.depthMeterTexture = new THREE.ImageLoader().load(DepthMeterFragment.ASSET_PATH);
  }

  /**
   * @implement RenderableComponent.befoRerender
   */
  beforeRender(_sceneContainer: ISceneContainer, _data: HUDData, tweakParams: TweakParams) {
    this.hudComponent.hudBitmap.save();
    // The lower right hud area
    const desiredHeight = this.hudComponent.hudCanvas.height / 3.0;
    const ratio = DepthMeterFragment.ASSET_SIZE.width / DepthMeterFragment.ASSET_SIZE.height;
    var hudSize = {
      x: 30,
      y: (this.hudComponent.hudCanvas.height - desiredHeight) / 2.0,
      width: desiredHeight * ratio,
      height: desiredHeight
    };

    // TODO: buffer color style string in class variable (is rarely changed)
    const colorStyle = getColorStyle(this.hudComponent.primaryColor, 1.0);

    const mPct = 0.22;
    const kPct = 0.56;
    const mY = hudSize.y + hudSize.height * mPct;
    const kY = hudSize.y + hudSize.height * kPct;
    const mX = hudSize.x + hudSize.width / 2.0 - 10;
    const kX = hudSize.x + hudSize.width / 2.0 + 10;

    // Draw indicators
    this.hudComponent.hudBitmap.beginPath();
    this.hudComponent.hudBitmap.arc(mX, mY, 5, 0.0, TAU);
    this.hudComponent.hudBitmap.arc(kX, kY, 5, 0.0, TAU);
    this.hudComponent.hudBitmap.closePath();
    this.hudComponent.hudBitmap.fill();

    // Draw texture with primary color (source-atop)
    this.hudComponent.hudBitmap.drawImage(this.depthMeterTexture, hudSize.x, hudSize.y, hudSize.width, hudSize.height);
    this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
    this.hudComponent.hudBitmap.fillStyle = colorStyle;
    this.hudComponent.hudBitmap.fillRect(hudSize.x, hudSize.y, hudSize.width, hudSize.height);
    this.hudComponent.hudBitmap.restore();
  }

  /**
   * @implement RenderableComponent.render
   */
  renderFragment(_renderer: THREE.WebGLRenderer): void {
    // NOOP
  }
}
