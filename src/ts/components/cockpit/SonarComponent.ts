import * as THREE from "three";
import { HUDData, ISceneContainer, RenderableComponent, Size3Immutable, TweakParams } from "../interfaces";
import { HudComponent } from "../HudComponent";
import { bounds2size, svg2texture } from "../../utils/Helpers";
import { SceneContainer } from "../SceneContainer";
import { CockpitScene } from "./CockpitScene";

/**
 * A sonar component for the cockpit.
 * This is not a HUD component.
 *
 * @authos  Ikaros Kappler
 * @date    2023-04-14
 * @version 1.0.0
 */

export class SonarComponent {
  // readonly hudComponent: HudComponent;
  private readonly cockpitScene: CockpitScene;
  private readonly sonarGroup: THREE.Group;
  //   private readonly sonarPointMeshh: THREE.Group;
  private readonly containingBox: THREE.Box3;
  private readonly particles: Array<{ position: THREE.Vector3 }>;
  private readonly pointsGeometry: THREE.BufferGeometry;

  private static readonly DEFAULT_OFFSET = { x: 0, y: 0, z: -75.0 };

  constructor(cockpitScene: CockpitScene) {
    // this.hudComponent = hudComponent;
    this.cockpitScene = cockpitScene;

    this.particles = [];

    const verticalDimension = 16; // north pole to south pole
    const horizontalDimension = 16; // along equator
    const particleCount = verticalDimension * horizontalDimension;

    const positions: Array<number> = [];
    const colors: Array<number> = [];
    const sizes: Array<number> = [];
    const angles: Array<number> = [];

    const boxSize = 64.0;
    this.containingBox = new THREE.Box3(
      new THREE.Vector3(-boxSize / 2.0, -boxSize / 2.0, -boxSize / 2.0),
      new THREE.Vector3(boxSize / 2.0, boxSize / 2.0, boxSize / 2.0)
    );
    const boundingBoxSize: Size3Immutable = bounds2size(this.containingBox);

    for (let i = 0; i < particleCount; i++) {
      // Initialize with random points.
      // Will be measured points later
      const x = this.containingBox.min.x + Math.random() * boundingBoxSize.width;
      const y = this.containingBox.min.y + Math.random() * boundingBoxSize.height;
      const z = this.containingBox.min.z + Math.random() * boundingBoxSize.depth;

      const color = new THREE.Color(
        128 + Math.floor(Math.random() * 127),
        128 + Math.floor(Math.random() * 127),
        128 + Math.floor(Math.random() * 127)
      );
      const alpha = 0.5 + Math.random() * 0.5;
      const size = Math.random() * 5.0;
      const angle = Math.random() * Math.PI * 2.0;

      positions.push(x, y, z);
      colors.push(color.r, color.g, color.b, alpha);

      sizes.push(size);
      angles.push(angle);

      this.particles.push({
        position: new THREE.Vector3(x, y, z)
      });
    }

    this.pointsGeometry = new THREE.BufferGeometry();
    this.pointsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    this.pointsGeometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    this.pointsGeometry.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 4));
    this.pointsGeometry.setAttribute("aRotation", new THREE.Float32BufferAttribute(angles, 1));

    this.pointsGeometry.attributes.position.needsUpdate = true;
    this.pointsGeometry.attributes.aSize.needsUpdate = true;
    this.pointsGeometry.attributes.aColor.needsUpdate = true;
    this.pointsGeometry.attributes.aRotation.needsUpdate = true;

    // const particleTexture = new THREE.TextureLoader().load(texturePath);

    const material = new THREE.PointsMaterial({
      color: new THREE.Color("rgba(255,255,255,0.75)"), // 0x888888,
      //   map: particleTexture,
      transparent: false,
      // size: 5,
      // blending: THREE.AdditiveBlending,
      depthTest: false, // !!! Setting this to true produces flickering!
      blendDstAlpha: 1500
    });

    // const sonarGeometry = new THREE.BufferGeometry();
    const sonarMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      //   map: compassTexture,
      transparent: true,
      side: THREE.DoubleSide,
      // emissive: hudComponent.primaryColor,
      flatShading: true
    });
    this.sonarGroup = new THREE.Group();
    const sonarPointMesh = new THREE.Points(this.pointsGeometry, sonarMaterial);
    this.sonarGroup.add(sonarPointMesh);

    // Radius=30 -> definitely in range of camera
    // this.sonarGroup.position.add(new THREE.Vector3(30, 300, -160));
    this.cockpitScene.cockpitScene.add(this.sonarGroup);

    const visualBoxGeometry = new THREE.BoxGeometry(boundingBoxSize.width, boundingBoxSize.height, boundingBoxSize.depth);
    const visualBox = new THREE.Mesh(visualBoxGeometry);
    const boxHelper = new THREE.BoxHelper(visualBox, 0x000000);
    this.cockpitScene.cockpitScene.add(boxHelper);

    // const onTextureReady = (texture: THREE.Texture) => {
    //   sonarMaterial.map = texture;
    // };
    // svg2texture(`resources/img/compass-texture-d.svg?time=${new Date().getTime()}`, onTextureReady);
  }

  /**
   * @implement RenderableComponent.befoRerender
   */
  beforeRender(_sceneContainer: ISceneContainer, _data: HUDData, tweakParams: TweakParams) {
    // Apply tweak params
    this.sonarGroup.position.x = SonarComponent.DEFAULT_OFFSET.x + tweakParams.sonarX;
    this.sonarGroup.position.y = SonarComponent.DEFAULT_OFFSET.y + tweakParams.sonarY;
    this.sonarGroup.position.z = SonarComponent.DEFAULT_OFFSET.z + tweakParams.sonarZ;
    // Update compass rotation
    var m = new THREE.Matrix4();
    m.copy(_sceneContainer.camera.matrixWorld);
    m.invert();
    this.sonarGroup.setRotationFromMatrix(m);
  }

  /**
   * @implement RenderableComponent.renderFragment
   */
  renderFragment(_renderer: THREE.WebGLRenderer): void {
    // NOOP (nothing to render here)
    // The sonar just updates its point matrix
  }

  /**
   * @implement RenderableComponent.updateSize
   */
  updateSize() {
    // NOOP?
  }
}
