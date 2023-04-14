/**
 * A custom scene renderer for everything that happens in the cockpit.
 *
 * Replacement for cockpitPlane?
 *
 * @author  Ikaros Kappler
 * @date    2023-04-14
 * @version 1.0.0
 */

import * as THREE from "three";
import { CockpitPlane } from "./CockpitPlane";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";

export class CockpitScene implements RenderableComponent {
  // readonly mesh: THREE.Mesh;
  private readonly cockpitCamera: THREE.Camera;
  private readonly cockpitScene: THREE.Scene;

  private readonly cockpitPlane: CockpitPlane;

  constructor(width: number, height: number) {
    // Create the camera and set the viewport to match the screen dimensions.
    this.cockpitCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 1500);
    // this.cockpitCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0, 10000);
    this.cockpitCamera.position.z = 150;
    // Create also a custom scene for HUD.
    this.cockpitScene = new THREE.Scene();

    this.cockpitPlane = new CockpitPlane();
    // this.cockpitCamera.add(this.cockpitPlane.mesh);
    this.cockpitCamera.add(this.cockpitPlane.mesh);
    this.cockpitScene.add(this.cockpitCamera);
  }

  // setCockpitSize(width: number, height: number) {
  //   // this.mesh.scale.set(width / 40, height / 40, 1);
  //   this.cockpitPlane.setCockpitSize(width, height);
  // }

  /**
   * @implement RenderableComponent.beforeRender
   */
  beforeRender(sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams) {
    // Apply tweak params
    // this.compass.beforeRender(sceneContainer, hudData, tweakParams);
    // this.lowerInfoHud.beforeRender(sceneContainer, hudData, tweakParams);
    // this.depthMeter.beforeRender(sceneContainer, hudData, tweakParams);
    // this.variometer.beforeRender(sceneContainer, hudData, tweakParams);
    // this.hudDynamicTexture.needsUpdate = true;
  }

  /**
   * @implement RenderableComponent.renderFragment
   */
  renderFragment(renderer: THREE.WebGLRenderer) {
    // Render HUD on top of the scene.
    renderer.render(this.cockpitScene, this.cockpitCamera);
    // END Try a HUD
  }

  /**
   * @implement RenderableComponent.updateSize
   */
  updateSize(width: number, height: number) {
    this.cockpitPlane.setCockpitSize(width, height);
  }
}
