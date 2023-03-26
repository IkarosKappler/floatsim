import * as THREE from "three";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { HudComponent } from "../HudComponent";

export class Compass implements RenderableComponent {
  readonly hudComponent: HudComponent;
  private readonly compassMesh: THREE.Mesh;

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;

    // Create a compass
    // TODO: load compass texture from SVG?
    // const compassTextureSvg = new SVGLoader().load("img/compass-texture-d.svg");
    const compassTexture = new THREE.TextureLoader().load("img/compass-texture-d.png");
    const radiusTop = 100;
    const radiuBottom = 100;
    const height = 75;
    const compassGeometry = new THREE.CylinderGeometry(radiusTop, radiuBottom, height, 32, 2, true);
    const compassMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000, // Make the cockpit a bit darker
      map: compassTexture,
      // alphaMap: compassTexture,
      transparent: true,
      side: THREE.DoubleSide,
      emissive: hudComponent.primaryColor,
      flatShading: true
    });
    this.compassMesh = new THREE.Mesh(compassGeometry, compassMaterial);
    // Radius=30 -> definitely in range of camera
    this.compassMesh.position.add(new THREE.Vector3(30, 300, -160));
    this.hudComponent.hudScene.add(this.compassMesh);
  }

  /**
   * @implement RenderableComponent
   */
  beforeRender(_sceneContainer: ISceneContainer, _data: HUDData, tweakParams: TweakParams) {
    // Apply tweak params
    this.compassMesh.position.z = tweakParams.z;
    // Update compass rotation
    var m = new THREE.Matrix4();
    m.copy(_sceneContainer.camera.matrixWorld);
    m.invert();
    this.compassMesh.setRotationFromMatrix(m);
  }
}
