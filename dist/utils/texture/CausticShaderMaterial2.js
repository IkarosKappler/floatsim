"use strict";
/**
 * This shader might need some rebuild in the future:
 *  - This contains a re-implementation of the fog (exp2) shader
 *  - no lights are recognized right now
 *
 * @date     2023-03-20
 * @modified 2023-05-03 Refactored to a new class that extends MeshBasicMaterial.
 * @author   Ikaros Kappler
 * @version  1.1.0
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
exports.CausticShaderMaterial2 = void 0;
var THREE = __importStar(require("three"));
var caustic_shader_material2_glsl_1 = require("./shaders/caustic_shader_material2.glsl");
var CausticShaderMaterial2 = /** @class */ (function () {
    function CausticShaderMaterial2(baseTexture) {
        var _this = this;
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
        var uniforms = {
            // Define uniforms according to my custom-shader-2.
            u_zoom: { type: "f", value: worldWidthSegments * 0.000025 },
            u_speed: { type: "f", value: 0.4 },
            u_bright: { type: "f", value: 32.0 },
            u_intensity: { type: "f", value: 0.5 },
            u_time: { type: "f", value: 0 },
            // Is not used by my shader anymore (used in MeshBasicMaterial instead)
            //   u_texture: { type: "t", value: dTex },
            u_effect_color: { type: "t", value: new THREE.Vector4(0.29, 0.75, 0.89) }
        };
        this.waterMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            fog: true,
            map: dTex
        });
        // How to pass uniforms to my custom shader?
        //    See https://medium.com/@pailhead011/extending-three-js-materials-with-glsl-78ea7bbb9270
        this.waterMaterial.userData.myUniforms = uniforms;
        this.waterMaterial.onBeforeCompile = function (shader, renderer) {
            //   console.log("onBeforeCompile");
            //   console.log(shader.fragmentShader);
            //   console.log(shader.vertexShader);
            // Pass my uniforms to the shader by reference (!)
            //    this will make them accessible and changeable later.
            for (var _i = 0, _a = Object.entries(_this.waterMaterial.userData.myUniforms); _i < _a.length; _i++) {
                var entry = _a[_i];
                var uniformName = entry[0];
                var uniformValue = entry[1];
                shader.uniforms[uniformName] = uniformValue;
            }
            // Compare to:
            //    https://threejs.org/examples/webgl_materials_modified
            shader.fragmentShader = shader.fragmentShader
                .replace("#include <clipping_planes_pars_fragment>", ["#include <clipping_planes_pars_fragment>", caustic_shader_material2_glsl_1.Caustic_Shader2.fragment_pars].join("\n"))
                .replace("#include <dithering_fragment>", ["#include <dithering_fragment>", caustic_shader_material2_glsl_1.Caustic_Shader2.fragment].join("\n"));
            shader.vertexShader = shader.vertexShader
                .replace("#include <clipping_planes_pars_vertex>", ["#include <clipping_planes_pars_vertex>", caustic_shader_material2_glsl_1.Caustic_Shader2.vertex_pars].join("\n"))
                .replace("#include <fog_vertex>", ["#include <fog_vertex>", caustic_shader_material2_glsl_1.Caustic_Shader2.vertex].join("\n"));
        };
    }
    CausticShaderMaterial2.prototype.update = function (elapsedTime, fogColor) {
        this.waterMaterial.userData.myUniforms.u_time.value = elapsedTime;
        // this.waterMaterial.uniformsNeedUpdate = true;
        // this.waterMaterial.needsUpdate = true;
        this.loopNumber++;
    };
    return CausticShaderMaterial2;
}());
exports.CausticShaderMaterial2 = CausticShaderMaterial2;
//# sourceMappingURL=CausticShaderMaterial2.js.map