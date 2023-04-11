/**
 * A simple test for loading immobile "concrete" assets.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-04-10 (Happy Easter)
 */
import * as THREE from "three";
import { SceneContainer } from "../SceneContainer";
import { Size3Immutable, TripleImmutable } from "../interfaces";
export declare class Concrete {
    private readonly sceneContainer;
    constructor(sceneContainer: SceneContainer);
    /**
     * Try to load a Wavefront object file from the specific path. The function
     * will also try to load the MTL materials (if defined in the file).
     *
     * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
     * @param {string} objFileName
     * @param {Size3Immutable} options.targetBounds
     * @param {TripleImmutable<number>} options.targetPosition
     */
    loadObjFile(basePath: string, objFileName: string, options?: {
        targetBounds?: Size3Immutable;
        targetPosition?: TripleImmutable<number>;
    }, callback?: (loadedObject: THREE.Object3D) => void): void;
    /**
     * This private helper function loads the OBJ file using THREE's OBJLoader.
     *
     * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
     * @param {string} objFileName - Usually an *.obj file name.
     * @returns {Promise<THREE.Group>} The object group from the file.
     */
    private loadObj;
    /**
     * Try to load the MTL material files from the given path.
     *
     * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
     * @param {string[]} materialLibraries - Usually an array of *.mtl file names that are located in the given base path.
     * @returns
     */
    private loadMaterials;
    /**
     * Load a single material from the specific MTL file.
     *
     * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
     * @param {string} materialFileName - This should be an *.mtl file.
     * @returns
     */
    private loadMaterial;
    private applyScale;
    private locateMaterial;
}
