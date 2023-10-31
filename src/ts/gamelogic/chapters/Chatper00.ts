/**
 * Idea: write one program file for each chapter to keep the main
 * file small.
 *
 * @author  Ikaros Kappler
 * @date    2023-10-21
 * @version 1.0.0
 */

import THREE from "three";
import { SceneContainer } from "../../components/SceneContainer";
import { PerlinTerrain } from "../../components/environment/PerlinTerrain";
import { NavigationEventListener, Navpoint, Triple } from "../../components/interfaces";

export class Chapter00 {
  // implements NavigationEventListener {
  private sceneContainer: SceneContainer;
  private anningPosition: Triple<number> | null = null;
  private dockingBuoyAdded: boolean = false;

  constructor(sceneContainer: SceneContainer, terrain: PerlinTerrain) {
    this.sceneContainer = sceneContainer;
    this.loadDockingStation(terrain);
  }

  loadDockingStation(terrain: PerlinTerrain) {
    // At the same x-y position a the COLLADA object, just a bit above
    this.anningPosition = { x: -130.0, y: 0.0, z: -135.0 };
    this.anningPosition.y = this.sceneContainer.getGroundDepthAt(this.anningPosition.x, this.anningPosition.z, terrain);
    this.anningPosition.y += 70;

    // SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
    const baseSphereGeom = new THREE.SphereGeometry(30.0, 20, 20);
    baseSphereGeom.clearGroups();
    baseSphereGeom.addGroup(0, Infinity, 0);
    baseSphereGeom.addGroup(0, Infinity, 1);
    const baseSphereTexture = new THREE.TextureLoader().load("resources/img/textures/rusty-metal-plate-darker.jpg");
    baseSphereTexture.wrapS = THREE.RepeatWrapping;
    baseSphereTexture.wrapT = THREE.RepeatWrapping;
    baseSphereTexture.repeat.set(2, 1);
    const baseShpereWindowTexture = new THREE.TextureLoader().load("resources/img/textures/windowfront-blurred.png");
    baseShpereWindowTexture.wrapS = THREE.RepeatWrapping;
    baseShpereWindowTexture.wrapT = THREE.RepeatWrapping;
    baseShpereWindowTexture.repeat.set(8, 4);
    const baseSphereMat = new THREE.MeshBasicMaterial({
      map: baseSphereTexture
    });
    const baseSphereWindowMat = new THREE.MeshBasicMaterial({
      map: baseShpereWindowTexture,
      transparent: true
    });
    const baseSphereMesh = new THREE.Mesh(baseSphereGeom, [baseSphereMat, baseSphereWindowMat]);
    baseSphereMesh.position.set(this.anningPosition.x, this.anningPosition.y, this.anningPosition.z);
    this.sceneContainer.scene.add(baseSphereMesh);

    // this.sceneContainer.renderer.outputEncoding = THREE.sRGBEncoding;
    // this.sceneContainer.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // // ...
    // const target = new THREE.WebGLRenderTarget(
    //   this.sceneContainer.renderer.domElement.width,
    //   this.sceneContainer.renderer.domElement.height,
    //   {
    //     type: THREE.HalfFloatType,
    //     format: THREE.RGBAFormat,
    //     encoding: THREE.sRGBEncoding
    //   }
    // );
    // target.samples = 8;
    // const composer = new EffectComposer(renderer, target);
    // composer.addPass(new RenderPass(scene, camera));
    // // Threshold is 1, nothing will glow by default
    // composer.addPass(new UnrealBloomPass(undefined, 1, 1, 1));

    // This mesh will glow
    // const mesh = new THREE.Mesh(
    //   geometry,
    //   new THREE.MeshStandardMaterial({
    //     toneMapped: false,
    //     emissive: "red",
    //     emissiveIntensity: 10
    //   })
    // );

    this.sceneContainer.addNavpoint(
      {
        id: "anning-anchorage",
        position: { x: baseSphereMesh.position.x + 80, y: baseSphereMesh.position.y - 30, z: baseSphereMesh.position.z + 80 },
        label: "Anning Anchorage",
        detectionDistance: 25.0 / 2,
        isDisabled: false,
        type: "nav",
        userData: { isCurrentlyInRange: false },
        object3D: baseSphereMesh,
        onEnter: this.requestAddDockingNavpoint(),
        onLeave: null
      },
      true
    );

    // this.sceneContainer.gameLogicManager.navigationManager.addNavigationEventListener(this);
  }

  private requestAddDockingNavpoint(): (np: Navpoint) => void {
    const _self = this;
    return (np: Navpoint) => {
      const isCurrentRoutePoint = _self.sceneContainer.gameLogicManager.navpointRouter.isCurrentRoutePoint(np);
      console.log("Docking possible", "isCurrentRoutePoint", isCurrentRoutePoint);
      if (!this.dockingBuoyAdded && isCurrentRoutePoint) {
        this.addDockingBuoy();
      }
    };
  }

  private addDockingBuoy() {
    this.dockingBuoyAdded = true;
    this.sceneContainer
      .addBuoyAt(new THREE.Vector3(this.anningPosition.x + 25, this.anningPosition.y - 30, this.anningPosition.z + 25))
      .then(buoyMesh => {
        this.sceneContainer.addNavpoint(
          {
            id: "anning-docking",
            position: { x: buoyMesh.position.x, y: buoyMesh.position.y, z: buoyMesh.position.z },
            label: "Dock at Anning Anchorage",
            detectionDistance: 25.0 / 2,
            isDisabled: false,
            type: "nav",
            userData: { isCurrentlyInRange: false },
            object3D: buoyMesh,
            onEnter: this.requestDockingPossible(true),
            onLeave: this.requestDockingPossible(false)
          },
          false // NO ROUTE POINT
        );
      });
  }

  private requestDockingPossible(dockingInRange: boolean): (np: Navpoint) => void {
    const _self = this;
    return (np: Navpoint) => {
      //   const isCurrentRoutePoint = _self.sceneContainer.gameLogicManager.navpointRouter.isCurrentRoutePoint(np);
      const isRouteComplete = _self.sceneContainer.gameLogicManager.navpointRouter.isRouteComplete();
      console.log("Docking possible", "dockingInRange", dockingInRange, "isRouteComplete", isRouteComplete);
      if (dockingInRange && isRouteComplete) {
        console.log("DOCKIGN POSSIBLE");
        this.sceneContainer.messageBox.showMessage("Docking possible. Press 'K' to dock.");
        this.sceneContainer.hudData.isDockingPossible = true;
      } else {
        console.log("DOKCING NOT POSSIBLE");
        this.sceneContainer.hudData.isDockingPossible = false;
      }
    };
  }
}
