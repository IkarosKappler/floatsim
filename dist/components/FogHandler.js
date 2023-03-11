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
exports.FogHandler = void 0;
var THREE = __importStar(require("three"));
/**
 * Fog is measured this way:
 *
 * ----- highGogDepth.max
 *   |
 *   | (greenish color)
 *   |
 * ----- highFogDepth.min
 *   |
 *   | (normal blue color )
 *   |
 * ----- deepFogDepdth.max
 *   |
 *   | (dark blackish blue color)
 *   |
 * ----- deepFogDeath.min
 */
var FogHandler = /** @class */ (function () {
    function FogHandler(sceneContainer) {
        this.sceneContainer = sceneContainer;
        this.fogNormalColor = new THREE.Color(0x021a38);
        this.fogUpperColor = new THREE.Color(0x004001);
        this.fogLowerColor = new THREE.Color(0x000000);
    }
    FogHandler.prototype.updateFogColor = function () {
        var curOffset = this.sceneContainer.camera.position.y;
        // var pct = (THREE.MathUtils.clamp(curOffset, zStartOffset, zMaxOffset) - zStartOffset) / (zMaxOffset - zStartOffset);
        if (curOffset >= this.sceneContainer.sceneData.deepFogDepth.max &&
            curOffset < this.sceneContainer.sceneData.highFogDepth.min) {
            // Use normal fog color
            this.sceneContainer.scene.fog.color.set(this.fogNormalColor);
            this.sceneContainer.scene.background.set(this.sceneContainer.scene.fog.color);
        }
        else if (curOffset >= this.sceneContainer.sceneData.highFogDepth.min) {
            // Use high sea color
            this.applyFogColor(curOffset, this.sceneContainer.sceneData.highFogDepth, this.fogNormalColor, this.fogUpperColor);
        }
        else {
            // Use deep sea color
            this.applyFogColor(curOffset, this.sceneContainer.sceneData.deepFogDepth, this.fogLowerColor, this.fogNormalColor);
        }
    };
    FogHandler.prototype.applyFogColor = function (curValue, range, minColor, maxColor) {
        var pct = (THREE.MathUtils.clamp(curValue, range.min, range.max) - range.min) / (range.max - range.min);
        // console.log("[upper] pct", pct, "curOffset", curValue);
        this.sceneContainer.scene.fog.color.lerpColors(minColor, maxColor, pct);
        this.sceneContainer.scene.background.set(this.sceneContainer.scene.fog.color);
    };
    return FogHandler;
}());
exports.FogHandler = FogHandler;
//# sourceMappingURL=FogHandler.js.map