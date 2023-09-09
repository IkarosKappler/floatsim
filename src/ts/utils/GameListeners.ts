/**
 * A collection of all game listeners.
 */

import { GameReadyListener, GameRunningListener } from "../components/interfaces";

export class GameListeners {
  readonly gameRunningListeners: Set<GameRunningListener>;
  readonly gameReadyListenrs: Set<GameReadyListener>;

  constructor() {
    this.gameRunningListeners = new Set<GameRunningListener>();
    this.gameReadyListenrs = new Set<GameReadyListener>();
  }

  fireGameRunningChanged(isGameRunning: boolean, isGamePaused: boolean) {
    this.gameRunningListeners.forEach(listener => {
      listener(isGameRunning, isGamePaused);
    });
  }

  fireGameReadyChanged() {
    this.gameReadyListenrs.forEach(listener => {
      listener();
    });
  }
}
