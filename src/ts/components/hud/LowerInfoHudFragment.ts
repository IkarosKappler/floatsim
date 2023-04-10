/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */

import * as THREE from "three";
import { Bounds2Immutable, getColorStyle } from "../../utils/Helpers";
import { HudComponent } from "../HudComponent";

import { HUDData, IDimension2, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
import { RAD2DEG } from "../constants";

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
  beforeRender(_sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams) {
    this.hudComponent.hudBitmap.save();

    // The lower right hud area
    // TODO: add x and y position here, NOT below (like in DepthMeter)
    // TODO 2: refactor to hud fragment, too
    const hudSize: IDimension2 = { width: 240, height: 80 };
    const hudBounds = new Bounds2Immutable({
      x: this.hudComponent.hudCanvas.width - hudSize.width,
      y: this.hudComponent.hudCanvas.height - hudSize.height,
      width: 240,
      height: 80
    });

    // Update HUD graphics.
    this.hudComponent.hudBitmap.font = "Normal 16px Arial";
    this.hudComponent.hudBitmap.textAlign = "center";
    // Clear only the lower HUD rect?
    // Or clear the whole scene?
    this.hudComponent.hudBitmap.clearRect(0, 0, this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
    this.hudComponent.hudBitmap.beginPath();

    if (tweakParams.highlightHudFragments) {
      // console.log("RENDER HIGHLIGHTS");
      const colorStyleBg = getColorStyle(this.hudComponent.primaryColor, 0.25);
      this.hudComponent.hudBitmap.fillStyle = colorStyleBg;
      this.hudComponent.hudBitmap.fillRect(hudBounds.min.x, hudBounds.min.y, hudBounds.width, hudBounds.height);
      // this.hudComponent.hudBitmap.fillRect(hudBounds.min.x, hudBounds.min.y, hudBounds.width, hudBounds.height);
    }

    // TODO: buffer color style string in class variable (is rarely changed)
    const colorStyle = getColorStyle(this.hudComponent.primaryColor, 0.25);
    this.hudComponent.hudBitmap.fillStyle = colorStyle;
    this.hudComponent.hudBitmap.strokeStyle = colorStyle;

    this.hudComponent.hudBitmap.rect(
      hudBounds.min.x, // this.hudComponent.hudCanvas.width - hudBounds.width,
      hudBounds.min.y, // this.hudComponent.hudCanvas.height - hudBounds.height,
      hudBounds.width,
      hudBounds.height
    );
    this.hudComponent.hudBitmap.closePath();
    this.hudComponent.hudBitmap.stroke();

    // Draw HUD in the lower right corner
    this.hudComponent.hudBitmap.fillStyle = getColorStyle(this.hudComponent.primaryColor, 0.75);

    const hudTextA: string = `Depth: ${hudData.depth.toFixed(1)}m\n`;
    this.hudComponent.hudBitmap.fillText(
      hudTextA,
      this.hudComponent.hudCanvas.width - hudBounds.width / 2,
      this.hudComponent.hudCanvas.height - hudBounds.height / 2 - 12
    );
    const hudTextB: string = `Angle(z): ${(hudData.shipRotation.z * RAD2DEG).toFixed(1)}`;
    this.hudComponent.hudBitmap.fillText(
      hudTextB,
      this.hudComponent.hudCanvas.width - hudBounds.width / 2,
      this.hudComponent.hudCanvas.height - hudBounds.height / 2 + 12
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
    // NOOP?
  }
}
