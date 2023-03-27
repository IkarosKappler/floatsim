/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */

import * as THREE from "three";
import { getColorStyle } from "../../utils/Helpers";
import { HudComponent } from "../HudComponent";

import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";

export class LowerInfoHudFragment implements RenderableComponent {
  private hudComponent: HudComponent;
  //   private depthMeterTexture: HTMLImageElement;

  //   readonly ASSET_SIZE: Dimension2Immutable = { width: 576, height: 1357 };

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;
    // this.depthMeterTexture = new THREE.ImageLoader().load("img/depth-meter-a.png");
  }

  /**
   * @implement RenderableComponent.befoRerender
   */
  beforeRender(_sceneContainer: ISceneContainer, hudData: HUDData, _tweakParams: TweakParams) {
    this.hudComponent.hudBitmap.save();

    // The lower right hud area
    // TODO: add x and y position here, NOT below (like in DepthMeter)
    // TODO 2: refactor to hud fragment, too
    var hudSize = { width: 240, height: 80 };

    // Update HUD graphics.
    this.hudComponent.hudBitmap.font = "Normal 16px Arial";
    this.hudComponent.hudBitmap.textAlign = "center";

    // TODO: buffer color style string in class variable (is rarely changed)
    const colorStyle = getColorStyle(this.hudComponent.primaryColor, 0.25);

    // Clear only the lower HUD rect?
    // Or clear the whole scene?
    this.hudComponent.hudBitmap.clearRect(0, 0, this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);

    this.hudComponent.hudBitmap.fillStyle = colorStyle;
    this.hudComponent.hudBitmap.strokeStyle = colorStyle;

    this.hudComponent.hudBitmap.beginPath();
    this.hudComponent.hudBitmap.rect(
      this.hudComponent.hudCanvas.width - hudSize.width,
      this.hudComponent.hudCanvas.height - hudSize.height,
      hudSize.width,
      hudSize.height
    );
    this.hudComponent.hudBitmap.closePath();
    this.hudComponent.hudBitmap.stroke();

    // Draw HUD in the lower right corner
    this.hudComponent.hudBitmap.fillStyle = getColorStyle(this.hudComponent.primaryColor, 0.75);

    const hudText: string = `Depth: ${hudData.depth.toFixed(1)}m`;
    this.hudComponent.hudBitmap.fillText(
      hudText,
      this.hudComponent.hudCanvas.width - hudSize.width / 2,
      this.hudComponent.hudCanvas.height - hudSize.height / 2
    );

    this.hudComponent.hudBitmap.restore();
  }

  /**
   * @implement RenderableComponent.render
   */
  renderFragment(_renderer: THREE.WebGLRenderer): void {
    // NOOP
  }
}
