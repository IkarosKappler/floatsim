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
        this.hudComponent.hudBitmap.font = "Normal 16px Arial";
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
        var hudTextA = "Depth: ".concat(hudData.depth.toFixed(1), "m\n");
        this.hudComponent.hudBitmap.fillText(hudTextA, this.hudComponent.hudCanvas.width - hudBounds.width / 2, this.hudComponent.hudCanvas.height - hudBounds.height / 2 - 12);
        var hudTextB = "Angle(z): ".concat((hudData.shipRotation.z * constants_1.RAD2DEG).toFixed(1));
        this.hudComponent.hudBitmap.fillText(hudTextB, this.hudComponent.hudCanvas.width - hudBounds.width / 2, this.hudComponent.hudCanvas.height - hudBounds.height / 2 + 12);
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