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
var DepthMeterFragment_1 = require("./hud/DepthMeterFragment");
var LowerInfoHudFragment_1 = require("./hud/LowerInfoHudFragment");
var VariometerFragment_1 = require("./hud/VariometerFragment");
var HudComponent = /** @class */ (function () {
    function HudComponent(width, height, primaryColor, warningColor) {
        this.primaryColor = primaryColor;
        this.warningColor = warningColor;
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
        // Create the depth meter
        this.depthMeter = new DepthMeterFragment_1.DepthMeterFragment(this);
        // Create the lower info hud fragment
        this.lowerInfoHud = new LowerInfoHudFragment_1.LowerInfoHudFragment(this);
        // Create the Variometer
        this.variometer = new VariometerFragment_1.VariometerFragment(this);
    }
    /**
     * @implement RenderableComponent.beforeRender
     */
    HudComponent.prototype.beforeRender = function (sceneContainer, hudData, tweakParams) {
        // Apply tweak params
        this.compass.beforeRender(sceneContainer, hudData, tweakParams);
        this.lowerInfoHud.beforeRender(sceneContainer, hudData, tweakParams);
        this.depthMeter.beforeRender(sceneContainer, hudData, tweakParams);
        this.variometer.beforeRender(sceneContainer, hudData, tweakParams);
        this.hudDynamicTexture.needsUpdate = true;
    };
    /**
     * @implement RenderableComponent.renderFragment
     */
    HudComponent.prototype.renderFragment = function (renderer) {
        // Render HUD on top of the scene.
        renderer.render(this.hudScene, this.hudCamera);
        // END Try a HUD
    };
    /**
     * @implement RenderableComponent.updateSize
     */
    HudComponent.prototype.updateSize = function (width, height) {
        this.hudCanvas.width = width;
        this.hudCanvas.height = height;
        this.hudDynamicTexture = new THREE.Texture(this.hudCanvas);
        this.hudDynamicTexture.needsUpdate = true;
        this.hudMaterial.map = this.hudDynamicTexture;
        this.plane.scale.set(width / 100, height / 100, 1);
        this.lowerInfoHud.updateSize(width, height);
        this.depthMeter.updateSize(width, height);
        this.variometer.updateSize(width, height);
    };
    return HudComponent;
}());
exports.HudComponent = HudComponent;
//# sourceMappingURL=HudComponent.js.map