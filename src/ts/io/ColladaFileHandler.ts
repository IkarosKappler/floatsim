/**
 * A simple class to properly load Collada models.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-06-23 (Two days after midsommer)
 */

import * as THREE from "three";
import { SceneContainer } from "../components/SceneContainer";
import { Size3Immutable, TripleImmutable } from "../components/interfaces";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
import { applyObjectScale } from "../utils/Helpers";

export class ColladaFileHandler {
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
  loadColladaFile(
    basePath: string,
    colladaFileName: string,
    options?: { targetBounds?: Size3Immutable; targetPosition?: TripleImmutable<number> },
    onObjectLoaded?: (loadedObject: THREE.Object3D) => void
  ) {
    // Try loading the object
    console.log("Load collada file ", colladaFileName);

    let model = null;
    const _self = this;
    const loadingManager = new THREE.LoadingManager(function () {
      if (options && options.targetBounds) {
        // this.applyScale(loadedObject, options.targetBounds);
        applyObjectScale(model, options.targetBounds);
      }
      if (options && options.targetPosition) {
        model.position.set(options.targetPosition.x, options.targetPosition.y, options.targetPosition.z);
      }

      _self.sceneContainer.scene.add(model);
      onObjectLoaded(model);
    });

    const loader = new ColladaLoader(loadingManager);
    // loader.load("./models/collada/elf/elf.dae", function (collada) {
    loader.load(basePath + colladaFileName, function (collada) {
      console.log("Collada model loaded", collada);
      model = collada.scene;
    });
  }
}
