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
var HudComponent = /** @class */ (function () {
    function HudComponent(width, height) {
        // BEGIN Try a HUD
        // We will use 2D canvas element to render our HUD.
        this.hudCanvas = document.createElement("canvas");
        // hudCanvas.style.background = "rgba(255,255,255,0.5)";
        // Again, set dimensions to fit the screen.
        // const width = initialWidth; // TODO get canvas size here
        // const height = initialHeight;
        this.hudCanvas.width = width;
        this.hudCanvas.height = height;
        // Get 2D context and draw something supercool.
        this.hudBitmap = this.hudCanvas.getContext("2d");
        // hudBitmap.globalCompositeOperation = ;
        this.hudBitmap.font = "Normal 16px Arial";
        this.hudBitmap.textAlign = "center";
        this.hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
        this.hudBitmap.fillText("Initializing...", width / 2, height / 2);
        this.hudImage = new Image();
        this.hudImage.onload = function () {
            // hudBitmap.drawImage(hudImage, 69, 50);
        };
        // this.hudImage.src = "img/cockpit-nasa.png";
        // const hudImageAlphaMap = new THREE.TextureLoader().load("img/cockpit-nasa-alphamap.png");
        var hudWidth = 1500;
        var hudHeight = 1400;
        // Create the camera and set the viewport to match the screen dimensions.
        this.hudCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 30);
        // this.hudCamera = new THREE.OrthographicCamera(-hudWidth / 2, hudWidth / 2, hudHeight / 2, -hudHeight / 2, 0, 30);
        // Create also a custom scene for HUD.
        this.hudScene = new THREE.Scene();
        // Create texture from rendered graphics.
        this.hudTexture = new THREE.Texture(this.hudCanvas);
        this.hudTexture.needsUpdate = true;
        // Create HUD material.
        this.hudMaterial = new THREE.MeshBasicMaterial({
            //   color: new THREE.Color(0x000000),
            map: this.hudTexture,
            //   alphaMap: hudImageAlphaMap,
            transparent: true
            // opacity: 1
        });
        // hudMaterial.transparent = true;
        // hudMaterial.alphaTest = 0.5;
        // hudMaterial.color.
        // Create plane to render the HUD. This plane fill the whole screen.
        var planeGeometry = new THREE.PlaneGeometry(100, 100); //width, height);
        this.plane = new THREE.Mesh(planeGeometry, this.hudMaterial);
        this.plane.scale.set(width / 100, height / 100, 1);
        this.hudScene.add(this.plane);
    }
    //   getHudData() {
    //     return this.hudData;
    //   }
    HudComponent.prototype.setHudSize = function (width, height) {
        this.hudCanvas.width = width;
        this.hudCanvas.height = height;
        this.hudTexture = new THREE.Texture(this.hudCanvas);
        this.hudTexture.needsUpdate = true;
        this.hudMaterial.map = this.hudTexture;
        this.plane.scale.set(width / 100, height / 100, 1);
    };
    HudComponent.prototype.renderHud = function (renderer, data) {
        // Render the HUD scene
        // this.hudData.x += 0.01;
        // this.hudData.y -= 0.01;
        // this.hudData.z += 0.03;
        var hudSize = { width: 240, height: 80 };
        // Update HUD graphics.
        // this.hudBitmap.globalAlpha = 0.5;
        this.hudBitmap.font = "Normal 16px Arial";
        this.hudBitmap.textAlign = "center";
        this.hudBitmap.fillStyle = "rgba(255,255,255,0.5)";
        // console.log("this.hudCanvas.width", this.hudCanvas.width);
        this.hudBitmap.clearRect(this.hudCanvas.width - hudSize.width, this.hudCanvas.height - hudSize.height, hudSize.width, hudSize.height);
        this.hudBitmap.fillStyle = "rgba(0,192,192,0.5)";
        this.hudBitmap.fillRect(this.hudCanvas.width - hudSize.width, this.hudCanvas.height - hudSize.height, hudSize.width, hudSize.height);
        // this.hudBitmap.drawImage(this.hudImage, 0, 0); // 69, 50);
        // Draw HUD in the lower right corner
        this.hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
        // var hudText =  "RAD [x:" +
        // (this.hudData.x % (2 * Math.PI)).toFixed(1) +
        // ", y:" +
        // (this.hudData.y % (2 * Math.PI)).toFixed(1) +
        // ", z:" +
        // (this.hudData.z % (2 * Math.PI)).toFixed(1) +
        // "]";
        var hudText = "Depth: ".concat(data.depth.toFixed(1), "m");
        this.hudBitmap.fillText(hudText, this.hudCanvas.width - hudSize.width / 2, this.hudCanvas.height - hudSize.height / 2);
        this.hudTexture.needsUpdate = true;
        // Render scene.
        // renderer.render(scene, camera);
        // Render HUD on top of the scene.
        renderer.render(this.hudScene, this.hudCamera);
        // END Try a HUD
    };
    return HudComponent;
}());
exports.HudComponent = HudComponent;
//# sourceMappingURL=HudComponent.js.map