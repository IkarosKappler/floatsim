import * as THREE from "three";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "./interfaces";
import { Compass } from "./hud/Compass";
import { getColorStyle } from "../utils/Helpers";
import { DepthMeterFragment } from "./hud/DepthMeterFragment";
import { LowerInfoHudFragment } from "./hud/LowerInfoHudFragment";

export class HudComponent implements RenderableComponent {
  readonly hudCanvas: HTMLCanvasElement;
  readonly hudBitmap: CanvasRenderingContext2D;
  private hudCamera: THREE.OrthographicCamera;
  readonly hudScene: THREE.Scene;
  private hudImage: HTMLImageElement;
  private hudDynamicTexture: THREE.Texture;
  private hudMaterial: THREE.MeshBasicMaterial;
  private plane: THREE.Mesh;

  private compass: Compass;
  readonly primaryColor: THREE.Color;

  private depthMeter: DepthMeterFragment;
  private lowerInfoHud: LowerInfoHudFragment;

  constructor(width: number, height: number, primaryColor: THREE.Color) {
    this.primaryColor = primaryColor;
    // We will use 2D canvas element to render our HUD.
    this.hudCanvas = document.createElement("canvas");
    // Again, set dimensions to fit the screen.
    this.hudCanvas.width = width;
    this.hudCanvas.height = height;

    // Get 2D context and draw something supercool.
    this.hudBitmap = this.hudCanvas.getContext("2d");
    this.hudBitmap.font = "Normal 16px Arial";
    this.hudBitmap.textAlign = "center";
    this.hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
    this.hudBitmap.fillText("Initializing...", width / 2, height / 2);
    this.hudImage = new Image();
    this.hudImage.onload = function () {
      // hudBitmap.drawImage(hudImage, 69, 50);
    };

    // Create the camera and set the viewport to match the screen dimensions.
    this.hudCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 1500);
    this.hudCamera.position.z = 150;
    // Create also a custom scene for HUD.
    this.hudScene = new THREE.Scene();

    // Create texture from rendered graphics.
    this.hudDynamicTexture = new THREE.Texture(this.hudCanvas);
    this.hudDynamicTexture.needsUpdate = true;

    // Create HUD material.
    this.hudMaterial = new THREE.MeshBasicMaterial({
      map: this.hudDynamicTexture,
      transparent: true
      // opacity: 1
    });

    // Create plane to render the HUD. This plane fill the whole screen.
    var planeGeometry = new THREE.PlaneGeometry(100, 100); //width, height);
    this.plane = new THREE.Mesh(planeGeometry, this.hudMaterial);
    this.plane.scale.set(width / 100, height / 100, 1);
    this.plane.position.z = 0; // Depth in the scene
    this.hudScene.add(this.plane);

    // Create a compass
    this.compass = new Compass(this);

    // Create the depth meter
    this.depthMeter = new DepthMeterFragment(this);

    // Create the lower info hud fragment
    this.lowerInfoHud = new LowerInfoHudFragment(this);
  }

  setHudSize(width: number, height: number) {
    this.hudCanvas.width = width;
    this.hudCanvas.height = height;
    this.hudDynamicTexture = new THREE.Texture(this.hudCanvas);
    this.hudDynamicTexture.needsUpdate = true;
    this.hudMaterial.map = this.hudDynamicTexture;
    this.plane.scale.set(width / 100, height / 100, 1);
  }

  /**
   * @implement RenderableComponent
   */
  beforeRender(sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams) {
    // Apply tweak params
    this.compass.beforeRender(sceneContainer, hudData, tweakParams);

    this.prepareLowerInfoDisplay(sceneContainer, hudData, tweakParams);
    this.prepareDepthMeter(sceneContainer, hudData, tweakParams);

    this.hudDynamicTexture.needsUpdate = true;
  }

  prepareLowerInfoDisplay(sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams) {
    // The lower right hud area
    // TODO: add x and y position here, NOT below (like in DepthMeter)
    // TODO 2: refactor to hud fragment, too
    // var hudSize = { width: 240, height: 80 };

    // // Update HUD graphics.
    // this.hudBitmap.font = "Normal 16px Arial";
    // this.hudBitmap.textAlign = "center";

    // // TODO: buffer color style string in class variable (is rarely changed)
    // const colorStyle = getColorStyle(this.primaryColor, 0.25);

    // // Clear only the lower HUD rect?
    // // Or clear the whole scene?
    // this.hudBitmap.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);

    // this.hudBitmap.fillStyle = colorStyle;
    // this.hudBitmap.fillRect(
    //   this.hudCanvas.width - hudSize.width,
    //   this.hudCanvas.height - hudSize.height,
    //   hudSize.width,
    //   hudSize.height
    // );

    // // Draw HUD in the lower right corner
    // this.hudBitmap.fillStyle = getColorStyle(this.primaryColor, 0.75);

    // const hudText: string = `Depth: ${hudData.depth.toFixed(1)}m`;
    // this.hudBitmap.fillText(hudText, this.hudCanvas.width - hudSize.width / 2, this.hudCanvas.height - hudSize.height / 2);
    this.lowerInfoHud.beforeRender(sceneContainer, hudData, tweakParams);
    // this.hudDynamicTexture.needsUpdate = true;
    // END Try a HUD
  }

  prepareDepthMeter(sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams) {
    this.depthMeter.beforeRender(sceneContainer, hudData, tweakParams);
  }

  renderFragment(renderer: THREE.WebGLRenderer) {
    // Render HUD on top of the scene.
    renderer.render(this.hudScene, this.hudCamera);
    // END Try a HUD
  }
}
