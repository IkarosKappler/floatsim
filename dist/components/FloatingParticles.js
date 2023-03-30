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
var _VS = "\n  varying vec2 vUv;\n  varying float distRatio;\n  varying float distance;\n  uniform float pointMultiplier;\n  attribute float size;\n\n  void main() {\n    float maxDistance = 10.0;\n    vUv = uv;\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    // gl_PointSize = 0.0001 * size * pointMultiplier / gl_Position.w;\n    // gl_PointSize *= ( 4.0 / -mvPosition.z );\n    // gl_PointSize = 8.0;\n\n    // float distRatio = smoothstep(25., 75., -mvPosition.z);\n    // float distRatio = 1.0 / - mvPosition.z;\n    // if( distRatio < 0.5 ) discard;\n    // gl_PointSize = size * (1. + (1. - distRatio) * 5.);\n    // gl_PointSize = size * distRatio;\n\n    distance = mvPosition.z;\n    // distRatio = smoothstep(25., 75., -mvPosition.z);\n    // gl_PointSize = size * (1. + (1. - distRatio) * 5.);\n    // distRatio = 4.0 - (maxDistance / (distance));\n    // gl_PointSize = size  * distRatio;\n\n    gl_PointSize = size; // ( size * (maxDistance/mvPosition.z) );\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n  }";
var _FS = "\n  varying vec2 vUv;\n  uniform sampler2D velTex;\n  uniform sampler2D posTex;\n  varying float distRatio;\n  varying float distance;\n\n  void main() {\n    // vec3 velocity = texture2D(velTex, vUv).rgb;\n    vec3 pos = texture2D(posTex, vUv).rgb;\n\n    vec2 uv = gl_PointCoord - 0.5;\n    float a = atan(uv.x,uv.y);\n    float r = 3.1415/float(3.);\n    float d1 = cos(floor(.5+a/r)*r-a)*length(uv) * 2.;\n    \n    float d2 = length(uv);\n    \n    float d = mix(d1, d2, distRatio);\n    \n    // if(d > 0.5) discard;\n    // if( distance > 200.0 ) discard;\n    \n    gl_FragColor = vec4(1.0,1.0,1.0,1.0); // vec4( pos, 1.0 );\n  }";
var FloatingParticles = /** @class */ (function () {
    function FloatingParticles(sceneContainer) {
        this.sceneContainer = sceneContainer;
        console.log("THREE.ShaderChunk.map_particle_fragment", THREE.ShaderChunk.map_particle_pars_fragment);
        this.init();
    }
    FloatingParticles.prototype.init = function () {
        // Found at
        //    https://discourse.threejs.org/t/function-to-extend-materials/7882
        var baseMaterial = new THREE.PointsMaterial();
        // BEGIN extend-material
        // END extend-material
        var vertices = [];
        for (var i = 0; i < 1000; i++) {
            var x = THREE.MathUtils.randFloatSpread(1000);
            var y = THREE.MathUtils.randFloatSpread(1000);
            var z = THREE.MathUtils.randFloatSpread(1000);
            vertices.push(x, y, z);
        }
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        var particleTexture = new THREE.TextureLoader().load("img/particle-a-256.png");
        var material = new THREE.PointsMaterial({
            color: new THREE.Color("rgba(255,255,255,0.2)"),
            map: particleTexture,
            transparent: true,
            size: 5,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            blendDstAlpha: 1500
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