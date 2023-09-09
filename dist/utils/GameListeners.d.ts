/**
 * A collection of all game listeners.
 */
import { GameReadyListener, GameRunningListener } from "../components/interfaces";
export declare class GameListeners {
    readonly gameRunningListeners: Set<GameRunningListener>;
    readonly gameReadyListenrs: Set<GameReadyListener>;
    constructor();
    fireGameRunningChanged(isGameRunning: boolean, isGamePaused: boolean): void;
    fireGameReadyChanged(): void;
}
