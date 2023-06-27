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
        if (navpoint.isDisabled) {
            return;
        }
        // TODO: reuse the vector somehow!
        var vector = new THREE.Vector3(navpoint.position.x, navpoint.position.y, navpoint.position.z);
        var distance = sceneContainer.camera.position.distanceTo(vector);
        var difference = vector.y - sceneContainer.camera.position.y;
        // How to converting world coordinates to 2D mouse coordinates in ThreeJS
        // Found at
        //    https://discourse.threejs.org/t/how-to-converting-world-coordinates-to-2d-mouse-coordinates-in-threejs/2251
        vector.project(sceneContainer.camera);
        //  This only converts a vector to normalized device space. You still have to map the vector to 2D screen space. Something like:
        // TODO: fetch real renderer size here!
        vector.x = ((vector.x + 1) * sceneContainer.rendererSize.width) / 2;
        vector.y = (-(vector.y - 1) * sceneContainer.rendererSize.height) / 2;
        vector.z = 0;
        var colorMarker = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 1.0);
        if (this.currentFragmentBounds.contains(vector)) {
            // Navpoint is in visible area
            this.drawMarkerAt(vector, colorMarker, navpoint.type);
            this.drawLabelAt(vector.x, vector.y, "".concat(navpoint.label, " (").concat(distance.toFixed(1), "m)"));
        }
        else {
            // const directionPoint = { x : vector.x, y : vector.y };
            // // Navpoint is out of visible scope
            // if( vector.x < this.currentFragmentBounds.min.x ) {
            //   directionPoint.x =
            // }
            var directionPoint = {
                x: Math.min(Math.max(vector.x, this.currentFragmentBounds.min.x), this.currentFragmentBounds.max.x),
                y: Math.min(Math.max(vector.y, this.currentFragmentBounds.min.y), this.currentFragmentBounds.max.y)
            };
            this.drawMarkerAt(directionPoint, "red", navpoint.type);
            this.drawLabelAt(directionPoint.x, directionPoint.y, "".concat(navpoint.label, " (").concat(distance.toFixed(1), "m)"));
        }
        this.drawLabelAt(vector.x, vector.y + 12, " (".concat(difference < 0 ? "﹀" : "︿", " ").concat(difference.toFixed(1), "m)"));
    };
    NavpointsFragment.prototype.drawMarkerAt = function (center, color, navPointType) {
        this.hudComponent.hudBitmap.strokeStyle = color;
        this.hudComponent.hudBitmap.beginPath();
        if (navPointType === "nav") {
            this.hudComponent.hudBitmap.moveTo(center.x + 5, center.y - 5);
            this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y - 5);
            this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y + 5);
            this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y + 5);
            this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y - 5);
        }
        else {
            this.hudComponent.hudBitmap.moveTo(center.x - 5, center.y - 5);
            this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y + 5);
            this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y - 5);
            this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y + 5);
            this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y - 5);
        }
        this.hudComponent.hudBitmap.stroke();
        this.hudComponent.hudBitmap.closePath();
    };
    NavpointsFragment.prototype.drawLabelAt = function (x, y, label) {
        this.hudComponent.hudBitmap.beginPath();
        this.hudComponent.hudBitmap.fillText(label, x + 10, y - 8);
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
        this.drawMarkerAt(center, colorStrokeStyle, "default");
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
        // Use 10% safe area from the frame borders
        var safeAreaPct = 0.1;
        this.currentFragmentBounds = new Helpers_1.Bounds2Immutable(width * safeAreaPct, height * safeAreaPct, width * (1.0 - 2 * safeAreaPct), height * (1.0 - 2 * safeAreaPct));
    };
    return NavpointsFragment;
}());
exports.NavpointsFragment = NavpointsFragment;
//# sourceMappingURL=NavpointsFragment.js.map