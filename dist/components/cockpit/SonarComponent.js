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
var constants_1 = require("../constants");
/**
 * A sonar component for the cockpit.
 * This is not a HUD component.
 *
 * @authos  Ikaros Kappler
 * @date    2023-04-14
 * @version 1.0.0
 */
var SonarComponent = /** @class */ (function () {
    function SonarComponent(cockpitScene, width, height) {
        this.cockpitScene = cockpitScene;
        this.dimension = { vertical: 16, horizontal: 16 };
        var boxSize = 92.0;
        this.particles = [];
        // const verticalDimension = 16; // north pole to south pole
        // const horizontalDimension = 16; // along equator
        // const particleCount = verticalDimension * horizontalDimension;
        var particleCount = this.dimension.vertical * this.dimension.horizontal;
        var positions = [];
        var colors = [];
        var sizes = [];
        var angles = [];
        this.containingBox = new THREE.Box3(new THREE.Vector3(-boxSize / 2.0, -boxSize / 2.0, -boxSize / 2.0), new THREE.Vector3(boxSize / 2.0, boxSize / 2.0, boxSize / 2.0));
        this.containingBoxSize = (0, Helpers_1.bounds2size)(this.containingBox);
        for (var i = 0; i < particleCount; i++) {
            // Initialize with random points.
            // Will be measured points later
            var x = this.containingBox.min.x + Math.random() * this.containingBoxSize.width;
            var y = this.containingBox.min.y + Math.random() * this.containingBoxSize.height;
            var z = this.containingBox.min.z + Math.random() * this.containingBoxSize.depth;
            var color = new THREE.Color(128 + Math.floor(Math.random() * 127), 128 + Math.floor(Math.random() * 127), 128 + Math.floor(Math.random() * 127));
            var alpha = 0.5 + Math.random() * 0.5;
            var size = Math.random() * 5.0;
            var angle = Math.random() * Math.PI * 2.0;
            positions.push(x, y, z);
            colors.push(color.r, color.g, color.b, alpha);
            sizes.push(size);
            angles.push(angle);
            this.particles.push({
                position: new THREE.Vector3(x, y, z),
                hasNoMeasure: false
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
        this.sonarGroup = new THREE.Group();
        this.initSonarGroup();
        this.initVisualBox();
        this.updatePositions();
        this.updateSize(width, height);
    }
    SonarComponent.prototype.initSonarGroup = function () {
        var sonarMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            transparent: true,
            side: THREE.DoubleSide,
            size: 2.0
        });
        var sonarPointMesh = new THREE.Points(this.pointsGeometry, sonarMaterial);
        this.sonarGroup.add(sonarPointMesh);
        this.cockpitScene.cockpitScene.add(this.sonarGroup);
    };
    SonarComponent.prototype.initVisualBox = function () {
        var visualBoxGeometry = new THREE.BoxGeometry(this.containingBoxSize.width, this.containingBoxSize.height, this.containingBoxSize.depth);
        var visualBox = new THREE.Mesh(visualBoxGeometry);
        var boxHelper = new THREE.BoxHelper(visualBox, 0x888888);
        // this.cockpitScene.cockpitScene.add(boxHelper);
        this.sonarGroup.add(boxHelper);
    };
    SonarComponent.prototype.updatePositions = function () {
        this.updatePositionsToSphere();
        var scanMap = true;
        if (scanMap) {
            this.scanMap();
        }
    };
    SonarComponent.prototype.scanMap = function () {
        var boxCenter = this.containingBox.getCenter(new THREE.Vector3());
        var boxSize = (0, Helpers_1.bounds2size)(this.containingBox);
        // TODO: check type
        var bufferAttribute = this.pointsGeometry.attributes.position;
        var bufferArray = bufferAttribute.array; // Check type
        var curTerrain = this.cockpitScene.sceneContainer.terrainSegments[0];
        if (!curTerrain) {
            return;
        }
        var directionVector = new THREE.Vector3();
        // Polar south at -PI/2, polar north at +PI/2
        for (var v = 0; v < this.dimension.vertical; v++) {
            var polar = -Math.PI / 2.0 + Math.PI * (v / this.dimension.vertical);
            for (var h = 0; h < this.dimension.horizontal; h++) {
                var phi = (constants_1.TAU / this.dimension.horizontal) * h;
                // const index = v * this.dimension.vertical + h; // this.dimension.horizontal;
                var index = v * this.dimension.horizontal + h; // this.dimension.horizontal;
                var particle = this.particles[index];
                particle.position.set(boxCenter.x + boxSize.width / 2.0, boxCenter.y, boxCenter.z);
                (0, Helpers_1.rotateVertZ)(particle.position, polar, boxCenter);
                (0, Helpers_1.rotateVertY)(particle.position, phi, boxCenter);
                directionVector.set(particle.position.x, particle.position.y, particle.position.z);
                // Cast ray
                // --- ERR ---- THIS IS TOOOOO SLOW! CANNOT BE USED -----
                // if (v === 0 && h === this.dimension.horizontal / 2) {
                //   // var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
                //   var rayCaster = new THREE.Raycaster(
                //     boxCenter, // originPoint
                //     directionVector.normalize()
                //   );
                //   // var collisionResults = rayCaster.intersectObjects(this.cockpitScene.sceneContainer.collidableMeshes);
                //   // const curTerrain = this.cockpitScene.sceneContainer.terrainSegments[0];
                //   const collisionResults = [];
                //   curTerrain.mesh.raycast(rayCaster, collisionResults);
                //   if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                //     console.log(" Hit ", collisionResults[0]);
                //   }
                // }
                // bufferArray.setXYZ( )
                bufferArray[index * 3] = particle.position.x;
                bufferArray[index * 3 + 1] = particle.position.y;
                bufferArray[index * 3 + 2] = particle.position.z;
            }
        }
        bufferAttribute.needsUpdate = true;
    };
    SonarComponent.prototype.updatePositionsToSphere = function () {
        var boxCenter = this.containingBox.getCenter(new THREE.Vector3());
        var boxSize = (0, Helpers_1.bounds2size)(this.containingBox);
        // TODO: check type
        var bufferAttribute = this.pointsGeometry.attributes.position;
        var bufferArray = bufferAttribute.array; // Check type
        var directionVector = new THREE.Vector3();
        // Polar south at -PI/2, polar north at +PI/2
        for (var v = 0; v < this.dimension.vertical; v++) {
            var polar = -Math.PI / 2.0 + Math.PI * (v / this.dimension.vertical);
            for (var h = 0; h < this.dimension.horizontal; h++) {
                var phi = (constants_1.TAU / this.dimension.horizontal) * h;
                // const index = v * this.dimension.vertical + h; // this.dimension.horizontal;
                var index = v * this.dimension.horizontal + h; // this.dimension.horizontal;
                var particle = this.particles[index];
                particle.position.set(boxCenter.x + boxSize.width / 2.0, boxCenter.y, boxCenter.z);
                (0, Helpers_1.rotateVertZ)(particle.position, polar, boxCenter);
                (0, Helpers_1.rotateVertY)(particle.position, phi, boxCenter);
                directionVector.set(particle.position.x, particle.position.y, particle.position.z);
                // bufferArray.setXYZ( )
                bufferArray[index * 3] = particle.position.x;
                bufferArray[index * 3 + 1] = particle.position.y;
                bufferArray[index * 3 + 2] = particle.position.z;
            }
        }
        bufferAttribute.needsUpdate = true;
    };
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
        // Update positions
        this.updatePositions();
    };
    /**
     * @implement RenderableComponent.renderFragment
     */
    SonarComponent.prototype.renderFragment = function (_renderer) {
        // NOOP (nothing to render here)
        // The sonar just updates its point matrix
    };
    /**
     * @implement RenderableComponent.updateSize
     */
    SonarComponent.prototype.updateSize = function (_width, height) {
        // Default place sonar 50 pixels from lower border
        SonarComponent.DEFAULT_OFFSET.y = -height / 4.0 - 50;
    };
    SonarComponent.DEFAULT_OFFSET = { x: 0, y: 0.0, z: -25.0 };
    return SonarComponent;
}());
exports.SonarComponent = SonarComponent;
//# sourceMappingURL=SonarComponent.js.map