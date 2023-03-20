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
var vertShader = "\n        // # include <fog_pars_vertex>\n        #include <fog_vertex>\n\n        varying vec2 vUv; \n        varying vec3 vposition;\n\n        void main() {\n\n\n            // This is just the local position.\n            vUv = uv; // position;\n            // This is the global position in the world.\n            vposition = (modelMatrix * vec4(position, 1.0)).xyz;\n\n            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);\n            // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n            gl_Position = projectionMatrix * modelViewPosition; \n        }\n        ";
var fragShader = "\n\n      #include <fog_fragment>\n      // # include <fog_pars_fragment>\n\n      // Scales the effect\n      uniform float u_zoom;\n      // The effect speed\n      uniform float u_speed;\n      // General brightness\n      uniform float u_bright;\n      // Intensity, like the maximal alpha value of the effect\n      uniform float u_intensity;\n      // The current shader animation time frame\n      uniform float u_time;\n      // The underlying texture to use\n      uniform sampler2D u_texture;\n      // The effect color on its peak brightness value\n      uniform vec4 u_effect_color;\n\n\n      varying vec2 vUv;\n      varying vec3 vposition;\n\n      void main()\n      {\n\n          // uncoment when using real texture\n          vec4 texture_color = texture2D(u_texture, vUv.xy);\n          // vec4 effect_color = vec4(0.19, 0.86, 0.86, 1.0);\n\n\n          vec4 k = vec4(u_time)*u_speed;\n\n          // Use the xz-coordinated to view from top\n          k.xy = vec2(vposition.x, vposition.z) * u_zoom;\n          vec3 factors = vec3(1.0,1.0,1.0);\n\n          float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*factors.x*0.5));\n          float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*factors.y*0.2));\n          float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*factors.z*0.5));\n          \n          // gl_FragColor = vec4 (pow(min(min(val1,val2),val3), 8.0) * u_bright)+texture_color;\n          float brightValue = pow(min(min(val1,val2),val3), 8.0) * u_bright;\n\n          // gl_FragColor = texture_color + (effect_color-texture_color) * min(intensity,brightValue);\n          gl_FragColor = texture_color + (u_effect_color-texture_color) * min(u_intensity,brightValue);\n\n      }\n    ";
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
        baseTexture.imageData, baseTexture.imageCanvas.width, //  worldWidthSegments,
        baseTexture.imageCanvas.height, //  worldDepthSegments,
        THREE.RGBAFormat);
        dTex.needsUpdate = true;
        // var uniforms = {
        //   u_zoom: { type: "f", value: worldWidthSegments * 0.00001 }, // 0.05 }, // 127.0 },
        //   u_speed: { type: "f", value: 0.4 },
        //   u_bright: { type: "f", value: 32.0 },
        //   u_intensity: { type: "f", value: 0.5 },
        //   u_time: { type: "f", value: 0.0 },
        //   u_texture: { type: "t", value: dTex }, // , texture: dTex }
        //   u_effect_color: { type: "t", value: new THREE.Vector4(0.19, 0.86, 0.86, 1.0) }
        // };
        var uniforms = THREE.UniformsUtils.merge([
            // THREE.UniformsLib["fog"],
            // THREE.UniformsLib.common,
            // THREE.UniformsLib.specularmap,
            // THREE.UniformsLib.envmap,
            // THREE.UniformsLib.aomap,
            // THREE.UniformsLib.lightmap,
            // THREE.UniformsLib.emissivemap,
            // THREE.UniformsLib.bumpmap,
            // THREE.UniformsLib.normalmap,
            // THREE.UniformsLib.displacementmap,
            // THREE.UniformsLib.gradientmap,
            THREE.UniformsLib.fog,
            // THREE.UniformsLib.lights,
            {
                u_zoom: { type: "f", value: worldWidthSegments * 0.00001 },
                u_speed: { type: "f", value: 0.4 },
                u_bright: { type: "f", value: 32.0 },
                u_intensity: { type: "f", value: 0.5 },
                u_time: { type: "f", value: 0.0 },
                u_texture: { type: "t", value: dTex },
                // u_effect_color: { type: "t", value: new THREE.Vector4(0.19, 0.86, 0.86, 1.0) }
                u_effect_color: { type: "t", value: new THREE.Vector4(0.9, 0.9, 0.9, 1.0) }
            }
        ]);
        this.waterMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertShader,
            fragmentShader: fragShader
            // fog: true,
            // fogColor: new THREE.Color(0x021a38) // TODO: get from fog handler
        });
        // TODO: is this still required?
        // this.waterMaterial.defines = { "USE_UV": "" };
        // --- BEGIN--- MIX IN FOG SHADER
        var commonChunk = THREE.ShaderChunk.common; // ["common"];
        var fogParsFrag = THREE.ShaderChunk.fog_pars_fragment; //["fog_pars_fragment"];
        var fogFrag = THREE.ShaderChunk.fog_fragment; // ["fog_fragment"];
        // const fogFrag = ${THREE.ShaderChunk[ "fog_fragment" ]}
        var fogParsVert = THREE.ShaderChunk.fog_pars_fragment; // ["fog_pars_vertex"];
        var fogVert = THREE.ShaderChunk.fog_pars_fragment; // ["fog_vertex"];
        console.log("fogParsFrag", fogParsFrag);
        console.log("fogFrag", fogFrag);
        console.log("fogParsVert", fogParsVert);
        console.log("fogVert", fogVert);
        // this.waterMaterial.onBeforeCompile = shader => {
        //   shader.vertexShader = shader.vertexShader.replace(`#include <fog_pars_vertex>`, fogParsVert);
        //   shader.vertexShader = shader.vertexShader.replace(`#include <fog_vertex>`, fogVert);
        //   shader.fragmentShader = shader.fragmentShader.replace(`#include <fog_pars_fragment>`, fogParsFrag);
        //   shader.fragmentShader = shader.fragmentShader.replace(`#include <fog_fragment>`, fogFrag);
        // };
        // --- END --- MIX IN FOG SHADER
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