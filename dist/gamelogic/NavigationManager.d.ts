import { SceneContainer } from "../components/SceneContainer";
import { NavigationEventListener, Navpoint } from "../components/interfaces";
export declare class NavigationManager {
    private sceneContainer;
    private navPoints;
    private listeners;
    private currentPointInRange;
    constructor(sceneContainer: SceneContainer);
    addNavpoint(navpoint: Navpoint): void;
    addNavigationEventListener(listener: NavigationEventListener): boolean;
    update(elapsedTime: number, discreteDetectionTime: number): void;
    private handleNavpoint;
    private fireNavpointRangeEntered;
    private fireNavpointRangeExited;
}
