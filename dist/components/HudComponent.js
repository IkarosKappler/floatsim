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
exports.HudComponent = void 0;
var THREE = __importStar(require("three"));
var Compass_1 = require("./hud/Compass");
var Helpers_1 = require("../utils/Helpers");
var HudComponent = /** @class */ (function () {
    function HudComponent(width, height, primaryColor) {
        this.primaryColor = primaryColor;
        // We will use 2D canvas element to render our HUD.
        this.hudCanvas = document.createElement("canvas");
        // Again, set dimensions to fit the screen.
        this.hudCanvas.width = width;
        this.hudCanvas.height = height;
        // Get 2D context and draw something supercool.
        this.hudBitmap = this.hudCanvas.getContext("2d");
        this.hudBitmap.font = "Normal 16px Arial";
        this.hudBitmap.textAlign = "center";
        this.hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
        this.hudBitmap.fillText("Initializing...", width / 2, height / 2);
        this.hudImage = new Image();
        this.hudImage.onload = function () {
            // hudBitmap.drawImage(hudImage, 69, 50);
        };
        // Create the camera and set the viewport to match the screen dimensions.
        this.hudCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 1500);
        this.hudCamera.position.z = 150;
        // Create also a custom scene for HUD.
        this.hudScene = new THREE.Scene();
        // Create texture from rendered graphics.
        this.hudDynamicTexture = new THREE.Texture(this.hudCanvas);
        this.hudDynamicTexture.needsUpdate = true;
        // Create HUD material.
        this.hudMaterial = new THREE.MeshBasicMaterial({
            map: this.hudDynamicTexture,
            transparent: true
            // opacity: 1
        });
        // Create plane to render the HUD. This plane fill the whole screen.
        var planeGeometry = new THREE.PlaneGeometry(100, 100); //width, height);
        this.plane = new THREE.Mesh(planeGeometry, this.hudMaterial);
        this.plane.scale.set(width / 100, height / 100, 1);
        this.plane.position.z = 0; // Depth in the scene
        this.hudScene.add(this.plane);
        // Create a compass
        this.compass = new Compass_1.Compass(this);
    }
    HudComponent.prototype.setHudSize = function (width, height) {
        this.hudCanvas.width = width;
        this.hudCanvas.height = height;
        this.hudDynamicTexture = new THREE.Texture(this.hudCanvas);
        this.hudDynamicTexture.needsUpdate = true;
        this.hudMaterial.map = this.hudDynamicTexture;
        this.plane.scale.set(width / 100, height / 100, 1);
    };
    /**
     * @implement RenderableComponent
     */
    HudComponent.prototype.beforeRender = function (sceneContainer, hudData, tweakParams) {
        // Apply tweak params
        this.compass.beforeRender(sceneContainer, hudData, tweakParams);
        // The lower right hus area
        var hudSize = { width: 240, height: 80 };
        // Update HUD graphics.
        this.hudBitmap.font = "Normal 16px Arial";
        this.hudBitmap.textAlign = "center";
        // TODO: buffer color style string in class variable (is rarely changed)
        var colorStyle = (0, Helpers_1.getColorStyle)(this.primaryColor, 0.25);
        // Clear only the lower HUD rect?
        // Or clear the whole scene?
        this.hudBitmap.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
        this.hudBitmap.fillStyle = colorStyle;
        this.hudBitmap.fillRect(this.hudCanvas.width - hudSize.width, this.hudCanvas.height - hudSize.height, hudSize.width, hudSize.height);
        // Draw HUD in the lower right corner
        this.hudBitmap.fillStyle = (0, Helpers_1.getColorStyle)(this.primaryColor, 0.75);
        var hudText = "Depth: ".concat(hudData.depth.toFixed(1), "m");
        this.hudBitmap.fillText(hudText, this.hudCanvas.width - hudSize.width / 2, this.hudCanvas.height - hudSize.height / 2);
        this.hudDynamicTexture.needsUpdate = true;
        // END Try a HUD
    };
    HudComponent.prototype.renderHud = function (renderer) {
        // Render HUD on top of the scene.
        renderer.render(this.hudScene, this.hudCamera);
        // END Try a HUD
    };
    return HudComponent;
}());
exports.HudComponent = HudComponent;
//# sourceMappingURL=HudComponent.js.map