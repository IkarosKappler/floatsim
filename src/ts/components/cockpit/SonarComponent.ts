import * as THREE from "three";
import { HUDData, ISceneContainer, RenderableComponent, Size3Immutable, Tuple, TweakParams } from "../interfaces";
import { HudComponent } from "../hud/HudComponent";
import { bounds2size, rotateVertY, rotateVertZ, svg2texture } from "../../utils/Helpers";
import { SceneContainer } from "../SceneContainer";
import { CockpitScene } from "./CockpitScene";
import { TAU } from "../constants";

/**
 * A sonar component for the cockpit.
 * This is not a HUD component.
 *
 * @authos  Ikaros Kappler
 * @date    2023-04-14
 * @version 1.0.0
 */

export class SonarComponent {
  private readonly cockpitScene: CockpitScene;
  private readonly sonarGroup: THREE.Group;
  private readonly containingBox: THREE.Box3;
  private readonly containingBoxSize: Size3Immutable;
  private readonly particles: Array<{ position: THREE.Vector3; hasNoMeasure: boolean }>;
  private readonly pointsGeometry: THREE.BufferGeometry;

  private static readonly DEFAULT_OFFSET = { x: 0, y: 0.0, z: -25.0 };

  private dimension: { vertical: number; horizontal: number };

