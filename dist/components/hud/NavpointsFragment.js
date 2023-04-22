"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavpointsFragment = void 0;
var THREE = __importStar(require("three"));
var Helpers_1 = require("../../utils/Helpers");
var NavpointsFragment = /** @class */ (function () {
    function NavpointsFragment(hudComponent) {
        this.hudComponent = hudComponent;
        this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
    }
    NavpointsFragment.prototype.drawNavpoint = function (sceneContainer, navpoint) {
        // Compute position on screen
        // TODO: reuse the vector somehow!
        var vector = new THREE.Vector3(navpoint.position.x, navpoint.position.y, navpoint.position.z);
        var distance = sceneContainer.camera.position.distanceTo(vector);
        // How to converting world coordinates to 2D mouse coordinates in ThreeJS
        // Found at
        //    https://discourse.threejs.org/t/how-to-converting-world-coordinates-to-2d-mouse-coordinates-in-threejs/2251
        vector.project(sceneContainer.camera);
        //  This only converts a vector to normalized device space. You still have to map the vector to 2D screen space. Something like:
        // TODO: fetch real renderer size here!
        vector.x = ((vector.x + 1) * sceneContainer.rendererSize.width) / 2;
        vector.y = (-(vector.y - 1) * sceneContainer.rendererSize.height) / 2;
        vector.z = 0;
        this.drawMarkerAt(vector);
        this.drawDistanceLabelAt(vector, "d:".concat(distance.toFixed(1), "m"));
    };
    NavpointsFragment.prototype.drawMarkerAt = function (center) {
        this.hudComponent.hudBitmap.beginPath();
        this.hudComponent.hudBitmap.moveTo(center.x - 5, center.y - 5);
        this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y + 5);
        this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y - 5);
        this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y + 5);
        this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y - 5);
        this.hudComponent.hudBitmap.stroke();
        this.hudComponent.hudBitmap.closePath();
    };
    NavpointsFragment.prototype.drawDistanceLabelAt = function (center, label) {
        this.hudComponent.hudBitmap.beginPath();
        this.hudComponent.hudBitmap.fillText(label, center.x + 10, center.y - 8);
        // this.hudComponent.hudBitmap.fill();
        this.hudComponent.hudBitmap.closePath();
    };
    /**
     * @implement RenderableComponent.befoRerender
     */
    NavpointsFragment.prototype.beforeRender = function (sceneContainer, _data, tweakParams) {
        // console.log("[NavpointsFragment] beforeRender");
        this.hudComponent.hudBitmap.save();
        if (tweakParams.highlightHudFragments) {
            var colorStyleBg = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 0.25);
            this.hudComponent.hudBitmap.fillStyle = colorStyleBg;
            this.hudComponent.hudBitmap.fillRect(this.currentFragmentBounds.min.x, this.currentFragmentBounds.min.y, this.currentFragmentBounds.width, this.currentFragmentBounds.height);
        }
        // TODO: buffer color style string in class variable (is rarely changed)
        var colorStrokeStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 1.0);
        this.hudComponent.hudBitmap.strokeStyle = colorStrokeStyle;
        var colorFillStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 0.5);
        this.hudComponent.hudBitmap.fillStyle = colorFillStyle;
        var center = this.currentFragmentBounds.getCenter();
        this.drawMarkerAt(center);
        for (var i = 0; i < sceneContainer.navpoints.length; i++) {
            this.drawNavpoint(sceneContainer, sceneContainer.navpoints[i]);
        }
        this.hudComponent.hudBitmap.restore();
    };
    /**
     * @implement RenderableComponent.renderFragment
     */
    NavpointsFragment.prototype.renderFragment = function (_renderer) {
        // NOOP
    };
    /**
     * @implement RenderableComponent.updateSize
     */
    NavpointsFragment.prototype.updateSize = function (width, height) {
        // TODO: use params here
        console.log("[NavpointsFragment] Resized", this.hudComponent.hudCanvas.width);
        // When the viewport sizes changes then then the HUD fragment bounds
        // need to be re-calculated as well.
        this.currentFragmentBounds = new Helpers_1.Bounds2Immutable(10, 10, width - 20, height - 20);
    };
    return NavpointsFragment;
}());
exports.NavpointsFragment = NavpointsFragment;
//# sourceMappingURL=NavpointsFragment.js.map