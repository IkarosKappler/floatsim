/**
 * @author  Ikaros Kappler
 * @date    2023-03-27
 * @version 1.0.0
 */
import * as THREE from "three";
import { SceneContainer } from "../SceneContainer";
import { UpdateableComponent } from "../interfaces";
export declare class FloatingParticles implements UpdateableComponent {
    private readonly sceneContainer;
    private readonly geometry;
    private readonly particles;
    private containingBox;
    constructor(sceneContainer: SceneContainer, texturePath: string, containingBox: THREE.Box3, particleDensity: number);
    private init;
    update(elapsedTime: number, _deltaTime: number): void;
}
