/**
 * A simple test for loading immobile "concrete" assets.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-04-10 (Happy Easter)
 */
import { SceneContainer } from "../SceneContainer";
import { Size3Immutable, TripleImmutable } from "../interfaces";
export declare class Concrete {
    private readonly sceneContainer;
    constructor(sceneContainer: SceneContainer);
    loadObjFile(basePath: string, objFileName: string, options?: {
        targetBounds?: Size3Immutable;
        targetPosition?: TripleImmutable<number>;
    }): void;
    private loadObj;
    private loadMaterials;
    private loadMaterial;
    private applyScale;
    private locateMaterial;
}
