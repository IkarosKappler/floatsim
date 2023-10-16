import * as THREE from "three";
import { HudComponent } from "./HudComponent";
import { HUDData, ISceneContainer, NavPointType, Navpoint, RenderableComponent, Tuple, TweakParams } from "../interfaces";
import { Bounds2Immutable, getColorStyle } from "../../utils/Helpers";

export class NavpointsFragment implements RenderableComponent {
  private hudComponent: HudComponent;
  private currentFragmentBounds: Bounds2Immutable;

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;

    this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
  }

  private toScreenPosition(sceneContainer: ISceneContainer, obj: THREE.Object3D, camera: THREE.Camera) {
    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * sceneContainer.rendererSize.width;
    var heightHalf = 0.5 * sceneContainer.rendererSize.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    // vector.applyMatrix4(obj.matrixWorld);
    vector.project(camera);

    vector.x = vector.x * widthHalf + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;

    const seemsInsideView =
      vector.x >= 0 &&
      vector.x < sceneContainer.rendererSize.width &&
      vector.y >= 0 &&
      vector.y < sceneContainer.rendererSize.height;

    // var style =
    //   "translate(-50%,-50%) translate(" +
    //   (vector.x * widthHalf + widthHalf) +
    //   "px," +
    //   (-vector.y * heightHalf + heightHalf) +
    //   "px)";

    // Check if in view
    camera.updateMatrix();
    camera.updateMatrixWorld();
    var frustum = new THREE.Frustum();
    frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

    // Your 3d point to check
    var pos = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
    if (seemsInsideView && !frustum.containsPoint(pos)) {
      // Do something with the position...
      // vector.x = -1;
      // vector.y = widthHalf;
      // Reverse position and project to the border+1
      vector.x = sceneContainer.rendererSize.width - vector.x;
      vector.y = sceneContainer.rendererSize.height - vector.y;
      // Now project to edge of the screen
      // ... todo in plotboilerplate
    }

    return {
      x: vector.x,
      y: vector.y
    };
  }

  private drawNavpoint(sceneContainer: ISceneContainer, navpoint: Navpoint) {
    // Compute position on screen

    if (navpoint.isDisabled) {
      return;
    }

    // TODO: reuse the vector somehow!
    const vector = new THREE.Vector3(navpoint.position.x, navpoint.position.y, navpoint.position.z);
    const distance = sceneContainer.camera.position.distanceTo(vector);
    const difference = vector.y - sceneContainer.camera.position.y;

    // How to converting world coordinates to 2D mouse coordinates in ThreeJS
    // Found at
    //    https://discourse.threejs.org/t/how-to-converting-world-coordinates-to-2d-mouse-coordinates-in-threejs/2251
    // vector.project(sceneContainer.camera);
    // //  This only converts a vector to normalized device space. You still have to map the vector to 2D screen space. Something like:
    // // TODO: fetch real renderer size here!
    // vector.x = ((vector.x + 1) * sceneContainer.rendererSize.width) / 2;
    // vector.y = (-(vector.y - 1) * sceneContainer.rendererSize.height) / 2;
    // vector.z = 0;

    const vector2d = this.toScreenPosition(sceneContainer, navpoint.object3D, sceneContainer.camera);

    const colorMarker = getColorStyle(this.hudComponent.primaryColor, 1.0);
    if (this.currentFragmentBounds.contains(vector2d)) {
      // Navpoint is in visible area
      this.drawMarkerAt(vector2d, colorMarker, navpoint.type);
      this.drawLabelAt(vector2d.x, vector2d.y, `${navpoint.label} (${distance.toFixed(1)}m)`);
    } else {
      // const directionPoint = { x : vector.x, y : vector.y };
      // // Navpoint is out of visible scope
      // if( vector.x < this.currentFragmentBounds.min.x ) {
      //   directionPoint.x =
      // }
      const directionPoint = {
        x: Math.min(Math.max(vector2d.x, this.currentFragmentBounds.min.x), this.currentFragmentBounds.max.x),
        y: Math.min(Math.max(vector2d.y, this.currentFragmentBounds.min.y), this.currentFragmentBounds.max.y)
      };
      this.drawMarkerAt(directionPoint, "red", navpoint.type);
      this.drawLabelAt(directionPoint.x, directionPoint.y, `${navpoint.label} (${distance.toFixed(1)}m)`);
    }
    this.drawLabelAt(vector2d.x, vector2d.y + 12, ` (${difference < 0 ? "﹀" : "︿"} ${difference.toFixed(1)}m)`);
  }

  private drawMarkerAt(center: Tuple<number>, color: string, navPointType: NavPointType) {
    this.hudComponent.hudBitmap.strokeStyle = color;
    this.hudComponent.hudBitmap.beginPath();
    if (navPointType === "nav") {
      this.hudComponent.hudBitmap.moveTo(center.x + 5, center.y - 5);
      this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y - 5);
      this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y + 5);
      this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y + 5);
      this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y - 5);
    } else {
      this.hudComponent.hudBitmap.moveTo(center.x - 5, center.y - 5);
      this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y + 5);
      this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y - 5);
      this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y + 5);
      this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y - 5);
    }
    this.hudComponent.hudBitmap.stroke();
    this.hudComponent.hudBitmap.closePath();
  }

  private drawLabelAt(x: number, y: number, label: string) {
    this.hudComponent.hudBitmap.beginPath();
    this.hudComponent.hudBitmap.fillText(label, x + 10, y - 8);
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
    this.drawMarkerAt(center, colorStrokeStyle, "default");

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
    // Use 10% safe area from the frame borders
    const safeAreaPct = 0.1;
    this.currentFragmentBounds = new Bounds2Immutable(
      width * safeAreaPct,
      height * safeAreaPct,
      width * (1.0 - 2 * safeAreaPct),
      height * (1.0 - 2 * safeAreaPct)
    );
  }
}
