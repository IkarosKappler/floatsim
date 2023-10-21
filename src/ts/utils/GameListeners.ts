/**
 * A collection of all game listeners.
 */

import { DockedAtStationListener, GameReadyListener, GameRunningListener, StationData } from "../components/interfaces";

export class GameListeners {
  readonly gameRunningListeners: Set<GameRunningListener>;
  readonly gameReadyListenrs: Set<GameReadyListener>;
  readonly dockedAtStationListeners: Set<DockedAtStationListener>;

  constructor() {
    this.gameRunningListeners = new Set<GameRunningListener>();
    this.gameReadyListenrs = new Set<GameReadyListener>();
    this.dockedAtStationListeners = new Set<DockedAtStationListener>();
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

  fireDockedAtStation(station: StationData, dockingInProgress: boolean) {
    this.dockedAtStationListeners.forEach(listener => {
      listener(station, dockingInProgress);
    });
  }
}
