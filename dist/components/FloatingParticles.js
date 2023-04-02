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
var distance_fragment = /* glsl */ "\n  // 'distance' void main() {\n    vec2 rotated = vec2(cos(vRotation) * (gl_PointCoord.x - 0.5) + 0.5, sin(vRotation) * (gl_PointCoord.y - 0.5) + 0.5);\n\n    // Re-read from texture and apply rotation\n    float mid = 0.5;\n    uv = vec2(\n      cos(vRotation) * (uv.x - mid) + sin(vRotation) * (uv.y - mid) + mid,\n      cos(vRotation) * (uv.y - mid) - sin(vRotation) * (uv.x - mid) + mid\n    );\n    gl_FragColor = texture2D( map, uv ) * vColor; // vec4( vColor.rgb, 1.0 );\n\n    float minAlpha = 0.0;\n    float maxAlpha = 0.25;\n    \n    // gl_FragColor.a = mix( gl_FragColor.a, 0.0, particleDistFactor );\n    gl_FragColor.a = minAlpha + (maxAlpha-minAlpha)*mix( gl_FragColor.a, 0.0, particleDistFactor );\n\n  // }\n  ";
var FloatingParticles = /** @class */ (function () {
    function FloatingParticles(sceneContainer, texturePath) {
        this.sceneContainer = sceneContainer;
        this.texturePath = texturePath;
        console.log("THREE.ShaderChunk.map_particle_fragment", THREE.ShaderChunk.map_particle_pars_fragment);
        this.init();
    }
    FloatingParticles.prototype.init = function () {
        // Inspired by
        //    https://discourse.threejs.org/t/function-to-extend-materials/7882
        var positions = [];
        var colors = [];
        var sizes = [];
        var angles = [];
        for (var i = 0; i < 10000; i++) {
            var x = THREE.MathUtils.randFloatSpread(1000);
            var y = THREE.MathUtils.randFloatSpread(1000);
            var z = THREE.MathUtils.randFloatSpread(1000);
            var color = new THREE.Color(128 + Math.floor(Math.random() * 127), 128 + Math.floor(Math.random() * 127), 128 + Math.floor(Math.random() * 127));
            var alpha = 0.5 + Math.random() * 0.5;
            var size = Math.random() * 5.0;
            var angle = Math.random() * Math.PI * 2.0;
            positions.push(x, y, z);
            colors.push(color.r, color.g, color.b, alpha);
            sizes.push(size);
            angles.push(angle);
        }
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 4));
        geometry.setAttribute("aRotation", new THREE.Float32BufferAttribute(angles, 1));
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.aSize.needsUpdate = true;
        geometry.attributes.aColor.needsUpdate = true;
        geometry.attributes.aRotation.needsUpdate = true;
        var particleTexture = new THREE.TextureLoader().load(this.texturePath);
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
        var points = new THREE.Points(geometry, material);
        this.sceneContainer.scene.add(points);
    };
    return FloatingParticles;
}());
exports.FloatingParticles = FloatingParticles;
//# sourceMappingURL=FloatingParticles.js.map