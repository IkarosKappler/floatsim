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
var DepthMeterFragment = /** @class */ (function () {
    function DepthMeterFragment(hudComponent) {
        this.hudComponent = hudComponent;
        this.depthMeterTexture = new THREE.ImageLoader().load(DepthMeterFragment.ASSET_PATH);
        // Initialize the current bounds
        this.updateSize();
    }
    /**
     * @implement RenderableComponent.befoRerender
     */
    DepthMeterFragment.prototype.beforeRender = function (_sceneContainer, data, tweakParams) {
        // This is rather an instance attriute
        // const HUD_RATIO = DepthMeterFragment.ASSET_SIZE.width / DepthMeterFragment.ASSET_SIZE.height;
        // Calculate depth in kilometers
        var maxDepthPct = data.depth / DepthMeterFragment.MAX_DEPTH_METER;
        var subKilometerPct = Math.abs((data.depth % 1000) / 1000);
        this.hudComponent.hudBitmap.save();
        // The lower right hud area
        // const desiredHudHeight = this.hudComponent.hudCanvas.height / 3.0;
        // var curHudBounds = new Bounds2Immutable({
        //   x: 30,
        //   y: (this.hudComponent.hudCanvas.height - desiredHudHeight) / 2.0,
        //   width: desiredHudHeight * DepthMeterFragment.HUD_RATIO,
        //   height: desiredHudHeight
        // });
        // const triangleSize: IDimension2Immutable = {
        //   height: curHudBounds.height / 20.0,
        //   width: curHudBounds.height / 40.0
        // };
        this.hudComponent.hudBitmap.beginPath();
        // this.drawIndicator(subKilometerPct, tweakParams, DepthMeterFragment.ASSETS_LEFT_SCALE_BOUNDS, true);
        // this.drawIndicator(maxDepthPct, tweakParams, DepthMeterFragment.ASSETS_RIGHT_SCALE_BOUNDS, false);
        this.drawIndicator(subKilometerPct, tweakParams, this.leftSubBounds, true);
        this.drawIndicator(maxDepthPct, tweakParams, this.rightSubBounds, false);
        this.hudComponent.hudBitmap.fill();
        this.hudComponent.hudBitmap.closePath();
        // Draw texture with primary color (source-atop)
        // this.hudComponent.hudBitmap.drawImage(
        //   this.depthMeterTexture,
        //   curHudBounds.min.x,
        //   curHudBounds.min.y,
        //   curHudBounds.width,
        //   curHudBounds.height
        // );
        this.hudComponent.hudBitmap.drawImage(this.depthMeterTexture, this.currentHudBounds.min.x, this.currentHudBounds.min.y, this.currentHudBounds.width, this.currentHudBounds.height);
        this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
        // this.hudComponent.hudBitmap.fillRect(curHudBounds.min.x, curHudBounds.min.y, curHudBounds.width, curHudBounds.height);
        this.hudComponent.hudBitmap.fillRect(this.currentHudBounds.min.x, this.currentHudBounds.min.y, this.currentHudBounds.width, this.currentHudBounds.height);
        this.hudComponent.hudBitmap.restore();
    };
    DepthMeterFragment.prototype.drawIndicator = function (mPct, tweakParams, subBounds, pointToLeft) {
        // This is rather an instance attriute
        // const hudRatio = DepthMeterFragment.ASSET_SIZE.width / DepthMeterFragment.ASSET_SIZE.height;
        // const mPct = (depth % 10) % 10;
        var desiredHudHeight = this.hudComponent.hudCanvas.height / 3.0;
        var curHudScale = desiredHudHeight / DepthMeterFragment.ASSET_SIZE.height;
        var curHudBounds = new Helpers_1.Bounds2Immutable({
            x: 30,
            y: (this.hudComponent.hudCanvas.height - desiredHudHeight) / 2.0,
            width: desiredHudHeight * DepthMeterFragment.HUD_RATIO,
            height: desiredHudHeight
        });
        // const triangleSize: IDimension2Immutable = {
        //   height: curHudBounds.height / 20.0,
        //   width: curHudBounds.height / 40.0
        // };
        var triangleSize = {
            height: this.currentHudBounds.height / 20.0,
            width: this.currentHudBounds.height / 40.0
        };
        // const subBounds = subBoundsSource.scale(curHudScale).move(curHudBounds.min);
        // const subBounds = subBoundsSource.scale(curHudScale).move(this.currentHudBounds.min);
        if (tweakParams.highlightHudFragments) {
            var colorStyleBg = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 0.25);
            this.hudComponent.hudBitmap.fillStyle = colorStyleBg;
            this.hudComponent.hudBitmap.fillRect(this.currentHudBounds.min.x, this.currentHudBounds.min.y, this.currentHudBounds.width, this.currentHudBounds.height);
            this.hudComponent.hudBitmap.fillRect(subBounds.min.x, subBounds.min.y, subBounds.width, subBounds.height);
        }
        // TODO: buffer color style string in class variable (is rarely changed)
        var colorStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 1.0);
        this.hudComponent.hudBitmap.fillStyle = colorStyle;
        // Draw indicator (left or right)
        if (pointToLeft) {
            // Left Triangle
            var triangleBoundsLeft = new Helpers_1.Bounds2Immutable({
                x: subBounds.max.x,
                y: subBounds.min.y + subBounds.height * mPct - triangleSize.height / 2.0,
                width: triangleSize.width,
                height: triangleSize.height
            });
            this.hudComponent.hudBitmap.moveTo(triangleBoundsLeft.max.x, triangleBoundsLeft.min.y);
            this.hudComponent.hudBitmap.lineTo(triangleBoundsLeft.max.x, triangleBoundsLeft.max.y);
            this.hudComponent.hudBitmap.lineTo(triangleBoundsLeft.min.x, triangleBoundsLeft.min.y + triangleBoundsLeft.height / 2.0);
            this.hudComponent.hudBitmap.lineTo(triangleBoundsLeft.max.x, triangleBoundsLeft.min.y);
        }
        else {
            // Right Triangle
            var triangleBoundsRight = new Helpers_1.Bounds2Immutable({
                x: subBounds.min.x - triangleSize.width,
                y: subBounds.min.y + subBounds.height * mPct - triangleSize.height / 2.0,
                width: triangleSize.width,
                height: triangleSize.height
            });
            this.hudComponent.hudBitmap.moveTo(triangleBoundsRight.min.x, triangleBoundsRight.min.y);
            this.hudComponent.hudBitmap.lineTo(triangleBoundsRight.min.x, triangleBoundsRight.max.y);
            this.hudComponent.hudBitmap.lineTo(triangleBoundsRight.max.x, triangleBoundsRight.min.y + triangleBoundsRight.height / 2.0);
            this.hudComponent.hudBitmap.lineTo(triangleBoundsRight.min.x, triangleBoundsRight.min.y);
        }
    };
    /**
     * @implement RenderableComponent.renderFragment
     */
    DepthMeterFragment.prototype.renderFragment = function (_renderer) {
        // NOOP
    };
    /**
     * @implement RenderableComponent.updateSize
     */
    DepthMeterFragment.prototype.updateSize = function () {
        var desiredHudHeight = this.hudComponent.hudCanvas.height / 3.0;
        this.currentHudScale = desiredHudHeight / DepthMeterFragment.ASSET_SIZE.height;
        this.currentHudBounds = new Helpers_1.Bounds2Immutable({
            x: 30,
            y: (this.hudComponent.hudCanvas.height - desiredHudHeight) / 2.0,
            width: desiredHudHeight * DepthMeterFragment.HUD_RATIO,
            height: desiredHudHeight
        });
        // leftSubBounds: Bounds2Immutable;
        this.leftSubBounds = DepthMeterFragment.ASSETS_LEFT_SCALE_BOUNDS.scale(this.currentHudScale).move(this.currentHudBounds.min);
        // rightSubBounds: Bounds2Immutable;
        this.rightSubBounds = DepthMeterFragment.ASSETS_RIGHT_SCALE_BOUNDS.scale(this.currentHudScale).move(this.currentHudBounds.min);
    };
    DepthMeterFragment.ASSET_PATH = "img/depth-meter-a.png";
    DepthMeterFragment.ASSET_SIZE = new Helpers_1.Bounds2Immutable({ x: 0, y: 0, width: 600, height: 1347 });
    DepthMeterFragment.ASSETS_LEFT_SCALE_BOUNDS = Helpers_1.Bounds2Immutable.fromMinMax({ x: 120, y: 192 }, { x: 222, y: 1156 });
    DepthMeterFragment.ASSETS_RIGHT_SCALE_BOUNDS = Helpers_1.Bounds2Immutable.fromMinMax({ x: 356, y: 94 }, { x: 450, y: 1248 });
    DepthMeterFragment.HUD_RATIO = DepthMeterFragment.ASSET_SIZE.width / DepthMeterFragment.ASSET_SIZE.height;
    DepthMeterFragment.MAX_DEPTH_METER = -12000;
    return DepthMeterFragment;
}());
exports.DepthMeterFragment = DepthMeterFragment;
//# sourceMappingURL=DepthMeterFragment.js.map