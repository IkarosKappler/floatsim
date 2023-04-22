"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavpointsFragment = void 0;
var Helpers_1 = require("../../utils/Helpers");
var NavpointsFragment = /** @class */ (function () {
    function NavpointsFragment(hudComponent) {
        this.hudComponent = hudComponent;
        this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
    }
    /**
     * @implement RenderableComponent.befoRerender
     */
    NavpointsFragment.prototype.beforeRender = function (_sceneContainer, data, tweakParams) {
        // Calculate depth in kilometers
        this.hudComponent.hudBitmap.save();
        this.hudComponent.hudBitmap.beginPath();
        // TODO: buffer color style string in class variable (is rarely changed)
        var colorStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 1.0);
        this.hudComponent.hudBitmap.strokeStyle = colorStyle;
        var center = this.currentFragmentBounds.getCenter();
        // Draw texture with primary color (source-atop)
        this.hudComponent.hudBitmap.moveTo(center.x - 5, center.y - 5);
        this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y + 5);
        this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y - 5);
        this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y + 5);
        this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y - 5);
        this.hudComponent.hudBitmap.closePath();
        this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
        this.hudComponent.hudBitmap.stroke();
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