  constructor(cockpitScene: CockpitScene, width: number, height: number) {
    this.cockpitScene = cockpitScene;
    this.dimension = { vertical: 16, horizontal: 16 };

    const boxSize = 92.0;
    this.particles = [];

    // const verticalDimension = 16; // north pole to south pole
    // const horizontalDimension = 16; // along equator
    // const particleCount = verticalDimension * horizontalDimension;
    const particleCount = this.dimension.vertical * this.dimension.horizontal;

    const positions: Array<number> = [];
    const colors: Array<number> = [];
    const sizes: Array<number> = [];
    const angles: Array<number> = [];

    this.containingBox = new THREE.Box3(
      new THREE.Vector3(-boxSize / 2.0, -boxSize / 2.0, -boxSize / 2.0),
      new THREE.Vector3(boxSize / 2.0, boxSize / 2.0, boxSize / 2.0)
    );
    this.containingBoxSize = bounds2size(this.containingBox);

    for (let i = 0; i < particleCount; i++) {
      // Initialize with random points.
      // Will be measured points later
      const x = this.containingBox.min.x + Math.random() * this.containingBoxSize.width;
      const y = this.containingBox.min.y + Math.random() * this.containingBoxSize.height;
      const z = this.containingBox.min.z + Math.random() * this.containingBoxSize.depth;

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
        position: new THREE.Vector3(x, y, z),
        hasNoMeasure: false
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

    this.sonarGroup = new THREE.Group();
    this.initSonarGroup();
    this.initVisualBox();
    this.updatePositions();

    this.updateSize(width, height);
  }

  private initSonarGroup() {
    const sonarMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      transparent: true,
      side: THREE.DoubleSide,
      size: 2.0
    });
    const sonarPointMesh = new THREE.Points(this.pointsGeometry, sonarMaterial);
    this.sonarGroup.add(sonarPointMesh);
    this.cockpitScene.cockpitScene.add(this.sonarGroup);
  }

  private initVisualBox() {
    const visualBoxGeometry = new THREE.BoxGeometry(
      this.containingBoxSize.width,
      this.containingBoxSize.height,
      this.containingBoxSize.depth
    );
    const visualBox = new THREE.Mesh(visualBoxGeometry);
    const boxHelper = new THREE.BoxHelper(visualBox, 0x888888);
    // this.cockpitScene.cockpitScene.add(boxHelper);
    this.sonarGroup.add(boxHelper);
  }

  private updatePositions() {
    this.updatePositionsToSphere();
    const scanMap = true;
    if (scanMap) {
      this.scanMap();
    }
  }

  private scanMap() {
    const boxCenter = this.containingBox.getCenter(new THREE.Vector3());
    const boxSize = bounds2size(this.containingBox);
    // TODO: check type
    const bufferAttribute = this.pointsGeometry.attributes.position as THREE.BufferAttribute;
    const bufferArray = bufferAttribute.array as any; // Check type

    const curTerrain = this.cockpitScene.sceneContainer.terrainSegments[0];
    if (!curTerrain) {
      return;
    }

    const directionVector = new THREE.Vector3();
    // Polar south at -PI/2, polar north at +PI/2
    for (var v = 0; v < this.dimension.vertical; v++) {
      const polar = -Math.PI / 2.0 + Math.PI * (v / this.dimension.vertical);
      for (var h = 0; h < this.dimension.horizontal; h++) {
        const phi = (TAU / this.dimension.horizontal) * h;
        // const index = v * this.dimension.vertical + h; // this.dimension.horizontal;
        const index = v * this.dimension.horizontal + h; // this.dimension.horizontal;

        const particle = this.particles[index];
        particle.position.set(boxCenter.x + boxSize.width / 2.0, boxCenter.y, boxCenter.z);
        rotateVertZ(particle.position, polar, boxCenter);
        rotateVertY(particle.position, phi, boxCenter);

        directionVector.set(particle.position.x, particle.position.y, particle.position.z);

        // Cast ray
        // --- ERR ---- THIS IS TOOOOO SLOW! CANNOT BE USED -----
        // if (v === 0 && h === this.dimension.horizontal / 2) {
        //   // var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
        //   var rayCaster = new THREE.Raycaster(
        //     boxCenter, // originPoint
        //     directionVector.normalize()
        //   );
        //   // var collisionResults = rayCaster.intersectObjects(this.cockpitScene.sceneContainer.collidableMeshes);
        //   // const curTerrain = this.cockpitScene.sceneContainer.terrainSegments[0];

        //   const collisionResults = [];
        //   curTerrain.mesh.raycast(rayCaster, collisionResults);
        //   if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
        //     console.log(" Hit ", collisionResults[0]);
        //   }
        // }

        // bufferArray.setXYZ( )
        bufferArray[index * 3] = particle.position.x;
        bufferArray[index * 3 + 1] = particle.position.y;
        bufferArray[index * 3 + 2] = particle.position.z;
      }
    }
    bufferAttribute.needsUpdate = true;
  }

  private updatePositionsToSphere() {
    const boxCenter = this.containingBox.getCenter(new THREE.Vector3());
    const boxSize = bounds2size(this.containingBox);
    // TODO: check type
    const bufferAttribute = this.pointsGeometry.attributes.position as THREE.BufferAttribute;
    const bufferArray = bufferAttribute.array as any; // Check type

    const directionVector = new THREE.Vector3();
    // Polar south at -PI/2, polar north at +PI/2
    for (var v = 0; v < this.dimension.vertical; v++) {
      const polar = -Math.PI / 2.0 + Math.PI * (v / this.dimension.vertical);
      for (var h = 0; h < this.dimension.horizontal; h++) {
        const phi = (TAU / this.dimension.horizontal) * h;
        // const index = v * this.dimension.vertical + h; // this.dimension.horizontal;
        const index = v * this.dimension.horizontal + h; // this.dimension.horizontal;

        const particle = this.particles[index];
        particle.position.set(boxCenter.x + boxSize.width / 2.0, boxCenter.y, boxCenter.z);
        rotateVertZ(particle.position, polar, boxCenter);
        rotateVertY(particle.position, phi, boxCenter);

        directionVector.set(particle.position.x, particle.position.y, particle.position.z);

        // bufferArray.setXYZ( )
        bufferArray[index * 3] = particle.position.x;
        bufferArray[index * 3 + 1] = particle.position.y;
        bufferArray[index * 3 + 2] = particle.position.z;
      }
    }
    bufferAttribute.needsUpdate = true;
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

    // Update positions
    this.updatePositions();
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
  updateSize(_width: number, height: number) {
    // Default place sonar 50 pixels from lower border
    SonarComponent.DEFAULT_OFFSET.y = -height / 4.0 - 50;
  }
}
