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
export declare class ColladaFileHandler {
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
    loadColladaFile(basePath: string, colladaFileName: string, options?: {
        targetBounds?: Size3Immutable;
        targetPosition?: TripleImmutable<number>;
    }, onObjectLoaded?: (loadedObject: THREE.Object3D) => void, onMaterialsLoaded?: (loadedObject: THREE.Object3D) => void): void;
}
