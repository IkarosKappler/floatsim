import * as THREE from "three";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
// import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { HudComponent } from "../HudComponent";
import { svg2texture } from "../../utils/Helpers";

export class Compass implements RenderableComponent {
  readonly hudComponent: HudComponent;
  private readonly compassMesh: THREE.Mesh;

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;

    // Create a compass
    // const compassTexture = new THREE.TextureLoader().load("img/compass-texture-d.png");
    const compassTexture: THREE.Texture | null = null;
    const radiusTop: number = 100;
    const radiuBottom: number = 100;
    const height: number = 75;
    const compassGeometry = new THREE.CylinderGeometry(radiusTop, radiuBottom, height, 32, 2, true);
    const compassMaterial = new THREE.MeshStandardMaterial({
      // Make the cockpit a bit darker
      color: 0xff0000,
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

    const onTextureReady = (texture: THREE.Texture) => {
      compassMaterial.map = texture;
    };
    svg2texture("img/compass-texture-d.svg", onTextureReady);
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
