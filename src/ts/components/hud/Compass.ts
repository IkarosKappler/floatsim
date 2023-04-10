import * as THREE from "three";
import { HUDData, ISceneContainer, RenderableComponent, TweakParams } from "../interfaces";
import { HudComponent } from "../HudComponent";
import { svg2texture } from "../../utils/Helpers";

export class Compass implements RenderableComponent {
  readonly hudComponent: HudComponent;
  private readonly compassMesh: THREE.Mesh;

  constructor(hudComponent: HudComponent) {
    this.hudComponent = hudComponent;

    // Create a compass
    //  - option one (direct): load PNG
    //  - option two: load and convert SVG
    // const compassTexture = new THREE.TextureLoader().load("img/compass-texture-d.png");
    const compassTexture: THREE.Texture | null = null;
    const radiusTop: number = hudComponent.hudCanvas.width / 8.0; // 100;
    const radiusBottom: number = radiusTop; // 100;
    const height: number = radiusTop * 0.75; // 75;
    const compassGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32, 2, true);
    const compassMaterial = new THREE.MeshStandardMaterial({
      // Make the cockpit a bit darker
      color: 0xff0000,
      map: compassTexture,
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
    svg2texture(`resources/img/compass-texture-d.svg?time=${new Date().getTime()}`, onTextureReady);
  }

  /**
   * @implement RenderableComponent.befoRerender
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

  /**
   * @implement RenderableComponent.renderFragment
   */
  renderFragment(_renderer: THREE.WebGLRenderer): void {
    // NOOP (nothing to render here)
    // The compass just updates its rotation/position
  }

  /**
   * @implement RenderableComponent.updateSize
   */
  updateSize() {
    // NOOP?
  }
}
