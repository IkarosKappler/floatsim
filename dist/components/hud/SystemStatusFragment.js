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
exports.SystemStatusFragment = void 0;
var THREE = __importStar(require("three"));
var Helpers_1 = require("../../utils/Helpers");
var SystemStatusFragment = /** @class */ (function () {
    function SystemStatusFragment(hudComponent) {
        this.hudComponent = hudComponent;
        this.depthMeterTexture = new THREE.ImageLoader().load(SystemStatusFragment.ASSET_PATH);
        this.thermometerrTexture = new THREE.ImageLoader().load(SystemStatusFragment.ASSET_PATH_THERMOMETER);
        this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
    }
    /**
     * @implement RenderableComponent.befoRerender
     */
    SystemStatusFragment.prototype.beforeRender = function (_sceneContainer, data, tweakParams) {
        this.hudComponent.hudBitmap.save();
        if (tweakParams.highlightHudFragments) {
            var colorStyleBg = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 0.25);
            this.hudComponent.hudBitmap.fillStyle = colorStyleBg;
            this.hudComponent.hudBitmap.fillRect(this.currentFragmentBounds.min.x, this.currentFragmentBounds.min.y, this.currentFragmentBounds.width, this.currentFragmentBounds.height);
        }
        // TODO: buffer color style string in class variable (is rarely changed)
        // console.log("_sceneContainer.clock.getElapsedTime()", _sceneContainer.clock.getElapsedTime());
        var isBlinkingVisible = Math.round(_sceneContainer.clock.getElapsedTime() / 2.0) % 2 === 0;
        var center = this.currentFragmentBounds.getCenter();
        this.hudComponent.hudBitmap.stroke();
        // Draw battery texture with primary color (source-atop)
        var batteryIconWidth = this.currentFragmentBounds.height * SystemStatusFragment.ASSET_RATIO;
        if (tweakParams.isBatteryDamaged && isBlinkingVisible) {
            this.drawIcon(this.depthMeterTexture, batteryIconWidth, this.currentFragmentBounds.min.y, "red");
        }
        // Draw temperature texture with primary color (source-atop)
        // Draw image inside fragment height, keep ratio
        // this.hudComponent.hudBitmap.fillStyle = "green";
        var iconWidth = this.currentFragmentBounds.height * SystemStatusFragment.ASSET_RATIO_THERMOMETER;
        var thermometerIconWidth = this.currentFragmentBounds.height * SystemStatusFragment.ASSET_RATIO_THERMOMETER;
        this.drawIcon(this.thermometerrTexture, thermometerIconWidth, this.currentFragmentBounds.min.y + batteryIconWidth, "white");
        this.hudComponent.hudBitmap.restore();
    };
    SystemStatusFragment.prototype.drawIcon = function (texture, width, offsetX, color) {
        this.hudComponent.hudBitmap.fillStyle = color;
        this.hudComponent.hudBitmap.drawImage(texture, this.currentFragmentBounds.min.x + offsetX, this.currentFragmentBounds.min.y, width, this.currentFragmentBounds.height);
        // Draw icon in the desired color
        this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
        this.hudComponent.hudBitmap.fillRect(this.currentFragmentBounds.min.x + offsetX, this.currentFragmentBounds.min.y, width, this.currentFragmentBounds.height);
    };
    /**
     * @implement RenderableComponent.renderFragment
     */
    SystemStatusFragment.prototype.renderFragment = function (_renderer) {
        // NOOP
    };
    /**
     * @implement RenderableComponent.updateSize
     */
    SystemStatusFragment.prototype.updateSize = function (width, height) {
        // TODO: use params here
        console.log("[HorizonFragment] Resized", this.hudComponent.hudCanvas.width);
        // When the viewport sizes changes then then the HUD fragment bounds
        // need to be re-calculated as well.
        // Use 10% safe area from the frame borders
        var safeAreaHPct = 0.3;
        var safeAreaVPct = 0.4;
        this.currentFragmentBounds = new Helpers_1.Bounds2Immutable(
        // Place at least 30 pixel from left border
        Math.max(30, width / 10), height / 10, width / 5, height / 10);
    };
    SystemStatusFragment.ASSET_PATH = "resources/img/icons/battery-error.png";
    SystemStatusFragment.ASSET_SIZE = new Helpers_1.Bounds2Immutable({ x: 0, y: 0, width: 620, height: 620 });
    //   private static ASSETS_LEFT_SCALE_BOUNDS = Bounds2Immutable.fromMinMax({ x: 150, y: 192 }, { x: 252, y: 1156 });
    //   private static ASSETS_RIGHT_SCALE_BOUNDS = Bounds2Immutable.fromMinMax({ x: 386, y: 94 }, { x: 480, y: 1248 });
    SystemStatusFragment.ASSET_RATIO = SystemStatusFragment.ASSET_SIZE.width / SystemStatusFragment.ASSET_SIZE.height;
    SystemStatusFragment.ASSET_PATH_THERMOMETER = "resources/img/icons/thermometer-base.png";
    SystemStatusFragment.ASSET_SIZE_THERMOMETER = new Helpers_1.Bounds2Immutable({ x: 0, y: 0, width: 189, height: 189 });
    SystemStatusFragment.ASSET_RATIO_THERMOMETER = SystemStatusFragment.ASSET_SIZE_THERMOMETER.width / SystemStatusFragment.ASSET_SIZE_THERMOMETER.height;
    return SystemStatusFragment;
}());
exports.SystemStatusFragment = SystemStatusFragment;
//# sourceMappingURL=SystemStatusFragment.js.map