"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-03-27
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
exports.FloatingParticles = void 0;
var THREE = __importStar(require("three"));
var FloatingParticles = /** @class */ (function () {
    function FloatingParticles(sceneContainer) {
        this.sceneContainer = sceneContainer;
        this.testB();
    }
    FloatingParticles.prototype.testB = function () {
        // From the demo
        //    https://threejs.org/examples/?q=particles#webgl_points_sprites
        var parameters;
        var materials = [];
        var geometry = new THREE.BufferGeometry();
        var vertices = [];
        var textureLoader = new THREE.TextureLoader();
        var sprite1 = textureLoader.load("img/particle-a.png");
        var sprite2 = textureLoader.load("img/particle-a.png");
        var sprite3 = textureLoader.load("img/particle-a.png");
        var sprite4 = textureLoader.load("img/particle-a.png");
        var sprite5 = textureLoader.load("img/particle-a.png");
        for (var i = 0; i < 1000; i++) {
            var x = Math.random() * 2000 - 1000;
            var y = Math.random() * 2000 - 1000;
            var z = Math.random() * 2000 - 1000;
            vertices.push(x, y, z);
        }
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        parameters = [
            [[1.0, 0.2, 0.5], sprite2, 20 / 5],
            [[0.95, 0.1, 0.5], sprite3, 15 / 5],
            [[0.9, 0.05, 0.5], sprite1, 10 / 5],
            [[0.85, 0, 0.5], sprite5, 8 / 5],
            [[0.8, 0, 0.5], sprite4, 5 / 5]
        ];
        for (var i = 0; i < parameters.length; i++) {
            var color = parameters[i][0];
            var sprite = parameters[i][1];
            var size = parameters[i][2];
            materials[i] = new THREE.PointsMaterial({
                // color: "rgba(255,255,255,0.5)",
                size: size,
                map: sprite,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true,
                blendDstAlpha: 1500
            });
            materials[i].color.setHSL(color[0], color[1], color[2]);
            var particles = new THREE.Points(geometry, materials[i]);
            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;
            this.sceneContainer.scene.add(particles);
        }
    };
    FloatingParticles.prototype.testA = function () {
        var vertices = [];
        for (var i = 0; i < 1000; i++) {
            var x = THREE.MathUtils.randFloatSpread(200);
            var y = THREE.MathUtils.randFloatSpread(200);
            var z = THREE.MathUtils.randFloatSpread(200);
            vertices.push(x, y, z);
        }
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        var particleTexture = new THREE.TextureLoader().load("img/particle-a.png");
        var material = new THREE.PointsMaterial({
            color: new THREE.Color("rgba(255,255,255,0.5)"),
            map: particleTexture,
            transparent: true,
            depthTest: false
            //   alphaTest: 0.5
            //   alphaToCoverage: true,
            //   transmission: 1,
            //   thickness: 0.2,
            //   roughness: 0,
            //   metalness: 1,
            //   blendDstAlpha: 5
        });
        // const material = new THREE.MeshPhongMaterial({
        //   //   color: new THREE.Color("rgba(255,255,255,0.5)"),
        //   color: 0xffffff,
        //   map: particleTexture,
        //   transparent: true,
        //   alphaTest: 0.5
        // });
        var points = new THREE.Points(geometry, material);
        this.sceneContainer.scene.add(points);
    };
    return FloatingParticles;
}());
exports.FloatingParticles = FloatingParticles;
//# sourceMappingURL=FloatingParticles.js.map