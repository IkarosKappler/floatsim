"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavpointRouter = void 0;
var NavpointRouter = /** @class */ (function () {
    function NavpointRouter(sceneContainer, gameLogicManager) {
        this.sceneContainer = sceneContainer;
        this.routePoints = [];
        this.activeNavpointIndex = 0;
        gameLogicManager.navigationManager.addNavigationEventListener(this);
    }
    NavpointRouter.prototype.addToRoute = function (navpoint) {
        this.routePoints.push(navpoint);
        // Activate the first point
        if (this.activeNavpointIndex < this.routePoints.length) {
            this.routePoints[this.activeNavpointIndex].isDisabled = false;
        }
    };
    // BEGIN NavigationEventListener
    NavpointRouter.prototype.onNavpointEntered = function (navpoint) {
        console.log("Navpoint entered", navpoint);
        var routePoint = this.routePoints[this.activeNavpointIndex];
        if (navpoint === routePoint) {
            this.routePoints[this.activeNavpointIndex].isDisabled = true;
            this.activeNavpointIndex++;
            if (this.activeNavpointIndex < this.routePoints.length) {
                this.routePoints[this.activeNavpointIndex].isDisabled = false;
                // console.log("label", this.routePoints[this.activeNavpointIndex].label);
                this.sceneContainer.messageBox.showMessage("Nav point reached! Next nav point is ".concat(this.routePoints[this.activeNavpointIndex].label, "."));
            }
            else {
                // console.log("You reached the final Nav point!");
                this.sceneContainer.messageBox.showMessage("You reached the final Nav point!");
            }
        }
    };
    NavpointRouter.prototype.onNavpointExited = function (navpoint) {
        // NOOP?
    };
    // BEGIN NavigationEventListener
    // update(elapsedTime: number, discreteDetectionTime: number) {
    //   // Check position
    //   if (this.activeNavpointIndex >= this.routePoints.length) {
    //     return;
    //   }
    //   const curPosition = this.sceneContainer.camera.position;
    //   const routePoint = this.routePoints[this.activeNavpointIndex];
    //   const distance = distance3(curPosition, routePoint.position);
    //   // console.log("Distance to nav point ", this.activeNavpointIndex, " is ", distance);
    //   if (distance <= routePoint.detectionDistance) {
    //     this.routePoints[this.activeNavpointIndex].isDisabled = true;
    //     this.activeNavpointIndex++;
    //     if (this.activeNavpointIndex < this.routePoints.length) {
    //       this.routePoints[this.activeNavpointIndex].isDisabled = false;
    //       // console.log("label", this.routePoints[this.activeNavpointIndex].label);
    //       this.sceneContainer.messageBox.showMessage(
    //         `Nav point reached! Next nav point is ${this.routePoints[this.activeNavpointIndex].label}.`
    //       );
    //     } else {
    //       // console.log("You reached the final Nav point!");
    //       this.sceneContainer.messageBox.showMessage("You reached the final Nav point!");
    //     }
    //   }
    // }
    NavpointRouter.prototype.getCurrentNavpoint = function () {
        return this.routePoints[this.activeNavpointIndex];
    };
    return NavpointRouter;
}());
exports.NavpointRouter = NavpointRouter;
//# sourceMappingURL=NavpointRouter.js.map