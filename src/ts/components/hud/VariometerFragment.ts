/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */

import * as THREE from "three";
import { Bounds2Immutable, getColorStyle } from "../../utils/Helpers";
import { HudComponent } from "./HudComponent";

import { IDimension2Immutable, HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";

export class VariometerFragment implements RenderableComponent {
  private hudComponent: HudComponent;
  private loopCounter: number = 0;
  private currentHudBounds: Bounds2Immutable;

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;

    // Initialize the current bounds
    this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
  }

  /**
   * @implement RenderableComponent.befoRerender
   */
  beforeRender(_sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams) {
    // Calculate the current view angle
    const angle = hudData.shipRotation.upAngle;

    // Define the upper and the lower bounds for the displayed value
    const MAX_ANGLE = Math.PI / 2.0;
    const MIN_ANGLE = -Math.PI / 2.0;

    // Determine the percentage of the current value in the valid range
    const anglePct = (angle / (MAX_ANGLE - MIN_ANGLE)) * 2.0;

    // Calculate the (relative) vertical offset to draw the value at inside the HUD fragment
    const zeroOffsetV = this.currentHudBounds.height * (0.5 + anglePct);

    // TODO: as global?
    const triangleSize: IDimension2Immutable = {
      height: this.currentHudBounds.height / 20.0,
      width: this.currentHudBounds.height / 40.0
    };

    // if (this.loopCounter++ < 20) {
    //   console.log("angle", angle * RAD2DEG, "anglePct", anglePct, "zeroOffsetV", zeroOffsetV);
    // }

    this.hudComponent.hudBitmap.save();

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

    // TODO: buffer color style string in class variable (is rarely changed)

    // Apply a clipping rect!
    this.hudComponent.hudBitmap.rect(
      this.currentHudBounds.min.x,
      this.currentHudBounds.min.y,
      this.currentHudBounds.width,
      this.currentHudBounds.height
    );
    this.hudComponent.hudBitmap.clip();

    const colorStyle = getColorStyle(this.hudComponent.primaryColor, 1.0);
    this.hudComponent.hudBitmap.strokeStyle = colorStyle;
    this.hudComponent.hudBitmap.beginPath();
    this.drawScale(triangleSize);
    this.hudComponent.hudBitmap.stroke();
    this.hudComponent.hudBitmap.closePath();

    // Draw Zero
    if (zeroOffsetV < 0) {
      this.drawZeroAt(0, triangleSize);
    } else if (zeroOffsetV >= this.currentHudBounds.height) {
      this.drawZeroAt(this.currentHudBounds.max.y, triangleSize);
    } else {
      this.drawZeroAt(zeroOffsetV, triangleSize);
    }

    // Draw upper
    const stepValue = 15.0;
    var mainStep = this.currentHudBounds.height / 6;
    this.hudComponent.hudBitmap.strokeStyle = colorStyle;
    this.hudComponent.hudBitmap.fillStyle = colorStyle;
    this.drawRulerSteps(-mainStep, stepValue, zeroOffsetV, triangleSize, tweakParams.lineHeight);
    const colorWarningStyle = getColorStyle(this.hudComponent.warningColor, 1.0);
    this.hudComponent.hudBitmap.strokeStyle = colorWarningStyle;
    this.hudComponent.hudBitmap.fillStyle = colorWarningStyle;
    this.drawRulerSteps(mainStep, -stepValue, zeroOffsetV, triangleSize, tweakParams.lineHeight);
    this.hudComponent.hudBitmap.stroke();
    this.hudComponent.hudBitmap.closePath();

    this.hudComponent.hudBitmap.stroke();
    this.hudComponent.hudBitmap.closePath();

    this.hudComponent.hudBitmap.restore();
  }

  private drawRulerSteps(
    mainStepPixels: number,
    stepValue: number,
    zeroOffsetV: number,
    triangleSize: IDimension2Immutable,
    lineHeight: number
  ) {
    // var mainStep = this.currentHudBounds.height / 8.0;
    this.hudComponent.hudBitmap.beginPath();
    var offsetV = zeroOffsetV;
    while (offsetV >= 0 && offsetV < this.currentHudBounds.height) {
      offsetV += mainStepPixels;
      this.hudComponent.hudBitmap.moveTo(
        this.currentHudBounds.min.x + triangleSize.width + 1,
        this.currentHudBounds.min.y + offsetV
      );
      this.hudComponent.hudBitmap.lineTo(
        this.currentHudBounds.min.x + triangleSize.width + 1 + 16,
        this.currentHudBounds.min.y + offsetV
      );
      // second step (A)
      this.hudComponent.hudBitmap.moveTo(
        this.currentHudBounds.min.x + triangleSize.width + 1,
        this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.3333
      );
      this.hudComponent.hudBitmap.lineTo(
        this.currentHudBounds.min.x + triangleSize.width + 1 + 16,
        this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.3333
      );
      // second step (B)
      this.hudComponent.hudBitmap.moveTo(
        this.currentHudBounds.min.x + triangleSize.width + 1,
        this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.6666
      );
      this.hudComponent.hudBitmap.lineTo(
        this.currentHudBounds.min.x + triangleSize.width + 1 + 16,
        this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.6666
      );
      // Third step (first)
      this.hudComponent.hudBitmap.moveTo(
        this.currentHudBounds.min.x + triangleSize.width + 1,
        this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.1667
      );
      this.hudComponent.hudBitmap.lineTo(
        this.currentHudBounds.min.x + triangleSize.width + 1 + 8,
        this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.1667
      );
      // Third step (second)
      this.hudComponent.hudBitmap.moveTo(
        this.currentHudBounds.min.x + triangleSize.width + 1,
        this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.5
      );
      this.hudComponent.hudBitmap.lineTo(
        this.currentHudBounds.min.x + triangleSize.width + 1 + 8,
        this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.5
      );
      // Third step (third)
      this.hudComponent.hudBitmap.moveTo(
        this.currentHudBounds.min.x + triangleSize.width + 1,
        this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.6667
      );
      this.hudComponent.hudBitmap.lineTo(
        this.currentHudBounds.min.x + triangleSize.width + 1 + 8,
        this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.6667
      );
      // Third step (fourth)
      this.hudComponent.hudBitmap.moveTo(
        this.currentHudBounds.min.x + triangleSize.width + 1,
        this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.8333
      );
      this.hudComponent.hudBitmap.lineTo(
        this.currentHudBounds.min.x + triangleSize.width + 1 + 8,
        this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.8333
      );
    } // END while
    this.hudComponent.hudBitmap.closePath();
    this.hudComponent.hudBitmap.stroke();

    var i = 0;
    offsetV = zeroOffsetV;
    while (offsetV >= 0 && offsetV < this.currentHudBounds.height) {
      offsetV += mainStepPixels;
      i++;
      this.hudComponent.hudBitmap.fillText(
        `${i * stepValue}°`,
        this.currentHudBounds.min.x + triangleSize.width + 1 + 16,
        this.currentHudBounds.min.y + offsetV + lineHeight / 2
      );
    }
  }

  private drawZeroAt(zeroOffsetV: number, triangleSize: IDimension2Immutable) {
    // const colorStyle = getColorStyle(this.hudComponent.primaryColor, 1.0);
    const colorStyle = "rgb(255,255,255)";
    this.hudComponent.hudBitmap.strokeStyle = colorStyle;
    this.hudComponent.hudBitmap.beginPath();
    this.hudComponent.hudBitmap.moveTo(
      this.currentHudBounds.min.x + triangleSize.width + 1,
      this.currentHudBounds.min.y + zeroOffsetV
    );
    this.hudComponent.hudBitmap.lineTo(
      this.currentHudBounds.min.x + triangleSize.width + 1 + 22,
      this.currentHudBounds.min.y + zeroOffsetV
    );
    this.hudComponent.hudBitmap.stroke();
    this.hudComponent.hudBitmap.closePath();

    // const colorStyleSecondary = getColorStyle(this.hudComponent.warningColor, 1.0);
    // this.hudComponent.hudBitmap.strokeStyle = colorStyleSecondary;
    this.hudComponent.hudBitmap.beginPath();
    // Diagonal
    this.hudComponent.hudBitmap.moveTo(
      this.currentHudBounds.min.x + triangleSize.width + 1 + 16,
      this.currentHudBounds.min.y + zeroOffsetV - 6
    );
    this.hudComponent.hudBitmap.lineTo(
      this.currentHudBounds.min.x + triangleSize.width + 1 + 16 + 12,
      this.currentHudBounds.min.y + zeroOffsetV + 6
    );
    // Diagonal
    this.hudComponent.hudBitmap.moveTo(
      this.currentHudBounds.min.x + triangleSize.width + 1 + 16 + 12,
      this.currentHudBounds.min.y + zeroOffsetV - 6
    );
    this.hudComponent.hudBitmap.lineTo(
      this.currentHudBounds.min.x + triangleSize.width + 1 + 16,
      this.currentHudBounds.min.y + zeroOffsetV + 6
    );
    this.hudComponent.hudBitmap.stroke();
    this.hudComponent.hudBitmap.closePath();
  }

  private drawScale(triangleSize: IDimension2Immutable) {
    // Draw vertical left line
    this.hudComponent.hudBitmap.moveTo(this.currentHudBounds.min.x + triangleSize.width + 1, this.currentHudBounds.min.y);
    this.hudComponent.hudBitmap.lineTo(this.currentHudBounds.min.x + triangleSize.width + 1, this.currentHudBounds.max.y);

    // Draw center indicator
    this.hudComponent.hudBitmap.moveTo(
      this.currentHudBounds.min.x + triangleSize.width,
      this.currentHudBounds.min.y + this.currentHudBounds.height / 2.0
    );
    this.hudComponent.hudBitmap.lineTo(
      this.currentHudBounds.min.x,
      this.currentHudBounds.min.y + this.currentHudBounds.height / 2.0 + triangleSize.height / 2
    );
    this.hudComponent.hudBitmap.lineTo(
      this.currentHudBounds.min.x,
      this.currentHudBounds.min.y + this.currentHudBounds.height / 2.0 - triangleSize.height / 2
    );
    this.hudComponent.hudBitmap.lineTo(
      this.currentHudBounds.min.x + triangleSize.width,
      this.currentHudBounds.min.y + this.currentHudBounds.height / 2.0
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
  updateSize(viewportWidth: number, viewportHeight: number) {
    console.log("[VariometerFragment] Resized", viewportWidth);
    // When the viewport sizes changes then then the HUD fragment bounds
    // need to be re-calculated as well.

    // Use one third of the total viewport height for this HUD fragment.
    const hudHeight = viewportHeight / 3.0;
    const hudWidth = hudHeight / 4.0;

    this.currentHudBounds = new Bounds2Immutable({
      // Place at least 30 pixel from right border
      x: Math.min(viewportWidth - hudWidth - 30, viewportWidth - hudWidth - viewportWidth / 100),
      y: (viewportHeight - hudHeight) / 2.0,
      width: hudWidth,
      height: hudHeight
    });
  }
}
