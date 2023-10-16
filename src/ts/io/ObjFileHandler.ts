/**
 * A simple test for loading wavefront OBJ and MTL assets.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-04-10 (Happy Easter)
 */

import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { SceneContainer } from "../components/SceneContainer";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { Size3Immutable, TripleImmutable } from "../components/interfaces";
import { applyObjectScale } from "../utils/Helpers";

export class ObjFileHandler {
  private readonly sceneContainer: SceneContainer;

  constructor(sceneContainer: SceneContainer) {
    this.sceneContainer = sceneContainer;
  }

  /**
   * Try to load a Wavefront object file from the specific path. The function
   * will also try to load the MTL materials (if defined in the file).
   *
   * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
   * @param {string} objFileName
   * @param {Size3Immutable} options.targetBounds
   * @param {TripleImmutable<number>} options.targetPosition
   */
  loadObjFile(
    basePath: string,
    objFileName: string,
    options?: { targetBounds?: Size3Immutable; targetPosition?: TripleImmutable<number> },
    onObjectLoaded?: (loadedObject: THREE.Object3D) => void,
    onMaterialsLoaded?: (loadedObject: THREE.Object3D) => void,
    onError?: (error: any) => void
  ) {
    // Try loading the object
    this.loadObj(basePath, objFileName).then((loadedObject: THREE.Group) => {
      // console.log("object", loadedObject);

      if (options && options.targetBounds) {
        // this.applyScale(loadedObject, options.targetBounds);
        applyObjectScale(loadedObject, options.targetBounds);
      }
      if (options && options.targetPosition) {
        loadedObject.position.set(options.targetPosition.x, options.targetPosition.y, options.targetPosition.z);
      }
      console.log("Loaded OBJ file ", objFileName);
      this.sceneContainer.scene.add(loadedObject);
      if (onObjectLoaded) {
        onObjectLoaded(loadedObject);
      }

      const materialFileNames: Array<string> = (loadedObject as any).materialLibraries;
      if (materialFileNames) {
        this.loadMaterials(basePath, materialFileNames)
          .then((materials: Record<string, THREE.Material>[]) => {
            // console.log("Materials", materials);
            loadedObject.traverse((child: THREE.Object3D<THREE.Event>) => {
              if ((child as THREE.Mesh).isMesh) {
                // TODO: check type
                const childMesh = child as THREE.Mesh;
                this.locateMaterial(childMesh, materials);
                if (Array.isArray(childMesh.material)) {
                  childMesh.material.forEach(mat => {
                    mat.needsUpdate = true;
                  });
                } else {
                  childMesh.material.needsUpdate = true;
                }
              }
            });
            if (onMaterialsLoaded) {
              onMaterialsLoaded(loadedObject);
            }
          })
          .catch((error: any) => {
            onError && onError(error);
          });
      } // END if
      else {
        onMaterialsLoaded && onMaterialsLoaded(loadedObject);
      }
    });
  }

  /**
   * This private helper function loads the OBJ file using THREE's OBJLoader.
   *
   * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
   * @param {string} objFileName - Usually an *.obj file name.
   * @returns {Promise<THREE.Group>} The object group from the file.
   */
  private loadObj(basePath: string, objFileName: string): Promise<THREE.Group> {
    const objLoader = new OBJLoader();
    return new Promise<THREE.Group>((accept, reject) => {
      objLoader.load(
        basePath + objFileName, // An *.obj file
        (object: THREE.Group) => {
          accept(object);
        },
        (xhr: ProgressEvent<EventTarget>) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error: ErrorEvent) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  /**
   * Try to load the MTL material files from the given path.
   *
   * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
   * @param {string[]} materialLibraries - Usually an array of *.mtl file names that are located in the given base path.
   * @returns
   */
  private loadMaterials(basePath: string, materialLibraries: Array<string>): Promise<Record<string, THREE.Material>[]> {
    const promises: Array<Promise<Record<string, THREE.Material>>> = [];
    for (var i = 0; i < materialLibraries.length; i++) {
      promises.push(this.loadMaterial(basePath, materialLibraries[i]));
    }
    return Promise.all(promises);
  }

  /**
   * Load a single material from the specific MTL file.
   *
   * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
   * @param {string} materialFileName - This should be an *.mtl file.
   * @returns
   */
  private loadMaterial(basePath: string, materialFileName: string): Promise<Record<string, THREE.Material>> {
    const mtlLoader = new MTLLoader();
    return new Promise<Record<string, THREE.Material>>((accept, reject) => {
      mtlLoader.load(
        basePath + materialFileName, // "models/monkey.mtl",
        (materials: MTLLoader.MaterialCreator) => {
          materials.preload();
          // console.log("Materials loaded", materialFileName, materials);
          accept(materials.materials);
        },
        xhr => {
          // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        error => {
          console.log("An error happened", error);
          reject(error);
        }
      );
    });
  }

  // private applyScale(object: THREE.Group, targetSize: Size3Immutable) {
  //   const objectBounds = new THREE.Box3().setFromObject(object);
  //   const objectSize = new THREE.Vector3();
  //   objectBounds.getSize(objectSize);
  //   object.scale.set(targetSize.width / objectSize.x, targetSize.height / objectSize.y, targetSize.depth / objectSize.x);
  //   // console.log("New scale", object.scale);
  // }

  private locateMaterial(object: THREE.Mesh, materials: Record<string, THREE.Material>[]) {
    const materialName = (object.material as THREE.Material).name;
    // console.log(`Looking for material named ${materialName}`);
    if (materialName) {
      const keys = Object.keys(materials);
      // console.log("keys", keys);
      for (var i = 0; i < materials.length; i++) {
        const materialSet = materials[i];
        const material = materialSet[materialName];
        //   console.log("key", key);
        if (material) {
          // console.log("Material found", material);
          //   material.receiveShadows
          object.material = material;
          return;
        }
      }
    }
  }
}
