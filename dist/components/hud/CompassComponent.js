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
exports.CompassComponent = void 0;
var THREE = __importStar(require("three"));
var Helpers_1 = require("../../utils/Helpers");
var CompassComponent = /** @class */ (function () {
    function CompassComponent(hudComponent) {
        this.hudComponent = hudComponent;
        // Create a compass
        //  - option one (direct): load PNG
        //  - option two: load and convert SVG
        // const compassTexture = new THREE.TextureLoader().load("img/compass-texture-d.png");
        var compassTexture = null;
        var radiusTop = hudComponent.hudCanvas.width / 8.0; // 100;
        var radiusBottom = radiusTop; // 100;
        var height = radiusTop * 0.75; // 75;
        var compassGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32, 2, true);
        var compassMaterial = new THREE.MeshStandardMaterial({
            // Make the cockpit a bit darker
            color: 0xff0000,
            map: compassTexture,
            transparent: true,
            side: THREE.DoubleSide,
            emissive: hudComponent.primaryColor,
            flatShading: true
        });
        this.compassMesh = new THREE.Mesh(compassGeometry, compassMaterial);
        // Radius=30 -> definitely in range of camera
        this.compassMesh.position.add(new THREE.Vector3(30, 300, -160));
        this.hudComponent.hudScene.add(this.compassMesh);
        var onTextureReady = function (texture) {
            compassMaterial.map = texture;
        };
        (0, Helpers_1.svg2texture)("resources/img/compass-texture-d.svg?time=".concat(new Date().getTime()), onTextureReady);
    }
    /**
     * @implement RenderableComponent.befoRerender
     */
    CompassComponent.prototype.beforeRender = function (_sceneContainer, _data, tweakParams) {
        // Apply tweak params
        this.compassMesh.position.z = CompassComponent.DEFAULT_OFFSET.x + tweakParams.compassZ;
        this.compassMesh.position.z = CompassComponent.DEFAULT_OFFSET.y + tweakParams.compassZ;
        this.compassMesh.position.z = CompassComponent.DEFAULT_OFFSET.z + tweakParams.compassZ;
        // Update compass rotation
        var m = new THREE.Matrix4();
        m.copy(_sceneContainer.camera.matrixWorld);
        m.invert();
        this.compassMesh.setRotationFromMatrix(m);
    };
    /**
     * @implement RenderableComponent.renderFragment
     */
    CompassComponent.prototype.renderFragment = function (_renderer) {
        // NOOP (nothing to render here)
        // The compass just updates its rotation/position
    };
    /**
     * @implement RenderableComponent.updateSize
     */
    CompassComponent.prototype.updateSize = function () {
        // NOOP?
    };
    CompassComponent.DEFAULT_OFFSET = { x: 0, y: 0, z: -75.0 };
    return CompassComponent;
}());
exports.CompassComponent = CompassComponent;
//# sourceMappingURL=CompassComponent.js.map