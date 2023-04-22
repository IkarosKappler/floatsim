import * as THREE from "three";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "./interfaces";
import { CompassComponent } from "./hud/CompassComponent";
import { DepthMeterFragment } from "./hud/DepthMeterFragment";
import { LowerInfoHudFragment } from "./hud/LowerInfoHudFragment";
import { VariometerFragment } from "./hud/VariometerFragment";
// import { SonarComponent } from "./cockpit/SonarComponent";

import { Cutscene_Shader } from "../utils/texture/shaders/cutscene_shader_material.glsl";

export class HudComponent implements RenderableComponent {
  readonly hudCanvas: HTMLCanvasElement;
  readonly hudBitmap: CanvasRenderingContext2D;
  private hudCamera: THREE.Camera; // THREE.OrthographicCamera;
  readonly hudScene: THREE.Scene;
  private hudImage: HTMLImageElement;
  private hudDynamicTexture: THREE.Texture;
  private hudMaterial: THREE.ShaderMaterial; //  | THREE.MeshBasicMaterial;
  private plane: THREE.Mesh;

  private compass: CompassComponent;
  // private sonar: SonarComponent;

  // TODO: convert to color palette with objects
  readonly primaryColor: THREE.Color;
  readonly warningColor: THREE.Color;

  private depthMeter: DepthMeterFragment;
  private lowerInfoHud: LowerInfoHudFragment;
  private variometer: VariometerFragment;

  constructor(width: number, height: number, primaryColor: THREE.Color, warningColor: THREE.Color) {
    console.log("HudComponent vertex shader", Cutscene_Shader.vertex);
    console.log("HudComponent fragment shader", Cutscene_Shader.fragment);
    this.primaryColor = primaryColor;
    this.warningColor = warningColor;
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
    // this.hudCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, -50, 10000);
    this.hudCamera.position.z = 0; // 150;
    // Create also a custom scene for HUD.
    this.hudScene = new THREE.Scene();

    // Create texture from rendered graphics.
    this.hudDynamicTexture = new THREE.Texture(this.hudCanvas);
    this.hudDynamicTexture.needsUpdate = true;

    var uniforms = {
      u_shutter_color: { type: "t", value: new THREE.Color(0x001828) },
      u_canvas_width: { type: "i", value: width },
      u_canvas_height: { type: "i", value: height },
      u_use_texture: { type: "b", value: false },
      u_direction_h_ltr: { type: "b", value: true },
      u_direction_v_ttb: { type: "b", value: true },
      u_shutter_amount: { type: "f", value: 0.5 },
      u_texture: { type: "t", value: this.hudDynamicTexture }
    };
    this.hudMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: Cutscene_Shader.vertex,
      fragmentShader: Cutscene_Shader.fragment,
      transparent: true
    });

    // Create plane to render the HUD. This plane fills the whole screen.
    var planeGeometry = new THREE.PlaneGeometry(100, 100);
    this.plane = new THREE.Mesh(planeGeometry, this.hudMaterial);
    this.plane.scale.set(width / 100, height / 100, 1);
    this.plane.position.z = 0; // Depth in the scene
    this.hudScene.add(this.plane);

    // Create a compass
    this.compass = new CompassComponent(this);

    // Create the depth meter
    this.depthMeter = new DepthMeterFragment(this);

    // Create the lower info hud fragment
    this.lowerInfoHud = new LowerInfoHudFragment(this);

    // Create the Variometer
    this.variometer = new VariometerFragment(this);
  }

  /**
   * @implement RenderableComponent.beforeRender
   */
  beforeRender(sceneContainer: ISceneContainer, hudData: HUDData, tweakParams: TweakParams) {
    // Apply tweak params
    this.compass.beforeRender(sceneContainer, hudData, tweakParams);
    this.lowerInfoHud.beforeRender(sceneContainer, hudData, tweakParams);
    this.depthMeter.beforeRender(sceneContainer, hudData, tweakParams);
    this.variometer.beforeRender(sceneContainer, hudData, tweakParams);
    this.hudDynamicTexture.needsUpdate = true;
    this.hudMaterial.uniforms.u_shutter_amount.value = tweakParams.cutsceneShutterValue;
    this.hudMaterial.uniformsNeedUpdate = true;
  }

  /**
   * @implement RenderableComponent.renderFragment
   */
  renderFragment(renderer: THREE.WebGLRenderer) {
    // Render HUD on top of the scene.
    renderer.render(this.hudScene, this.hudCamera);
    // END Try a HUD
  }

  /**
   * @implement RenderableComponent.updateSize
   */
  updateSize(width: number, height: number) {
    this.hudCanvas.width = width;
    this.hudCanvas.height = height;
    this.hudDynamicTexture = new THREE.Texture(this.hudCanvas);
    this.hudDynamicTexture.needsUpdate = true;
    this.hudMaterial.uniforms.u_texture.value = this.hudDynamicTexture;
    this.hudMaterial.uniforms.u_canvas_width.value = width;
    this.hudMaterial.uniforms.u_canvas_height.value = height;
    this.hudMaterial.uniformsNeedUpdate = true;
    this.plane.scale.set(width / 100, height / 100, 1);
    this.lowerInfoHud.updateSize(width, height);
    this.depthMeter.updateSize(width, height);
    this.variometer.updateSize(width, height);
  }
}
