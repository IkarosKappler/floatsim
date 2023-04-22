import * as THREE from "three";
import { HudComponent } from "./HudComponent";
import { HUDData, ISceneContainer, Navpoint, RenderableComponent, Tuple, TweakParams } from "../interfaces";
import { Bounds2Immutable, getColorStyle } from "../../utils/Helpers";

export class NavpointsFragment implements RenderableComponent {
  private hudComponent: HudComponent;
  private currentFragmentBounds: Bounds2Immutable;

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;

    this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
  }

  private drawNavpoint(sceneContainer: ISceneContainer, navpoint: Navpoint) {
    // Compute position on screen

    // TODO: reuse the vector somehow!
    const vector = new THREE.Vector3(navpoint.position.x, navpoint.position.y, navpoint.position.z);

    const distance = sceneContainer.camera.position.distanceTo(vector);

    // How to converting world coordinates to 2D mouse coordinates in ThreeJS
    // Found at
    //    https://discourse.threejs.org/t/how-to-converting-world-coordinates-to-2d-mouse-coordinates-in-threejs/2251
    vector.project(sceneContainer.camera);

    //  This only converts a vector to normalized device space. You still have to map the vector to 2D screen space. Something like:
    // TODO: fetch real renderer size here!
    vector.x = ((vector.x + 1) * sceneContainer.rendererSize.width) / 2;
    vector.y = (-(vector.y - 1) * sceneContainer.rendererSize.height) / 2;
    vector.z = 0;

    this.drawMarkerAt(vector);
    this.drawDistanceLabelAt(vector, `d:${distance.toFixed(1)}m`);
  }

  private drawMarkerAt(center: Tuple<number>) {
    this.hudComponent.hudBitmap.beginPath();
    this.hudComponent.hudBitmap.moveTo(center.x - 5, center.y - 5);
    this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y + 5);
    this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y - 5);
    this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y + 5);
    this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y - 5);
    this.hudComponent.hudBitmap.stroke();
    this.hudComponent.hudBitmap.closePath();
  }

  private drawDistanceLabelAt(center: Tuple<number>, label: string) {
    this.hudComponent.hudBitmap.beginPath();
    this.hudComponent.hudBitmap.fillText(label, center.x + 10, center.y - 8);
    // this.hudComponent.hudBitmap.fill();
    this.hudComponent.hudBitmap.closePath();
  }

  /**
   * @implement RenderableComponent.befoRerender
   */
  beforeRender(sceneContainer: ISceneContainer, _data: HUDData, tweakParams: TweakParams) {
    // console.log("[NavpointsFragment] beforeRender");

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
    this.drawMarkerAt(center);

    for (var i = 0; i < sceneContainer.navpoints.length; i++) {
      this.drawNavpoint(sceneContainer, sceneContainer.navpoints[i]);
    }

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
