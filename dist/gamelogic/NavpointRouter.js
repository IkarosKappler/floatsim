"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavpointRouter = void 0;
var Helpers_1 = require("../utils/Helpers");
var NavpointRouter = /** @class */ (function () {
    function NavpointRouter(sceneContainer) {
        this.sceneContainer = sceneContainer;
        this.routePoints = [];
        this.activeNavpointIndex = 0;
    }
    NavpointRouter.prototype.addToRoute = function (navpoint) {
        this.routePoints.push(navpoint);
        // Activate the first point
        if (this.activeNavpointIndex < this.routePoints.length) {
            this.routePoints[this.activeNavpointIndex].isDisabled = false;
        }
    };
    NavpointRouter.prototype.update = function (elapsedTime, discreteDetectionTime) {
        // Check position
        if (this.activeNavpointIndex >= this.routePoints.length) {
            return;
        }
        var curPosition = this.sceneContainer.camera.position;
        var routePoint = this.routePoints[this.activeNavpointIndex];
        var distance = (0, Helpers_1.distance3)(curPosition, routePoint.position);
        // console.log("Distance to nav point ", this.activeNavpointIndex, " is ", distance);
        if (distance <= routePoint.detectionDistance) {
            console.log("Nav point reached! Play a nice ping and show a message. Next nav point is ", this.activeNavpointIndex);
            this.routePoints[this.activeNavpointIndex].isDisabled = true;
            this.activeNavpointIndex++;
            if (this.activeNavpointIndex < this.routePoints.length) {
                this.routePoints[this.activeNavpointIndex].isDisabled = false;
            }
            else {
                console.log("You reached the final Nav point!");
            }
        }
    };
    return NavpointRouter;
}());
exports.NavpointRouter = NavpointRouter;
//# sourceMappingURL=NavpointRouter.js.map