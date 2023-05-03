"use strict";
/**
 * This is the second version of my caustic shader.
 * It is split into parts with the code for main function(s) and parts
 * with the uniforms/varying definitions.
 *
 * This makes it easy to combine it with existing shaders from THREEJS
 * by using the onCompile method with text replacement.
 *
 * @author  Ikaros Kappler
 * @date    2023-05-03
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Caustic_Shader2 = void 0;
var vertex_pars = /* glsl */ "\n        // varying vec2 vUv; \n        varying vec3 vposition;\n";
var vertex = /* glsl */ "\n        // varying vec2 vUv; \n        // varying vec3 vposition;\n\n        // void main() {\n            // This is just the local position.\n            vUv = uv; // position;\n            // This is the global position in the world.\n            vposition = (modelMatrix * vec4(position, 1.0)).xyz;\n\n            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);\n            gl_Position = projectionMatrix * modelViewPosition; \n        // }\n";
var fragment_pars = /* glsl */ "\n\n        // #define FOG_EXP2 1\n\n        // Scales the effect\n        uniform float u_zoom;\n        // The effect speed\n        uniform float u_speed;\n        // General brightness\n        uniform float u_bright;\n        // Intensity, like the maximal alpha value of the effect\n        uniform float u_intensity;\n        // The current shader animation time frame\n        uniform float u_time;\n        // The underlying texture to use\n        uniform sampler2D u_texture;\n        // The effect color on its peak brightness value\n        uniform vec4 u_effect_color;\n\n        // ### USE FOG \n        // uniform vec3 fogColor;\n        // varying float vFogDepth;\n        // #ifdef FOG_EXP2\n        //    uniform float fogDensity;\n        // #else\n        //    uniform float fogNear;\n        //    uniform float fogFar;\n        // #endif\n\n        // varying vec2 vUv;\n        varying vec3 vposition;\n";
var fragment = /* glsl */ "\n\n        // #define FOG_EXP2 1\n\n        // Scales the effect\n        // uniform float u_zoom;\n        // The effect speed\n        // uniform float u_speed;\n        // General brightness\n        // uniform float u_bright;\n        // Intensity, like the maximal alpha value of the effect\n        // uniform float u_intensity;\n        // The current shader animation time frame\n        // uniform float u_time;\n        // The underlying texture to use\n        // uniform sampler2D u_texture;\n        // The effect color on its peak brightness value\n        // uniform vec4 u_effect_color;\n\n        // ### USE FOG \n        // uniform vec3 fogColor;\n        // varying float vFogDepth;\n        // #ifdef FOG_EXP2\n        //    uniform float fogDensity;\n        // #else\n        //     uniform float fogNear;\n        //    uniform float fogFar;\n        // #endif\n\n        // varying vec2 vUv;\n        // varying vec3 vposition;\n\n\n        // void main() {\n\n            // uncoment when using real texture\n            // vec4 texture_color = texture2D(u_texture, vUv.xy);\n            // Re-use fragment color from shader pipeline\n            vec4 texture_color = gl_FragColor;\n            vec4 k = vec4(u_time)*u_speed;\n            // Use the xz-coordinated to view from top\n            k.xy = vec2(vposition.x, vposition.z) * u_zoom;\n            vec3 factors = vec3(1.0,1.0,1.0);\n            float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*factors.x*0.5));\n            float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*factors.y*0.2));\n            float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*factors.z*0.5));\n            gl_FragColor = vec4 (pow(min(min(val1,val2),val3), 8.0) * u_bright)+texture_color;\n            float brightValue = pow(min(min(val1,val2),val3), 8.0) * u_bright;\n            gl_FragColor = texture_color + (u_effect_color-texture_color) * min(u_intensity,brightValue);\n            // -- <fog_fragment>\n            // Note: fogFactor is here taken from the underlying shader. No need to re-define it here\n            // float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );\n            gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n        // }\n";
exports.Caustic_Shader2 = {
    fragment: fragment,
    fragment_pars: fragment_pars,
    vertex: vertex,
    vertex_pars: vertex_pars
};
//# sourceMappingURL=caustic_shader_material2.glsl.js.map