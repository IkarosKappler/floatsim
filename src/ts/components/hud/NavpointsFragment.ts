import * as THREE from "three";
import { HudComponent } from "./HudComponent";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
import { Bounds2Immutable, getColorStyle } from "../../utils/Helpers";

export class NavpointsFragment implements RenderableComponent {
  private hudComponent: HudComponent;
  private currentFragmentBounds: Bounds2Immutable;

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;

    this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
  }

  /**
   * @implement RenderableComponent.befoRerender
   */
  beforeRender(_sceneContainer: ISceneContainer, data: HUDData, tweakParams: TweakParams) {
    // Calculate depth in kilometers

    this.hudComponent.hudBitmap.save();
    this.hudComponent.hudBitmap.beginPath();

    // TODO: buffer color style string in class variable (is rarely changed)
    const colorStyle = getColorStyle(this.hudComponent.primaryColor, 1.0);
    this.hudComponent.hudBitmap.strokeStyle = colorStyle;

    const center = this.currentFragmentBounds.getCenter();

    // Draw texture with primary color (source-atop)
    this.hudComponent.hudBitmap.moveTo(center.x - 5, center.y - 5);
    this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y + 5);
    this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y - 5);
    this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y + 5);
    this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y - 5);
    this.hudComponent.hudBitmap.closePath();
    this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
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
    console.log("[NavpointsFragment] Resized", this.hudComponent.hudCanvas.width);
    // When the viewport sizes changes then then the HUD fragment bounds
    // need to be re-calculated as well.
    this.currentFragmentBounds = new Bounds2Immutable(10, 10, width - 20, height - 20);
  }
}
