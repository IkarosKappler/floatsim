import { SceneContainer } from "../components/SceneContainer";
import { Navpoint } from "../components/interfaces";
export declare class NavpointRouter {
    private sceneContainer;
    private routePoints;
    private activeNavpointIndex;
    constructor(sceneContainer: SceneContainer);
    addToRoute(navpoint: Navpoint): void;
    update(elapsedTime: number, discreteDetectionTime: number): void;
}
