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
var distance_pars_vertex = /* glsl */ "\n  varying vec2 vUv;\n  varying float distance;\n  uniform float pointMultiplier;\n  varying float particleDistFactor;\n\n  attribute float aRotation;\n  attribute float aSize;\n  attribute vec4 aColor;\n  varying float vRotation;\n  varying vec4 vColor;\n  ";
var distance_vertex = /* glsl */ "\n  // 'distance' void main() {\n    float maxDistance = 10.0;\n    vUv = uv;\n\n    float vParticleDensity = 0.0084;\n    distance = - mvPosition.z;\n    particleDistFactor = 1.0 - exp( - vParticleDensity * vParticleDensity * distance * distance );\n\n    vRotation = aRotation;\n    vColor = aColor;\n    gl_PointSize = aSize / particleDistFactor;\n  // }\n  ";
var distance_pars_fragment = /* glsl */ "\n  varying vec2 vUv;\n  // uniform sampler2D velTex;\n  uniform sampler2D posTex; // TOTO: rename to tDiffuse\n  varying float distance;\n  varying float particleDistFactor;\n\n  varying float vRotation;\n  varying vec4 vColor;\n";
var distance_fragment = /* glsl */ "\n  // 'distance' void main() {\n    vec2 rotated = vec2(cos(vRotation) * (gl_PointCoord.x - 0.5) + 0.5, sin(vRotation) * (gl_PointCoord.y - 0.5) + 0.5);\n\n    // Re-read from texture and apply rotation\n    float mid = 0.5;\n    uv = vec2(\n      cos(vRotation) * (uv.x - mid) + sin(vRotation) * (uv.y - mid) + mid,\n      cos(vRotation) * (uv.y - mid) - sin(vRotation) * (uv.x - mid) + mid\n    );\n    gl_FragColor = texture2D( map, uv ) * vColor; // vec4( vColor.rgb, 1.0 );\n\n    float minAlphaModifyer = 0.0;\n    float maxAlphaModifyer = 0.25;\n    \n    // gl_FragColor.a = mix( gl_FragColor.a, 0.0, particleDistFactor );\n    gl_FragColor.a = minAlphaModifyer + (maxAlphaModifyer-minAlphaModifyer)*mix( gl_FragColor.a, 0.0, particleDistFactor );\n\n  // }\n  ";
var FloatingParticles = /** @class */ (function () {
    function FloatingParticles(sceneContainer, texturePath, containingBox, particleDensity) {
        // } initialPosition: TripleImmutable<number>) {
        this.sceneContainer = sceneContainer;
        // this.texturePath = texturePath;
        this.containingBox = containingBox;
        console.log("THREE.ShaderChunk.map_particle_fragment", THREE.ShaderChunk.map_particle_pars_fragment);
        this.geometry = new THREE.BufferGeometry();
        this.particles = [];
        this.init(texturePath, particleDensity); // initialPosition);
    }
    FloatingParticles.prototype.init = function (texturePath, particleDensity) {
        // initialPosition: TripleImmutable<number>) {
        // Inspired by
        //    https://discourse.threejs.org/t/function-to-extend-materials/7882
        var positions = [];
        var colors = [];
        var sizes = [];
        var angles = [];
        // Compute particle count from particle density and size
        var boundingBoxSize = new THREE.Vector3();
        this.containingBox.getSize(boundingBoxSize);
        // Limit the particle count to one million
        var particleCount = Math.min(boundingBoxSize.x * boundingBoxSize.y * boundingBoxSize.z * particleDensity, 1000000);
        console.log("particleCount", particleCount);
        for (var i = 0; i < particleCount; i++) {
            // const x = initialPosition.x + THREE.MathUtils.randFloatSpread(1000);
            // const y = initialPosition.y + THREE.MathUtils.randFloatSpread(1000);
            // const z = initialPosition.z + THREE.MathUtils.randFloatSpread(1000);
            var x = this.containingBox.min.x + Math.random() * boundingBoxSize.x;
            var y = this.containingBox.min.y + Math.random() * boundingBoxSize.y;
            var z = this.containingBox.min.z + Math.random() * boundingBoxSize.z;
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
                velocity: new THREE.Vector3(1.0 + Math.random() * 2, 0.0, 1.0 + Math.random() * 2)
            });
        }
        // this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
        this.geometry.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 4));
        this.geometry.setAttribute("aRotation", new THREE.Float32BufferAttribute(angles, 1));
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.aSize.needsUpdate = true;
        this.geometry.attributes.aColor.needsUpdate = true;
        this.geometry.attributes.aRotation.needsUpdate = true;
        var particleTexture = new THREE.TextureLoader().load(texturePath);
        var material = new THREE.PointsMaterial({
            color: new THREE.Color("rgba(255,255,255,0.2)"),
            map: particleTexture,
            transparent: true,
            // size: 5,
            // blending: THREE.AdditiveBlending,
            depthTest: false,
            blendDstAlpha: 1500
        });
        material.onBeforeCompile = function (shader, renderer) {
            console.log("onBeforeCompile");
            console.log(shader.fragmentShader);
            console.log(shader.vertexShader);
            shader.fragmentShader = shader.fragmentShader
                .replace("#include <clipping_planes_pars_fragment>", ["#include <clipping_planes_pars_fragment>", distance_pars_fragment].join("\n"))
                .replace("#include <premultiplied_alpha_fragment>", ["#include <premultiplied_alpha_fragment>", distance_fragment].join("\n"));
            shader.vertexShader = shader.vertexShader
                .replace("#include <clipping_planes_pars_vertex>", ["#include <clipping_planes_pars_vertex>", distance_pars_vertex].join("\n"))
                .replace("#include <fog_vertex>", ["#include <fog_vertex>", distance_vertex].join("\n"));
        };
        // https://stackoverflow.com/questions/67832321/how-to-reuse-the-three-js-fragment-shader-output
        var points = new THREE.Points(this.geometry, material);
        this.sceneContainer.scene.add(points);
    };
    // @implement UpdateableComponent
    FloatingParticles.prototype.update = function (elapsedTime, _deltaTime) {
        var positions = [];
        for (var i = 0; i < this.particles.length; i++) {
            positions.push(this.particles[i].position.x + this.particles[i].velocity.x * elapsedTime);
            positions.push(this.particles[i].position.y + this.particles[i].velocity.y * elapsedTime);
            positions.push(this.particles[i].position.z + this.particles[i].velocity.z * elapsedTime);
        }
        this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        this.geometry.attributes.position.needsUpdate = true;
    };
    return FloatingParticles;
}());
exports.FloatingParticles = FloatingParticles;
//# sourceMappingURL=FloatingParticles.js.map