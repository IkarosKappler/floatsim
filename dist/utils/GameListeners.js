"use strict";
/**
 * A collection of all game listeners.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameListeners = void 0;
var GameListeners = /** @class */ (function () {
    function GameListeners() {
        this.gameRunningListeners = new Set();
        this.gameReadyListenrs = new Set();
        this.dockedAtStationListeners = new Set();
    }
    GameListeners.prototype.fireGameRunningChanged = function (isGameRunning, isGamePaused) {
        this.gameRunningListeners.forEach(function (listener) {
            listener(isGameRunning, isGamePaused);
        });
    };
    GameListeners.prototype.fireGameReadyChanged = function () {
        this.gameReadyListenrs.forEach(function (listener) {
            listener();
        });
    };
    GameListeners.prototype.fireDockedAtStation = function (station, dockingInProgress) {
        this.dockedAtStationListeners.forEach(function (listener) {
            listener(station, dockingInProgress);
        });
    };
    return GameListeners;
}());
exports.GameListeners = GameListeners;
//# sourceMappingURL=GameListeners.js.map