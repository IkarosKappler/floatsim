/**
 * @author  Ikaros Kappler
 * @date    2023-03-27
 * @version 1.0.0
 */
import { SceneContainer } from "./SceneContainer";
import { UpdateableComponent } from "./interfaces";
export declare class FloatingParticles implements UpdateableComponent {
    private readonly sceneContainer;
    readonly texturePath: string;
    private readonly geometry;
    private readonly particles;
    constructor(sceneContainer: SceneContainer, texturePath: string);
    private init;
    update(elapsedTime: number, _deltaTime: number): void;
}
