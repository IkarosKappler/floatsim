"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLogicManager = void 0;
var NavpointRouter_1 = require("./NavpointRouter");
var GameLogicManager = /** @class */ (function () {
    function GameLogicManager(sceneContainer) {
        this.sceneContainer = sceneContainer;
        this.navpointRouter = new NavpointRouter_1.NavpointRouter(sceneContainer);
    }
    GameLogicManager.prototype.update = function (elapsedTime, discreteDetectionTime) {
        // console.log("Update distance detection", elapsedTime);
        this.navpointRouter.update(elapsedTime, discreteDetectionTime);
    };
    return GameLogicManager;
}());
exports.GameLogicManager = GameLogicManager;
//# sourceMappingURL=GameLogicManager.js.map