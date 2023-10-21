"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavpointRouter = void 0;
var NavpointRouter = /** @class */ (function () {
    // private currentPointInRange: Navpoint | null = null;
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
    NavpointRouter.prototype.isCurrentRoutePoint = function (navpoint) {
        return this.getCurrentNavpoint() === navpoint;
    };
    NavpointRouter.prototype.isRouteComplete = function () {
        return this.activeNavpointIndex >= this.routePoints.length;
    };
    NavpointRouter.prototype.toggleNextRoutePoint = function () {
        this.activeNavpointIndex = (this.activeNavpointIndex + 1) % (this.routePoints.length + 1); // Include one null-point at the end
        this.showRoutpointMessage();
    };
    // BEGIN NavigationEventListener
    NavpointRouter.prototype.onNavpointEntered = function (navpoint) {
        // console.log("Navpoint entered", navpoint);
        var routePoint = this.routePoints[this.activeNavpointIndex];
        // if (this.currentPointInRange !== navpoint && navpoint && navpoint.onEnter) {
        //   navpoint.onEnter(navpoint, navpoint === routePoint);
        // }
        if (navpoint === routePoint) {
            routePoint.isDisabled = true;
            this.activeNavpointIndex++;
            if (this.activeNavpointIndex < this.routePoints.length) {
                this.routePoints[this.activeNavpointIndex].isDisabled = false;
                // console.log("label", this.routePoints[this.activeNavpointIndex].label);
                // this.sceneContainer.messageBox.showMessage(
                //   `Nav point reached! Next nav point is ${this.routePoints[this.activeNavpointIndex].label}.`
                // );
            }
            else {
                // console.log("You reached the final Nav point!");
                // this.sceneContainer.messageBox.showMessage("You reached the final Nav point!");
            }
            this.showRoutpointMessage();
        }
    };
    NavpointRouter.prototype.showRoutpointMessage = function () {
        if (this.activeNavpointIndex < this.routePoints.length) {
            this.sceneContainer.messageBox.showMessage("Nav point reached! Next nav point is ".concat(this.routePoints[this.activeNavpointIndex].label, "."));
        }
        else {
            this.sceneContainer.messageBox.showMessage("You reached the final Nav point!");
        }
    };
    NavpointRouter.prototype.onNavpointExited = function (navpoint) {
        // NOOP
    };
    // END NavigationEventListener
    NavpointRouter.prototype.getCurrentNavpoint = function () {
        return this.routePoints[this.activeNavpointIndex];
    };
    return NavpointRouter;
}());
exports.NavpointRouter = NavpointRouter;
//# sourceMappingURL=NavpointRouter.js.map