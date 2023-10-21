import { SceneContainer } from "../components/SceneContainer";
import { NavigationEventListener, Navpoint } from "../components/interfaces";
import { GameLogicManager } from "./GameLogicManager";
export declare class NavpointRouter implements NavigationEventListener {
    private sceneContainer;
    private routePoints;
    private activeNavpointIndex;
    constructor(sceneContainer: SceneContainer, gameLogicManager: GameLogicManager);
    addToRoute(navpoint: Navpoint): void;
    isCurrentRoutePoint(navpoint: Navpoint): boolean;
    isRouteComplete(): boolean;
    toggleNextRoutePoint(): void;
    onNavpointEntered(navpoint: Navpoint): void;
    private showRoutpointMessage;
    onNavpointExited(navpoint: Navpoint): void;
    getCurrentNavpoint(): Navpoint | null;
}
