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
        var imageLoader = new THREE.ImageLoader();
        this.batteryChargesTextures = SystemStatusFragment.ASSET_PATHS_BATTERY_CHARGES.map(function (texturePath) {
            return imageLoader.load(texturePath);
        });
        this.batteryErrorTexture = imageLoader.load(SystemStatusFragment.ASSET_PATH_BATTERY_ERROR);
        this.thermometerStateTextures = SystemStatusFragment.ASSET_PATHS_THERMOMETER_STATES.map(function (texturePath) {
            return imageLoader.load(texturePath);
        });
        this.thermometerErrorTexture = imageLoader.load(SystemStatusFragment.ASSET_PATH_THERMOMETER_ERROR);
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
        var iconWidth = this.currentFragmentBounds.height * SystemStatusFragment.ASSET_RATIO;
        // Draw battery texture with primary color (source-atop)
        if (data.isBatteryDamaged) {
            var isBlinkingVisible = Math.round(_sceneContainer.clock.getElapsedTime() / 2.0) % 2 === 0;
            if (isBlinkingVisible) {
                this.drawIcon(this.batteryErrorTexture, iconWidth, 0, "red");
            }
        }
        else {
            // Show normal battery charge indicator
            // There are nine battery charge textures in steps of 12.5%
            var batteryChargeIndex = Math.max(0, Math.min(Math.round((data.batteryCharge * 1000) / 125), this.batteryChargesTextures.length - 1));
            // console.log("batteryChargeIndex", batteryChargeIndex);
            this.drawIcon(this.batteryChargesTextures[batteryChargeIndex], iconWidth, 0, undefined);
        }
        // Draw temperature texture with primary color (source-atop)
        // Draw image inside fragment height, keep ratio
        if (data.isThermometerDamaged) {
            this.drawIcon(this.thermometerErrorTexture, iconWidth, iconWidth, undefined);
        }
        else {
            // Note: temperature is in degrees Celsius
            var thermometerStateIndex = Math.max(0, Math.min(Math.ceil(data.temperature / 20), this.thermometerStateTextures.length - 1));
            // console.log("thermometerStateIndex", thermometerStateIndex);
            this.drawIcon(this.thermometerStateTextures[thermometerStateIndex], iconWidth, iconWidth, undefined);
            var degFahrenheit = data.temperature * (9 / 5) + 32.0;
            var temperatureTextDeg = "".concat(data.temperature.toFixed(1), "\u00B0C");
            var temperatureTextFahr = "".concat(degFahrenheit.toFixed(1), "\u00B0F");
            this.drawText(temperatureTextDeg, iconWidth, -tweakParams.lineHeight, "white");
            this.drawText(temperatureTextFahr, iconWidth, this.currentFragmentBounds.height + tweakParams.lineHeight, "white");
        }
        this.hudComponent.hudBitmap.restore();
    };
    SystemStatusFragment.prototype.drawIcon = function (texture, width, offsetX, color) {
        this.hudComponent.hudBitmap.save();
        this.hudComponent.hudBitmap.drawImage(texture, this.currentFragmentBounds.min.x + offsetX, this.currentFragmentBounds.min.y, width, this.currentFragmentBounds.height);
        // Draw icon in the desired color
        if (color) {
            this.hudComponent.hudBitmap.fillStyle = color;
            this.hudComponent.hudBitmap.globalCompositeOperation = "source-atop";
            this.hudComponent.hudBitmap.fillRect(this.currentFragmentBounds.min.x + offsetX, this.currentFragmentBounds.min.y, width, this.currentFragmentBounds.height);
        }
        this.hudComponent.hudBitmap.restore();
    };
    SystemStatusFragment.prototype.drawText = function (text, offsetX, yOffsetY, color) {
        this.hudComponent.hudBitmap.fillStyle = color;
        this.hudComponent.hudBitmap.fillText(text, this.currentFragmentBounds.min.x + offsetX, this.currentFragmentBounds.min.y + yOffsetY);
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
        Math.max(30, width / 10), height / 10, width / 3, height / 18);
    };
    SystemStatusFragment.ASSET_PATHS_BATTERY_CHARGES = [
        "resources/img/icons/battery/battery-0-0pct.png",
        "resources/img/icons/battery/battery-12-5pct.png",
        "resources/img/icons/battery/battery-25-0pct.png",
        "resources/img/icons/battery/battery-37-5pct.png",
        "resources/img/icons/battery/battery-50-0pct.png",
        "resources/img/icons/battery/battery-62-5pct.png",
        "resources/img/icons/battery/battery-75-0pct.png",
        "resources/img/icons/battery/battery-87-5pct.png",
        "resources/img/icons/battery/battery-100-0pct.png"
    ];
    SystemStatusFragment.ASSET_PATHS_THERMOMETER_STATES = [
        "resources/img/icons/thermometer/thermometer-0pct.png",
        "resources/img/icons/thermometer/thermometer-20pct.png",
        "resources/img/icons/thermometer/thermometer-40pct.png",
        "resources/img/icons/thermometer/thermometer-60pct.png",
        "resources/img/icons/thermometer/thermometer-80pct.png",
        "resources/img/icons/thermometer/thermometer-100pct.png"
    ];
    SystemStatusFragment.ASSET_PATH_BATTERY_ERROR = "resources/img/icons/battery/battery-error.png";
    SystemStatusFragment.ASSET_SIZE_BATTERY = new Helpers_1.Bounds2Immutable({ x: 0, y: 0, width: 620, height: 620 });
    SystemStatusFragment.ASSET_RATIO = SystemStatusFragment.ASSET_SIZE_BATTERY.width / SystemStatusFragment.ASSET_SIZE_BATTERY.height;
    SystemStatusFragment.ASSET_PATH_THERMOMETER_ERROR = "resources/img/icons/thermometer/thermometer-error.png";
    return SystemStatusFragment;
}());
exports.SystemStatusFragment = SystemStatusFragment;
//# sourceMappingURL=SystemStatusFragment.js.map