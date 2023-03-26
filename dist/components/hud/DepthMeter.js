"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-03-26
 * @version 1.0.0
 */
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
exports.DepthMeter = void 0;
var THREE = __importStar(require("three"));
var Helpers_1 = require("../../utils/Helpers");
var DepthMeter = /** @class */ (function () {
    function DepthMeter(hudComponent) {
        this.ASSET_SIZE = { width: 576, height: 1357 };
        this.hudComponent = hudComponent;
        this.depthMeterTexture = new THREE.ImageLoader().load("img/depth-meter-a.png");
    }
    /**
     * @implement RenderableComponent.befoRerender
     */
    DepthMeter.prototype.beforeRender = function (_sceneContainer, _data, tweakParams) {
        this.hudComponent.hudBitmap.save();
        // The lower right hud area
        var desiredHeight = this.hudComponent.hudCanvas.height / 3.0;
        var ratio = this.ASSET_SIZE.width / this.ASSET_SIZE.height;
        var hudSize = {
            x: 30,
            y: (this.hudComponent.hudCanvas.height - desiredHeight) / 2.0,
            width: desiredHeight * ratio,
            height: desiredHeight
        };
        // TODO: buffer color style string in class variable (is rarely changed)
        var colorStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 1.0);
        // // Clear only the lower HUD rect?
        // // Or clear the whole scene?
        // this.hudBitmap.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
        // this.hudBitmap.fillRect(
        //   this.hudCanvas.width - hudSize.width,
        //   this.hudCanvas.height - hudSize.height,
        //   hudSize.width,
        //   hudSize.height
        // );
        this.hudComponent.hudBitmap.drawImage(this.depthMeterTexture, hudSize.x, hudSize.y, hudSize.width, hudSize.height);
        this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
        this.hudComponent.hudBitmap.fillStyle = colorStyle;
        this.hudComponent.hudBitmap.fillRect(hudSize.x, hudSize.y, hudSize.width, hudSize.height);
        // Draw HUD in the lower right corner
        // this.hudBitmap.fillStyle = getColorStyle(this.primaryColor, 0.75);
        // const hudText: string = `Depth: ${hudData.depth.toFixed(1)}m`;
        // this.hudBitmap.fillText(hudText, this.hudCanvas.width - hudSize.width / 2, this.hudCanvas.height - hudSize.height / 2);
        // this.hudDynamicTexture.needsUpdate = true;
        // END Try a HUD
        this.hudComponent.hudBitmap.restore();
    };
    /**
     * @implement RenderableComponent.render
     */
    DepthMeter.prototype.renderFragment = function (_renderer) {
        // NOOP
    };
    return DepthMeter;
}());
exports.DepthMeter = DepthMeter;
//# sourceMappingURL=DepthMeter.js.map