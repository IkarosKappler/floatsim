import { SceneContainer } from "../components/SceneContainer";
import { NavpointRouter } from "./NavpointRouter";
export declare class GameLogicManager {
    private sceneContainer;
    readonly navpointRouter: NavpointRouter;
    constructor(sceneContainer: SceneContainer);
    update(elapsedTime: number, discreteDetectionTime: number): void;
}
