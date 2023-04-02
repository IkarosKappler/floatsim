/**
 * @author  Ikaros Kappler
 * @date    2023-03-27
 * @version 1.0.0
 */
import { SceneContainer } from "./SceneContainer";
export declare class FloatingParticles {
    private readonly sceneContainer;
    readonly texturePath: string;
    constructor(sceneContainer: SceneContainer, texturePath: string);
    private init;
}
