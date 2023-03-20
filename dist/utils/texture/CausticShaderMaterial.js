"use strict";
/**
 * @date    2023-03-20
 * @author  Ikaros Kappler
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
exports.CausticShaderMaterial = void 0;
var THREE = __importStar(require("three"));
var vertShader = "\n        varying vec2 vUv; \n        varying vec3 vposition;\n\n        void main() {\n            // This is just the local position.\n            vUv = uv; // position;\n            // This is the global position in the world.\n            vposition = (modelMatrix * vec4(position, 1.0)).xyz;\n\n            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);\n            // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n            gl_Position = projectionMatrix * modelViewPosition; \n        }\n        ";
var fragShader = "\n        uniform float zoom;\n        uniform float speed;\n        uniform float bright;\n        uniform float u_time;\n        uniform sampler2D u_texture;\n\n        varying vec2 vUv;\n        varying vec3 vposition;\n\n        void main()\n        {\n            // uncoment when using real texture\n            vec4 texture_color = texture2D(u_texture, vUv.xy);\n            // vec4 texture_color = vec4(0.192156862745098/2., 0.6627450980392157/2., 0.9333333333333333/2., 1.0);\n\n            vec4 k = vec4(u_time)*speed;\n            // k.xy = vec2(vUv * zoom);\n            // k.xy = vec2(vposition * zoom);\n\n            // Use the xz-coordinated to view from top\n            k.xy = vec2(vposition.x, vposition.z) * zoom;\n\n            float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));\n            float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.2));\n            float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));\n            gl_FragColor = vec4 (pow(min(min(val1,val2),val3), 7.0) * bright)+texture_color;\n            // gl_FragColor = texture_color;\n\n            // vec3 color = 0.5 + 0.5*cos(u_time*speed+vUv.xyx+vec3(0,2,4));\n            // gl_FragColor = vec4(color,1.0);\n        }\n    ";
var CausticShaderMaterial = /** @class */ (function () {
    function CausticShaderMaterial(terrainData, baseTexture) {
        this.loopNumber = 0;
        //---BEGIN--- Terrain Generation
        var worldWidthSegments = 256;
        var worldDepthSegments = 256;
        var imageData = baseTexture.imageData;
        var buffer = imageData.data.buffer; // ArrayBuffer
        var arrayBuffer = new ArrayBuffer(imageData.data.length);
        var binary = new Uint8Array(arrayBuffer);
        for (var i = 0; i < binary.length; i++) {
            binary[i] = imageData.data[i];
        }
        //   var dTex = new THREE.DataTexture(binary, worldWidthSegments, worldDepthSegments, THREE.RGBAFormat);
        // var dTex = new THREE.DataTexture(baseTexture.imageData, worldWidthSegments, worldDepthSegments, THREE.RGBAFormat);
        // TODO: FIX THIS TYPE!!!
        var dTex = new THREE.DataTexture(
        // binary, //baseTexture.imageData, // as unknown as BufferSource,
        baseTexture.imageData, worldWidthSegments, worldDepthSegments, THREE.RGBAFormat);
        dTex.needsUpdate = true;
        //   uniform float zoom = 127.0; // 7f;
        //   uniform float speed = .8;
        //   uniform float bright = 63.0; // 3f;
        var uniforms = {
            zoom: { type: "f", value: 0.5 },
            speed: { type: "f", value: 0.8 },
            bright: { type: "f", value: 32.0 },
            u_time: { type: "f", value: 0.0 },
            u_texture: { type: "t", value: dTex }
        };
        this.waterMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertShader,
            fragmentShader: fragShader
        });
        // TODO: is this still required?
        // this.waterMaterial.defines = { "USE_UV": "" };
    }
    CausticShaderMaterial.prototype.update = function (elapsedTime) {
        // self.cube.material.uniforms.u_time.value = elapsedTime; // _self.clock.getElapsedTime();
        this.waterMaterial.uniforms.u_time.value = elapsedTime; // _self.clock.getElapsedTime();
        if (this.loopNumber < 10) {
            console.log("waterMaterial.uniforms", this.loopNumber, this.waterMaterial.uniforms.u_time.value);
        }
        this.waterMaterial.uniformsNeedUpdate = true;
        this.loopNumber++;
    };
    return CausticShaderMaterial;
}());
exports.CausticShaderMaterial = CausticShaderMaterial;
//# sourceMappingURL=CausticShaderMaterial.js.map