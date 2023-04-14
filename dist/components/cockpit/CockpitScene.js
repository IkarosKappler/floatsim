"use strict";
/**
 * A custom scene renderer for everything that happens in the cockpit.
 *
 * Replacement for cockpitPlane?
 *
 * @author  Ikaros Kappler
 * @date    2023-04-14
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
exports.CockpitScene = void 0;
var THREE = __importStar(require("three"));
var CockpitPlane_1 = require("./CockpitPlane");
var CockpitScene = /** @class */ (function () {
    function CockpitScene(width, height) {
        // Create the camera and set the viewport to match the screen dimensions.
        this.cockpitCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 1500);
        // this.cockpitCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0, 10000);
        this.cockpitCamera.position.z = 150;
        // Create also a custom scene for HUD.
        this.cockpitScene = new THREE.Scene();
        this.cockpitPlane = new CockpitPlane_1.CockpitPlane();
        // this.cockpitCamera.add(this.cockpitPlane.mesh);
        this.cockpitCamera.add(this.cockpitPlane.mesh);
        this.cockpitScene.add(this.cockpitCamera);
    }
    // setCockpitSize(width: number, height: number) {
    //   // this.mesh.scale.set(width / 40, height / 40, 1);
    //   this.cockpitPlane.setCockpitSize(width, height);
    // }
    /**
     * @implement RenderableComponent.beforeRender
     */
    CockpitScene.prototype.beforeRender = function (sceneContainer, hudData, tweakParams) {
        // Apply tweak params
        // this.compass.beforeRender(sceneContainer, hudData, tweakParams);
        // this.lowerInfoHud.beforeRender(sceneContainer, hudData, tweakParams);
        // this.depthMeter.beforeRender(sceneContainer, hudData, tweakParams);
        // this.variometer.beforeRender(sceneContainer, hudData, tweakParams);
        // this.hudDynamicTexture.needsUpdate = true;
    };
    /**
     * @implement RenderableComponent.renderFragment
     */
    CockpitScene.prototype.renderFragment = function (renderer) {
        // Render HUD on top of the scene.
        renderer.render(this.cockpitScene, this.cockpitCamera);
        // END Try a HUD
    };
    /**
     * @implement RenderableComponent.updateSize
     */
    CockpitScene.prototype.updateSize = function (width, height) {
        this.cockpitPlane.setCockpitSize(width, height);
    };
    return CockpitScene;
}());
exports.CockpitScene = CockpitScene;
//# sourceMappingURL=CockpitScene.js.map