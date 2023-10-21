/**
 * A collection of all game listeners.
 */
import { DockedAtStationListener, GameReadyListener, GameRunningListener, StationData } from "../components/interfaces";
export declare class GameListeners {
    readonly gameRunningListeners: Set<GameRunningListener>;
    readonly gameReadyListenrs: Set<GameReadyListener>;
    readonly dockedAtStationListeners: Set<DockedAtStationListener>;
    constructor();
    fireGameRunningChanged(isGameRunning: boolean, isGamePaused: boolean): void;
    fireGameReadyChanged(): void;
    fireDockedAtStation(station: StationData, dockingInProgress: boolean): void;
}
