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
exports.SonarComponent = void 0;
var THREE = __importStar(require("three"));
var Helpers_1 = require("../../utils/Helpers");
/**
 * A sonar component for the cockpit.
 * This is not a HUD component.
 *
 * @authos  Ikaros Kappler
 * @date    2023-04-14
 * @version 1.0.0
 */
var SonarComponent = /** @class */ (function () {
    function SonarComponent(hudComponent) {
        this.hudComponent = hudComponent;
        this.particles = [];
        var verticalDimension = 16; // north pole to south pole
        var horizontalDimension = 16; // along equator
        var particleCount = verticalDimension * horizontalDimension;
        var positions = [];
        var colors = [];
        var sizes = [];
        var angles = [];
        var boxSize = 64.0;
        this.containingBox = new THREE.Box3(new THREE.Vector3(-boxSize / 2.0, -boxSize / 2.0, -boxSize / 2.0), new THREE.Vector3(boxSize / 2.0, boxSize / 2.0, boxSize / 2.0));
        var boundingBoxSize = (0, Helpers_1.bounds2size)(this.containingBox);
        for (var i = 0; i < particleCount; i++) {
            // Initialize with random points.
            // Will be measured points later
            var x = this.containingBox.min.x + Math.random() * boundingBoxSize.width;
            var y = this.containingBox.min.y + Math.random() * boundingBoxSize.height;
            var z = this.containingBox.min.z + Math.random() * boundingBoxSize.depth;
            var color = new THREE.Color(128 + Math.floor(Math.random() * 127), 128 + Math.floor(Math.random() * 127), 128 + Math.floor(Math.random() * 127));
            var alpha = 0.5 + Math.random() * 0.5;
            var size = Math.random() * 5.0;
            var angle = Math.random() * Math.PI * 2.0;
            positions.push(x, y, z);
            colors.push(color.r, color.g, color.b, alpha);
            sizes.push(size);
            angles.push(angle);
            this.particles.push({
                position: new THREE.Vector3(x, y, z)
            });
        }
        this.pointsGeometry = new THREE.BufferGeometry();
        this.pointsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        this.pointsGeometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
        this.pointsGeometry.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 4));
        this.pointsGeometry.setAttribute("aRotation", new THREE.Float32BufferAttribute(angles, 1));
        this.pointsGeometry.attributes.position.needsUpdate = true;
        this.pointsGeometry.attributes.aSize.needsUpdate = true;
        this.pointsGeometry.attributes.aColor.needsUpdate = true;
        this.pointsGeometry.attributes.aRotation.needsUpdate = true;
        // const particleTexture = new THREE.TextureLoader().load(texturePath);
        var material = new THREE.PointsMaterial({
            color: new THREE.Color("rgba(255,255,255,0.75)"),
            //   map: particleTexture,
            transparent: false,
            // size: 5,
            // blending: THREE.AdditiveBlending,
            depthTest: false,
            blendDstAlpha: 1500
        });
        // const sonarGeometry = new THREE.BufferGeometry();
        var sonarMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            //   map: compassTexture,
            transparent: true,
            side: THREE.DoubleSide,
            emissive: hudComponent.primaryColor,
            flatShading: true
        });
        this.sonarGroup = new THREE.Group();
        var sonarPointMesh = new THREE.Points(this.pointsGeometry, sonarMaterial);
        this.sonarGroup.add(sonarPointMesh);
        // Radius=30 -> definitely in range of camera
        this.sonarGroup.position.add(new THREE.Vector3(30, 300, -160));
        this.hudComponent.hudScene.add(this.sonarGroup);
        var visualBoxGeometry = new THREE.BoxGeometry(boundingBoxSize.width, boundingBoxSize.height, boundingBoxSize.depth);
        var visualBox = new THREE.Mesh(visualBoxGeometry);
        var boxHelper = new THREE.BoxHelper(visualBox, 0x000000);
        this.hudComponent.hudScene.add(boxHelper);
        // const onTextureReady = (texture: THREE.Texture) => {
        //   sonarMaterial.map = texture;
        // };
        // svg2texture(`resources/img/compass-texture-d.svg?time=${new Date().getTime()}`, onTextureReady);
    }
    /**
     * @implement RenderableComponent.befoRerender
     */
    SonarComponent.prototype.beforeRender = function (_sceneContainer, _data, tweakParams) {
        // Apply tweak params
        this.sonarGroup.position.x = SonarComponent.DEFAULT_OFFSET.x + tweakParams.sonarX;
        this.sonarGroup.position.y = SonarComponent.DEFAULT_OFFSET.y + tweakParams.sonarY;
        this.sonarGroup.position.z = SonarComponent.DEFAULT_OFFSET.z + tweakParams.sonarZ;
        // Update compass rotation
        var m = new THREE.Matrix4();
        m.copy(_sceneContainer.camera.matrixWorld);
        m.invert();
        this.sonarGroup.setRotationFromMatrix(m);
    };
    /**
     * @implement RenderableComponent.renderFragment
     */
    SonarComponent.prototype.renderFragment = function (_renderer) {
        // NOOP (nothing to render here)
        // The compass just updates its rotation/position
    };
    /**
     * @implement RenderableComponent.updateSize
     */
    SonarComponent.prototype.updateSize = function () {
        // NOOP?
    };
    SonarComponent.DEFAULT_OFFSET = { x: 0, y: 0, z: -75.0 };
    return SonarComponent;
}());
exports.SonarComponent = SonarComponent;
//# sourceMappingURL=SonarComponent.js.map