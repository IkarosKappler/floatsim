"use strict";
/**
 * This shader might need some rebuild in the future:
 *  - This contains a re-implementation of the fog (exp2) shader
 *  - no lights are recognized right now
 *
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
var caustic_shader_material_glsl_1 = require("./shaders/caustic_shader_material.glsl");
var CausticShaderMaterial = /** @class */ (function () {
    function CausticShaderMaterial(baseTexture) {
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
        // TODO: FIX THIS TYPE!!!
        var dTex = new THREE.DataTexture(baseTexture.imageData, baseTexture.imageCanvas.width, baseTexture.imageCanvas.height, THREE.RGBAFormat);
        dTex.needsUpdate = true;
        // const commonChunk = THREE.ShaderChunk.common;
        // const fogParsFrag = THREE.ShaderChunk.fog_pars_fragment;
        // const fogFrag = THREE.ShaderChunk.fog_fragment;
        // const fogParsVert = THREE.ShaderChunk.fog_pars_vertex;
        // const fogVert = THREE.ShaderChunk.fog_vertex;
        // const shadowVert = THREE.ShaderChunk.shadow_vert;
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
            // THREE.UniformsLib.fog,
            // THREE.UniformsLib.lights,
            {
                // Fog shader
                // TODO: take initial fog color from FogHandler?
                fogColor: { type: "t", value: new THREE.Color(0x021a38) },
                vFogDepth: { type: "f", value: 0.0021 },
                fogDensity: { type: "f", value: 0.0021 },
                // Caustic shader
                u_zoom: { type: "f", value: worldWidthSegments * 0.000025 },
                u_speed: { type: "f", value: 0.4 },
                u_bright: { type: "f", value: 32.0 },
                u_intensity: { type: "f", value: 0.5 },
                u_time: { type: "f", value: 0.0 },
                u_texture: { type: "t", value: dTex },
                // u_effect_color: { type: "t", value: new THREE.Vector4(0.19, 0.86, 0.86, 1.0) }
                u_effect_color: { type: "t", value: new THREE.Vector4(0.5, 0.85, 0.95) }
            }
        ]);
        this.waterMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: caustic_shader_material_glsl_1.vertex,
            fragmentShader: caustic_shader_material_glsl_1.fragment,
            fog: true,
            transparent: false,
            alphaToCoverage: false // true
        });
    }
    CausticShaderMaterial.prototype.update = function (elapsedTime, fogColor) {
        this.waterMaterial.uniforms.u_time.value = elapsedTime;
        this.waterMaterial.uniforms.fogColor.value = fogColor;
        this.waterMaterial.uniformsNeedUpdate = true;
        this.loopNumber++;
    };
    return CausticShaderMaterial;
}());
exports.CausticShaderMaterial = CausticShaderMaterial;
//# sourceMappingURL=CausticShaderMaterial.js.map