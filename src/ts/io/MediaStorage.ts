/**
 * A global class for storing media.
 * Try to avoid loading the same resource multiple times, use this storage.
 *
 * @author Ikaros Kappler
 * @date    2023-09-24
 * @version 1.0.0
 */

import THREE from "three";
import { IGlobalLibs, Size3Immutable } from "../components/interfaces";
import { ObjFileHandler } from "./ObjFileHandler";

// This is intended to be used as a singleton.
class MediaStorageImpl {
  audioResources: Record<string, HTMLAudioElement>;
  objResources: Record<string, THREE.Object3D>;
  globalLibs: IGlobalLibs;

  constructor() {
    this.audioResources = {};
    this.objResources = {};
  }

  getText(path: string): Promise<string> {
    return new Promise<string>((accept, reject) => {
      this.globalLibs.axios
        .get(path)
        .then(response => {
          // console.log(response);
          accept(response.data);
        })
        .catch(error => {
          // console.log(error);
          reject(error);
        })
        .finally(() => {
          // always executed
          // NOOP
        });
    });
  }

  getAudio(path: string): Promise<HTMLAudioElement> {
    return new Promise<HTMLAudioElement>((accept, reject) => {
      let audio = this.audioResources[path];
      if (!audio) {
        audio = new Audio("resources/audio/custom-sounds/typewriter-01.wav");
        audio.addEventListener("canplay", () => {
          accept(audio);
        });
        this.audioResources[path] = audio;
      } else {
        accept(audio);
      }
    });
  }

  getObjMesh(basePath: string, objFileName: string, targetBounds: Size3Immutable): Promise<THREE.Object3D> {
    const buoyObjectLoaded = (_loadedObject: THREE.Object3D) => {
      console.log("Buoy mesh loaded");
      // NOOP
      // Wait until the 'materialsLoaded' callback is triggered; then the
      // object is fully loaded.
    };
    const _self = this;
    const objectKey = basePath + objFileName;
    return new Promise<THREE.Object3D>((accept, reject) => {
      // Try to catch loaded object
      console.log("[MediaStorage] Try to load OBJ mesh", basePath, objFileName);
      let obj: THREE.Object3D = this.objResources[objectKey];
      if (obj) {
        accept(obj);
        return;
      }

      // Was not loaded befor -> load from web
      const buoyMaterialsLoaded = (loadedObject: THREE.Object3D | null) => {
        console.log("Buoy material loaded");
        // loadedObject.rotateX(-Math.PI / 2.0);
        console.log("[Buoy material loaded] ", loadedObject as THREE.Mesh);
        loadedObject.traverse((child: THREE.Object3D<THREE.Event>) => {
          if ((child as THREE.Mesh).isMesh) {
            // TODO: check type
            const childMesh = child as THREE.Mesh;
            console.log("addBuoyAt", child);
            if (Array.isArray(childMesh.material)) {
              childMesh.material.forEach(mat => {
                mat.side = THREE.BackSide;
                mat.needsUpdate = true;
              });
            } else {
              childMesh.material.side = THREE.BackSide;
              childMesh.material.needsUpdate = true;
            }
          }
          // Clone.
        });
        // console.log("Creating buoy clones ...", targetPositions.length);
        // const buoys: Array<THREE.Object3D> = [];
        // for (var i = 0; i < targetPositions.length; i++) {
        //   const buoyCopy = loadedObject.clone();
        //   buoyCopy.position.set(targetPositions[i].x, targetPositions[i].y, targetPositions[i].z);
        //   this.scene.add(buoyCopy);
        //   buoys.push(buoyCopy);
        // }
        // accept(buoys);
        _self.objResources[objectKey] = loadedObject;
        accept(loadedObject);
      };
      new ObjFileHandler().loadObjFile(
        basePath,
        objFileName,
        { targetBounds }, // , targetPosition: targetPositions[0] },
        buoyObjectLoaded,
        buoyMaterialsLoaded,
        reject
      );
    });
  }
}

// CURRENTLY NOT IN USE
export const MediaStorage = new MediaStorageImpl();
