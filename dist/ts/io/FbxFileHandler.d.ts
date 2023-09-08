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
export declare class FbxFileHandler {
    private readonly sceneContainer;
    constructor(sceneContainer: SceneContainer);
    /**
     * Try to load a Wavefront object file from the specific path. The function
     * will also try to load the MTL materials (if defined in the file).
     *
     * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
     * @param {string} colladaFileName
     * @param {Size3Immutable} options.targetBounds
     * @param {TripleImmutable<number>} options.targetPosition
     */
    loadFbxFile(basePath: string, fbxFileName: string, options?: {
        targetBounds?: Size3Immutable;
        targetPosition?: TripleImmutable<number>;
    }, onObjectLoaded?: (loadedObject: THREE.Object3D) => void): void;
}
