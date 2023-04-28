"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LowerInfoHudFragment = void 0;
var Helpers_1 = require("../../utils/Helpers");
var constants_1 = require("../constants");
var LowerInfoHudFragment = /** @class */ (function () {
    function LowerInfoHudFragment(hudComponent) {
        this.hudComponent = hudComponent;
        // this.depthMeterTexture = new THREE.ImageLoader().load("img/depth-meter-a.png");
    }
    /**
     * @implement RenderableComponent.befoRerender
     */
    LowerInfoHudFragment.prototype.beforeRender = function (_sceneContainer, hudData, tweakParams) {
        this.hudComponent.hudBitmap.save();
        // The lower right hud area
        // TODO: add x and y position here, NOT below (like in DepthMeter)
        // TODO 2: refactor to hud fragment, too
        var hudSize = { width: 240, height: 80 };
        var hudBounds = new Helpers_1.Bounds2Immutable({
            x: this.hudComponent.hudCanvas.width - hudSize.width,
            y: this.hudComponent.hudCanvas.height - hudSize.height,
            width: 240,
            height: 80
        });
        // Update HUD graphics.
        //this.hudComponent.hudBitmap.font = "Normal 16px unifontregular, Monospace";
        this.hudComponent.hudBitmap.textAlign = "center";
        // Clear only the lower HUD rect?
        // Or clear the whole scene?
        this.hudComponent.hudBitmap.clearRect(0, 0, this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
        this.hudComponent.hudBitmap.beginPath();
        if (tweakParams.highlightHudFragments) {
            // console.log("RENDER HIGHLIGHTS");
            var colorStyleBg = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 0.25);
            this.hudComponent.hudBitmap.fillStyle = colorStyleBg;
            this.hudComponent.hudBitmap.fillRect(hudBounds.min.x, hudBounds.min.y, hudBounds.width, hudBounds.height);
            // this.hudComponent.hudBitmap.fillRect(hudBounds.min.x, hudBounds.min.y, hudBounds.width, hudBounds.height);
        }
        // TODO: buffer color style string in class variable (is rarely changed)
        var colorStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 0.25);
        this.hudComponent.hudBitmap.fillStyle = colorStyle;
        this.hudComponent.hudBitmap.strokeStyle = colorStyle;
        this.hudComponent.hudBitmap.rect(hudBounds.min.x, hudBounds.min.y, hudBounds.width, hudBounds.height);
        this.hudComponent.hudBitmap.closePath();
        this.hudComponent.hudBitmap.stroke();
        // Draw HUD in the lower right corner
        this.hudComponent.hudBitmap.fillStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 0.75);
        var offsetY = hudBounds.min.y + tweakParams.lineHeight;
        var hudTextA = "Depth: ".concat(hudData.depth.toFixed(1), "m\n");
        var hudTextB = "Grnd: ".concat(hudData.groundDepth.toFixed(1), "m\n");
        var hudTextC = "Angle: ".concat((hudData.shipRotation.upAngle * constants_1.RAD2DEG).toFixed(1));
        var hudTextD = "Press: ".concat(hudData.pressure.toFixed(1), "bar");
        // °F = °C × (9/5) + 32
        var degFahrenheit = hudData.temperature * (9 / 5) + 32.0;
        var hudTextE = " Temp: ".concat(hudData.temperature.toFixed(1), "\u00B0C / ").concat(degFahrenheit.toFixed(1), "\u00B0F");
        var textArray = [hudTextA, hudTextB, hudTextC, hudTextD, hudTextE];
        for (var i = 0; i < textArray.length; i++) {
            this.hudComponent.hudBitmap.fillText(textArray[i], this.hudComponent.hudCanvas.width - hudBounds.width / 2, offsetY + i * tweakParams.lineHeight);
        }
        /*
        const hudTextA: string = `Depth: ${hudData.depth.toFixed(1)}m\n`;
        this.hudComponent.hudBitmap.fillText(
          hudTextA,
          this.hudComponent.hudCanvas.width - hudBounds.width / 2,
          offsetY - tweakParams.lineHeight / 2
        );
        const hudTextB: string = `Grnd: ${hudData.groundDepth.toFixed(1)}m\n`;
        this.hudComponent.hudBitmap.fillText(
          hudTextB,
          this.hudComponent.hudCanvas.width - hudBounds.width / 2,
          offsetY - tweakParams.lineHeight / 2
        );
        const hudTextC: string = `Angle: ${(hudData.shipRotation.upAngle * RAD2DEG).toFixed(1)}`;
        this.hudComponent.hudBitmap.fillText(
          hudTextC,
          this.hudComponent.hudCanvas.width - hudBounds.width / 2,
          offsetY + tweakParams.lineHeight / 2
        );
        const hudTextD: string = `Press: ${hudData.pressure.toFixed(1)}bar`;
        this.hudComponent.hudBitmap.fillText(
          hudTextD,
          this.hudComponent.hudCanvas.width - hudBounds.width / 2,
          offsetY + tweakParams.lineHeight * 1.5
        );
        // °F = °C × (9/5) + 32
        const degFahrenheit = hudData.temperature * (9 / 5) + 32.0;
        const hudTextE: string = ` Temp: ${hudData.temperature.toFixed(1)}°C / ${degFahrenheit.toFixed(1)}°F`;
        this.hudComponent.hudBitmap.fillText(
          hudTextE,
          this.hudComponent.hudCanvas.width - hudBounds.width / 2,
          offsetY + tweakParams.lineHeight * 2.5
        );
          */
        this.hudComponent.hudBitmap.restore();
    };
    /**
     * @implement RenderableComponent.renderFragment
     */
    LowerInfoHudFragment.prototype.renderFragment = function (_renderer) {
        // NOOP
    };
    /**
     * @implement RenderableComponent.updateSize
     */
    LowerInfoHudFragment.prototype.updateSize = function (width, height) {
        // NOOP?
    };
    return LowerInfoHudFragment;
}());
exports.LowerInfoHudFragment = LowerInfoHudFragment;
//# sourceMappingURL=LowerInfoHudFragment.js.map