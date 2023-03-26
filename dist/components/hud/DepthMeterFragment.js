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
exports.DepthMeterFragment = void 0;
var THREE = __importStar(require("three"));
var Helpers_1 = require("../../utils/Helpers");
var constants_1 = require("../constants");
var DepthMeterFragment = /** @class */ (function () {
    function DepthMeterFragment(hudComponent) {
        this.hudComponent = hudComponent;
        this.depthMeterTexture = new THREE.ImageLoader().load(DepthMeterFragment.ASSET_PATH);
    }
    /**
     * @implement RenderableComponent.befoRerender
     */
    DepthMeterFragment.prototype.beforeRender = function (_sceneContainer, _data, tweakParams) {
        this.hudComponent.hudBitmap.save();
        // The lower right hud area
        var desiredHeight = this.hudComponent.hudCanvas.height / 3.0;
        var ratio = DepthMeterFragment.ASSET_SIZE.width / DepthMeterFragment.ASSET_SIZE.height;
        var hudSize = {
            x: 30,
            y: (this.hudComponent.hudCanvas.height - desiredHeight) / 2.0,
            width: desiredHeight * ratio,
            height: desiredHeight
        };
        // TODO: buffer color style string in class variable (is rarely changed)
        var colorStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 1.0);
        var mPct = 0.22;
        var kPct = 0.56;
        var mY = hudSize.y + hudSize.height * mPct;
        var kY = hudSize.y + hudSize.height * kPct;
        var mX = hudSize.x + hudSize.width / 2.0 - 10;
        var kX = hudSize.x + hudSize.width / 2.0 + 10;
        // Draw indicators
        this.hudComponent.hudBitmap.beginPath();
        this.hudComponent.hudBitmap.arc(mX, mY, 5, 0.0, constants_1.TAU);
        this.hudComponent.hudBitmap.arc(kX, kY, 5, 0.0, constants_1.TAU);
        this.hudComponent.hudBitmap.closePath();
        this.hudComponent.hudBitmap.fill();
        // Draw texture with primary color (source-atop)
        this.hudComponent.hudBitmap.drawImage(this.depthMeterTexture, hudSize.x, hudSize.y, hudSize.width, hudSize.height);
        this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
        this.hudComponent.hudBitmap.fillStyle = colorStyle;
        this.hudComponent.hudBitmap.fillRect(hudSize.x, hudSize.y, hudSize.width, hudSize.height);
        this.hudComponent.hudBitmap.restore();
    };
    /**
     * @implement RenderableComponent.render
     */
    DepthMeterFragment.prototype.renderFragment = function (_renderer) {
        // NOOP
    };
    DepthMeterFragment.ASSET_PATH = "img/depth-meter-a.png";
    DepthMeterFragment.ASSET_SIZE = { width: 576, height: 1357 };
    return DepthMeterFragment;
}());
exports.DepthMeterFragment = DepthMeterFragment;
//# sourceMappingURL=DepthMeterFragment.js.map