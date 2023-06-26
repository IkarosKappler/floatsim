/**
 * A simple class to properly load FBX models.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-06-26
 */

import * as THREE from "three";
import { SceneContainer } from "../components/SceneContainer";
import { Size3Immutable, TripleImmutable } from "../components/interfaces";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { applyObjectScale } from "../utils/Helpers";

export class FbxFileHandler {
  private readonly sceneContainer: SceneContainer;

  constructor(sceneContainer: SceneContainer) {
    this.sceneContainer = sceneContainer;
  }

  /**
   * Try to load a Wavefront object file from the specific path. The function
   * will also try to load the MTL materials (if defined in the file).
   *
   * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
   * @param {string} colladaFileName
   * @param {Size3Immutable} options.targetBounds
   * @param {TripleImmutable<number>} options.targetPosition
   */
  loadFbxFile(
    basePath: string,
    fbxFileName: string,
    options?: { targetBounds?: Size3Immutable; targetPosition?: TripleImmutable<number> },
    onObjectLoaded?: (loadedObject: THREE.Object3D) => void
  ) {
    // Try loading the object

    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      //   "models/Kachujin G Rosales.fbx",
      basePath + fbxFileName,
      loadedObject => {
        if (options && options.targetBounds) {
          // this.applyScale(loadedObject, options.targetBounds);
          applyObjectScale(loadedObject, options.targetBounds);
        }
        if (options && options.targetPosition) {
          loadedObject.position.set(options.targetPosition.x, options.targetPosition.y, options.targetPosition.z);
        }
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         // (child as THREE.Mesh).material = material
        //         if ((child as THREE.Mesh).material) {
        //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //         }
        //     }
        // })
        // object.scale.set(.01, .01, .01)
        this.sceneContainer.scene.add(loadedObject);
        onObjectLoaded(loadedObject);
      },
      xhr => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      error => {
        console.log(error);
      }
    );

    // console.log("Load collada file ", colladaFileName);

    // let model = null;
    // const _self = this;
    // const loadingManager = new THREE.LoadingManager(function () {
    //   if (options && options.targetBounds) {
    //     // this.applyScale(loadedObject, options.targetBounds);
    //     applyObjectScale(model, options.targetBounds);
    //   }
    //   if (options && options.targetPosition) {
    //     model.position.set(options.targetPosition.x, options.targetPosition.y, options.targetPosition.z);
    //   }

    //   _self.sceneContainer.scene.add(model);
    //   onObjectLoaded(model);
    // });

    // const loader = new ColladaLoader(loadingManager);
    // // loader.load("./models/collada/elf/elf.dae", function (collada) {
    // loader.load(basePath + colladaFileName, function (collada) {
    //   console.log("Collada model loaded", collada);
    //   model = collada.scene;
    // });
  }
}
