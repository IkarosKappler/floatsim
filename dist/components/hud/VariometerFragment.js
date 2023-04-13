"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariometerFragment = void 0;
var Helpers_1 = require("../../utils/Helpers");
var constants_1 = require("../constants");
var VariometerFragment = /** @class */ (function () {
    function VariometerFragment(hudComponent) {
        this.loopCounter = 0;
        this.hudComponent = hudComponent;
        // Initialize the current bounds
        this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
    }
    /**
     * @implement RenderableComponent.befoRerender
     */
    VariometerFragment.prototype.beforeRender = function (_sceneContainer, hudData, tweakParams) {
        // Calculate the current view angle
        var angle = hudData.shipRotation.z;
        // Define the upper and the lower bounds for the displayed value
        var MAX_ANGLE = Math.PI / 2.0;
        var MIN_ANGLE = -Math.PI / 2.0;
        // Determine the percentage of the current value in the valid range
        var anglePct = (angle / (MAX_ANGLE - MIN_ANGLE)) * 2.0;
        // Calculate the (relative) vertical offset to draw the value at inside the HUD fragment
        var zeroOffsetV = this.currentHudBounds.height * (0.5 + anglePct);
        // TODO: as global?
        var triangleSize = {
            height: this.currentHudBounds.height / 20.0,
            width: this.currentHudBounds.height / 40.0
        };
        if (this.loopCounter++ < 20) {
            console.log("angle", angle * constants_1.RAD2DEG, "anglePct", anglePct, "zeroOffsetV", zeroOffsetV);
        }
        this.hudComponent.hudBitmap.save();
        if (tweakParams.highlightHudFragments) {
            var colorStyleBg = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 0.25);
            this.hudComponent.hudBitmap.fillStyle = colorStyleBg;
            this.hudComponent.hudBitmap.fillRect(this.currentHudBounds.min.x, this.currentHudBounds.min.y, this.currentHudBounds.width, this.currentHudBounds.height);
        }
        // TODO: buffer color style string in class variable (is rarely changed)
        // Apply a clipping rect!
        this.hudComponent.hudBitmap.rect(this.currentHudBounds.min.x, this.currentHudBounds.min.y, this.currentHudBounds.width, this.currentHudBounds.height);
        this.hudComponent.hudBitmap.clip();
        var colorStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 1.0);
        this.hudComponent.hudBitmap.strokeStyle = colorStyle;
        this.hudComponent.hudBitmap.beginPath();
        this.drawScale(triangleSize);
        this.hudComponent.hudBitmap.stroke();
        this.hudComponent.hudBitmap.closePath();
        // Draw Zero
        if (zeroOffsetV < 0) {
            this.drawZeroAt(0, triangleSize);
        }
        else if (zeroOffsetV >= this.currentHudBounds.height) {
            this.drawZeroAt(this.currentHudBounds.max.y, triangleSize);
        }
        else {
            this.drawZeroAt(zeroOffsetV, triangleSize);
        }
        // Draw upper
        var stepValue = 15.0;
        var mainStep = this.currentHudBounds.height / 6;
        this.hudComponent.hudBitmap.strokeStyle = colorStyle;
        this.hudComponent.hudBitmap.fillStyle = colorStyle;
        this.drawRulerSteps(-mainStep, stepValue, zeroOffsetV, triangleSize);
        var colorWarningStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.warningColor, 1.0);
        this.hudComponent.hudBitmap.strokeStyle = colorWarningStyle;
        this.hudComponent.hudBitmap.fillStyle = colorWarningStyle;
        this.drawRulerSteps(mainStep, -stepValue, zeroOffsetV, triangleSize);
        this.hudComponent.hudBitmap.stroke();
        this.hudComponent.hudBitmap.closePath();
        this.hudComponent.hudBitmap.stroke();
        this.hudComponent.hudBitmap.closePath();
        this.hudComponent.hudBitmap.restore();
    };
    VariometerFragment.prototype.drawRulerSteps = function (mainStepPixels, stepValue, zeroOffsetV, triangleSize) {
        // var mainStep = this.currentHudBounds.height / 8.0;
        this.hudComponent.hudBitmap.beginPath();
        var offsetV = zeroOffsetV;
        while (offsetV >= 0 && offsetV < this.currentHudBounds.height) {
            offsetV += mainStepPixels;
            this.hudComponent.hudBitmap.moveTo(this.currentHudBounds.min.x + triangleSize.width + 1, this.currentHudBounds.min.y + offsetV);
            this.hudComponent.hudBitmap.lineTo(this.currentHudBounds.min.x + triangleSize.width + 1 + 16, this.currentHudBounds.min.y + offsetV);
            // second step
            this.hudComponent.hudBitmap.moveTo(this.currentHudBounds.min.x + triangleSize.width + 1, this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.5);
            this.hudComponent.hudBitmap.lineTo(this.currentHudBounds.min.x + triangleSize.width + 1 + 10, this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.5);
            // Third step (first)
            this.hudComponent.hudBitmap.moveTo(this.currentHudBounds.min.x + triangleSize.width + 1, this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.25);
            this.hudComponent.hudBitmap.lineTo(this.currentHudBounds.min.x + triangleSize.width + 1 + 4, this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.25);
            // Third step (second)
            this.hudComponent.hudBitmap.moveTo(this.currentHudBounds.min.x + triangleSize.width + 1, this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.75);
            this.hudComponent.hudBitmap.lineTo(this.currentHudBounds.min.x + triangleSize.width + 1 + 4, this.currentHudBounds.min.y + offsetV - mainStepPixels * 0.75);
        } // END while
        this.hudComponent.hudBitmap.closePath();
        this.hudComponent.hudBitmap.stroke();
        var i = 0;
        offsetV = zeroOffsetV;
        while (offsetV >= 0 && offsetV < this.currentHudBounds.height) {
            offsetV += mainStepPixels;
            i++;
            this.hudComponent.hudBitmap.fillText("".concat(i * stepValue, "\u00B0"), this.currentHudBounds.min.x + triangleSize.width + 1 + 16, this.currentHudBounds.min.y + offsetV);
        }
    };
    VariometerFragment.prototype.drawZeroAt = function (zeroOffsetV, triangleSize) {
        var colorStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 1.0);
        this.hudComponent.hudBitmap.strokeStyle = colorStyle;
        this.hudComponent.hudBitmap.beginPath();
        this.hudComponent.hudBitmap.moveTo(this.currentHudBounds.min.x + triangleSize.width + 1, this.currentHudBounds.min.y + zeroOffsetV);
        this.hudComponent.hudBitmap.lineTo(this.currentHudBounds.min.x + triangleSize.width + 1 + 16, this.currentHudBounds.min.y + zeroOffsetV);
        this.hudComponent.hudBitmap.stroke();
        this.hudComponent.hudBitmap.closePath();
        var colorStyleSecondary = (0, Helpers_1.getColorStyle)(this.hudComponent.warningColor, 1.0);
        this.hudComponent.hudBitmap.strokeStyle = colorStyleSecondary;
        this.hudComponent.hudBitmap.beginPath();
        // Diagonal
        this.hudComponent.hudBitmap.moveTo(this.currentHudBounds.min.x + triangleSize.width + 1 + 8, this.currentHudBounds.min.y + zeroOffsetV - 6);
        this.hudComponent.hudBitmap.lineTo(this.currentHudBounds.min.x + triangleSize.width + 1 + 8 + 12, this.currentHudBounds.min.y + zeroOffsetV + 6);
        // Diagonal
        this.hudComponent.hudBitmap.moveTo(this.currentHudBounds.min.x + triangleSize.width + 1 + 8 + 12, this.currentHudBounds.min.y + zeroOffsetV - 6);
        this.hudComponent.hudBitmap.lineTo(this.currentHudBounds.min.x + triangleSize.width + 1 + 8, this.currentHudBounds.min.y + zeroOffsetV + 6);
        this.hudComponent.hudBitmap.stroke();
        this.hudComponent.hudBitmap.closePath();
    };
    VariometerFragment.prototype.drawScale = function (triangleSize) {
        // Draw vertical left line
        this.hudComponent.hudBitmap.moveTo(this.currentHudBounds.min.x + triangleSize.width + 1, this.currentHudBounds.min.y);
        this.hudComponent.hudBitmap.lineTo(this.currentHudBounds.min.x + triangleSize.width + 1, this.currentHudBounds.max.y);
        // Draw center indicator
        this.hudComponent.hudBitmap.moveTo(this.currentHudBounds.min.x + triangleSize.width, this.currentHudBounds.min.y + this.currentHudBounds.height / 2.0);
        this.hudComponent.hudBitmap.lineTo(this.currentHudBounds.min.x, this.currentHudBounds.min.y + this.currentHudBounds.height / 2.0 + triangleSize.height / 2);
        this.hudComponent.hudBitmap.lineTo(this.currentHudBounds.min.x, this.currentHudBounds.min.y + this.currentHudBounds.height / 2.0 - triangleSize.height / 2);
        this.hudComponent.hudBitmap.lineTo(this.currentHudBounds.min.x + triangleSize.width, this.currentHudBounds.min.y + this.currentHudBounds.height / 2.0);
    };
    /**
     * @implement RenderableComponent.renderFragment
     */
    VariometerFragment.prototype.renderFragment = function (_renderer) {
        // NOOP
    };
    /**
     * @implement RenderableComponent.updateSize
     */
    VariometerFragment.prototype.updateSize = function (viewportWidth, viewportHeight) {
        console.log("Resized", viewportWidth);
        // When the viewport sizes changes then then the HUD fragment bounds
        // need to be re-calculated as well.
        // Use one third of the total viewport height for this HUD fragment.
        var hudHeight = viewportHeight / 3.0;
        var hudWidth = hudHeight / 4.0;
        this.currentHudBounds = new Helpers_1.Bounds2Immutable({
            // Place at least 30 pixel from right border
            x: Math.min(viewportWidth - hudWidth - 30, viewportWidth - hudWidth - viewportWidth / 100),
            y: (viewportHeight - hudHeight) / 2.0,
            width: hudWidth,
            height: hudHeight
        });
    };
    return VariometerFragment;
}());
exports.VariometerFragment = VariometerFragment;
//# sourceMappingURL=VariometerFragment.js.map