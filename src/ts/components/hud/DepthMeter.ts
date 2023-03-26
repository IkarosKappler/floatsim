/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */

import * as THREE from "three";
import { getColorStyle } from "../../utils/Helpers";
import { HudComponent } from "../HudComponent";

import { Dimension2Immutable, HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";

export class DepthMeter implements RenderableComponent {
  private hudComponent: HudComponent;
  private depthMeterTexture: HTMLImageElement;

  readonly ASSET_SIZE: Dimension2Immutable = { width: 576, height: 1357 };

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;
    this.depthMeterTexture = new THREE.ImageLoader().load("img/depth-meter-a.png");
  }

  /**
   * @implement RenderableComponent.befoRerender
   */
  beforeRender(_sceneContainer: ISceneContainer, _data: HUDData, tweakParams: TweakParams) {
    this.hudComponent.hudBitmap.save();
    // The lower right hud area
    const desiredHeight = this.hudComponent.hudCanvas.height / 3.0;
    const ratio = this.ASSET_SIZE.width / this.ASSET_SIZE.height;
    var hudSize = {
      x: 30,
      y: (this.hudComponent.hudCanvas.height - desiredHeight) / 2.0,
      width: desiredHeight * ratio,
      height: desiredHeight
    };

    // TODO: buffer color style string in class variable (is rarely changed)
    const colorStyle = getColorStyle(this.hudComponent.primaryColor, 1.0);

    // // Clear only the lower HUD rect?
    // // Or clear the whole scene?
    // this.hudBitmap.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);

    // this.hudBitmap.fillRect(
    //   this.hudCanvas.width - hudSize.width,
    //   this.hudCanvas.height - hudSize.height,
    //   hudSize.width,
    //   hudSize.height
    // );

    this.hudComponent.hudBitmap.drawImage(this.depthMeterTexture, hudSize.x, hudSize.y, hudSize.width, hudSize.height);
    this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
    this.hudComponent.hudBitmap.fillStyle = colorStyle;
    this.hudComponent.hudBitmap.fillRect(hudSize.x, hudSize.y, hudSize.width, hudSize.height);

    // Draw HUD in the lower right corner
    // this.hudBitmap.fillStyle = getColorStyle(this.primaryColor, 0.75);

    // const hudText: string = `Depth: ${hudData.depth.toFixed(1)}m`;
    // this.hudBitmap.fillText(hudText, this.hudCanvas.width - hudSize.width / 2, this.hudCanvas.height - hudSize.height / 2);

    // this.hudDynamicTexture.needsUpdate = true;
    // END Try a HUD
    this.hudComponent.hudBitmap.restore();
  }

  /**
   * @implement RenderableComponent.render
   */
  renderFragment(_renderer: THREE.WebGLRenderer): void {
    // NOOP
  }
}
