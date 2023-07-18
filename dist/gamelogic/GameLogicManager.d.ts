import { SceneContainer } from "../components/SceneContainer";
import { NavpointRouter } from "./NavpointRouter";
import { NavigationManager } from "./NavigationManager";
export declare class GameLogicManager {
    private sceneContainer;
    readonly navpointRouter: NavpointRouter;
    readonly navigationManager: NavigationManager;
    constructor(sceneContainer: SceneContainer);
    update(elapsedTime: number, discreteDetectionTime: number): void;
}
