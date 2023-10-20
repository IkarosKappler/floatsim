"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationManager = void 0;
var Helpers_1 = require("../utils/Helpers");
var NavigationManager = /** @class */ (function () {
    function NavigationManager(sceneContainer) {
        this.sceneContainer = sceneContainer;
        this.navPoints = [];
        this.listeners = [];
    }
    NavigationManager.prototype.addNavpoint = function (navpoint) {
        console.log("[NavigationManager] Adding nav point to route", navpoint.label);
        this.navPoints.push(navpoint);
    };
    NavigationManager.prototype.addNavigationEventListener = function (listener) {
        for (var i in this.listeners) {
            if (this.listeners[i] === listener) {
                return false;
            }
        }
        this.listeners.push(listener);
        return true;
    };
    NavigationManager.prototype.update = function (elapsedTime, discreteDetectionTime) {
        var curPosition = this.sceneContainer.camera.position;
        for (var i = 0; i < this.navPoints.length; i++) {
            this.handleNavpoint(i, curPosition);
        }
    };
    NavigationManager.prototype.handleNavpoint = function (index, curPosition) {
        var routePoint = this.navPoints[index];
        var distance = (0, Helpers_1.distance3)(curPosition, routePoint.position);
        // console.log("Checking nav point", this.navPoints[index].label, distance);
        if (distance <= routePoint.detectionDistance && !routePoint.userData.isCurrentlyInRange) {
            // Fire navpoint entered
            // console.log("Nv point in range", this.navPoints[index].label);
            this.fireNavpointRangeEntered(routePoint);
        }
        else if (distance > routePoint.detectionDistance && routePoint.userData.isCurrentlyInRange) {
            this.fireNavpointRangeExited(routePoint);
        }
    };
    NavigationManager.prototype.fireNavpointRangeEntered = function (navpoint) {
        for (var i in this.listeners) {
            this.listeners[i].onNavpointEntered(navpoint);
        }
    };
    NavigationManager.prototype.fireNavpointRangeExited = function (navpoint) {
        for (var i in this.listeners) {
            this.listeners[i].onNavpointExited(navpoint);
        }
    };
    return NavigationManager;
}());
exports.NavigationManager = NavigationManager;
//# sourceMappingURL=NavigationManager.js.map