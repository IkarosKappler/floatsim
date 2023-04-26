"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizonFragment = void 0;
var Helpers_1 = require("../../utils/Helpers");
var HorizonFragment = /** @class */ (function () {
    function HorizonFragment(hudComponent) {
        this.hudComponent = hudComponent;
        this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
    }
    HorizonFragment.prototype.drawLineWithGap = function (minX, xAFrac, xBFrac, width, y) {
        // Draw horizon
        this.hudComponent.hudBitmap.moveTo(minX, y);
        this.hudComponent.hudBitmap.lineTo(minX + width * xAFrac, y);
        this.hudComponent.hudBitmap.moveTo(minX + width * xBFrac, y);
        this.hudComponent.hudBitmap.lineTo(minX + width, y);
        // this.hudComponent.hudBitmap.closePath();
        // this.hudComponent.hudBitmap.stroke();
    };
    HorizonFragment.prototype.drawStaticHorizon = function (y) {
        // Draw artificial horizon
        var colorHorizon = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 1.0);
        this.hudComponent.hudBitmap.strokeStyle = colorHorizon;
        this.drawLineWithGap(this.currentFragmentBounds.min.x, 0.2, 0.9, this.currentFragmentBounds.width * 0.45, y);
        this.drawLineWithGap(this.currentFragmentBounds.max.x, 0.2, 0.9, -this.currentFragmentBounds.width * 0.45, y);
    };
    HorizonFragment.prototype.drawDynamicHorizon = function (minShipUpAngle, maxShipUpAngle, shipRotation) {
        // Draw artificial horizon
        // maxShipUpAngle: Math.PI * 0.25, // 45 degree
        // minShipUpAngle: -Math.PI * 0.25 // -45 degree
        // TODO: read these from the global scene config
        var defaultZero = Math.PI * 0.5;
        var verticalControlMin = Math.PI * 0.25; // in radians, default PI
        var verticalControlMax = Math.PI * 0.75; // in radians, default 0
        var verticalMin = Math.PI - verticalControlMin - defaultZero;
        var verticalMax = Math.PI - verticalControlMax - defaultZero;
        var anglePct = shipRotation / (verticalMax - verticalMin);
        // console.log("anglePct", anglePct, "shipRotation", shipRotation);
        var colorHorizon = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 1.0);
        this.hudComponent.hudBitmap.strokeStyle = colorHorizon;
        var y = this.currentFragmentBounds.min.y - this.currentFragmentBounds.height * (anglePct - 0.5);
        this.hudComponent.hudBitmap.moveTo(this.currentFragmentBounds.min.x + this.currentFragmentBounds.width * 0.09, y);
        this.hudComponent.hudBitmap.lineTo(this.currentFragmentBounds.min.x + this.currentFragmentBounds.width * 0.09 + this.currentFragmentBounds.width * 0.315, y);
        this.hudComponent.hudBitmap.moveTo(this.currentFragmentBounds.max.x - this.currentFragmentBounds.width * 0.09, y);
        this.hudComponent.hudBitmap.lineTo(this.currentFragmentBounds.max.x - this.currentFragmentBounds.width * 0.09 - this.currentFragmentBounds.width * 0.315, y);
    };
    /**
     * @implement RenderableComponent.befoRerender
     */
    HorizonFragment.prototype.beforeRender = function (_sceneContainer, data, tweakParams) {
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
        this.drawStaticHorizon(this.currentFragmentBounds.min.y + this.currentFragmentBounds.height / 2);
        this.drawDynamicHorizon(tweakParams.minShipUpAngle, tweakParams.maxShipUpAngle, data.shipRotation.upAngle);
        this.hudComponent.hudBitmap.stroke();
        this.hudComponent.hudBitmap.restore();
    };
    /**
     * @implement RenderableComponent.renderFragment
     */
    HorizonFragment.prototype.renderFragment = function (_renderer) {
        // NOOP
    };
    /**
     * @implement RenderableComponent.updateSize
     */
    HorizonFragment.prototype.updateSize = function (width, height) {
        // TODO: use params here
        console.log("[HorizonFragment] Resized", this.hudComponent.hudCanvas.width);
        // When the viewport sizes changes then then the HUD fragment bounds
        // need to be re-calculated as well.
        // Use 10% safe area from the frame borders
        var safeAreaHPct = 0.3;
        var safeAreaVPct = 0.4;
        this.currentFragmentBounds = new Helpers_1.Bounds2Immutable(width * safeAreaHPct, height * safeAreaVPct, width * (1.0 - 2 * safeAreaHPct), height * (1.0 - 2 * safeAreaVPct));
    };
    return HorizonFragment;
}());
exports.HorizonFragment = HorizonFragment;
//# sourceMappingURL=HorizonFragment.js.map