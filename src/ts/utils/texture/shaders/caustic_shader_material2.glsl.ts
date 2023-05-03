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

const vertex_pars = /* glsl */ `
        // varying vec2 vUv; 
        varying vec3 vposition;
`;

const vertex = /* glsl */ `
        // varying vec2 vUv; 
        // varying vec3 vposition;

        // void main() {
            // This is just the local position.
            vUv = uv; // position;
            // This is the global position in the world.
            vposition = (modelMatrix * vec4(position, 1.0)).xyz;

            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition; 
        // }
`;

const fragment_pars = /* glsl */ `

        // #define FOG_EXP2 1

        // Scales the effect
        uniform float u_zoom;
        // The effect speed
        uniform float u_speed;
        // General brightness
        uniform float u_bright;
        // Intensity, like the maximal alpha value of the effect
        uniform float u_intensity;
        // The current shader animation time frame
        uniform float u_time;
        // The underlying texture to use
        uniform sampler2D u_texture;
        // The effect color on its peak brightness value
        uniform vec4 u_effect_color;

        // ### USE FOG 
        // uniform vec3 fogColor;
        // varying float vFogDepth;
        // #ifdef FOG_EXP2
        //    uniform float fogDensity;
        // #else
        //    uniform float fogNear;
        //    uniform float fogFar;
        // #endif

        // varying vec2 vUv;
        varying vec3 vposition;
`;

const fragment = /* glsl */ `

        // #define FOG_EXP2 1

        // Scales the effect
        // uniform float u_zoom;
        // The effect speed
        // uniform float u_speed;
        // General brightness
        // uniform float u_bright;
        // Intensity, like the maximal alpha value of the effect
        // uniform float u_intensity;
        // The current shader animation time frame
        // uniform float u_time;
        // The underlying texture to use
        // uniform sampler2D u_texture;
        // The effect color on its peak brightness value
        // uniform vec4 u_effect_color;

        // ### USE FOG 
        // uniform vec3 fogColor;
        // varying float vFogDepth;
        // #ifdef FOG_EXP2
        //    uniform float fogDensity;
        // #else
        //     uniform float fogNear;
        //    uniform float fogFar;
        // #endif

        // varying vec2 vUv;
        // varying vec3 vposition;


        // void main() {

            // uncoment when using real texture
            // vec4 texture_color = texture2D(u_texture, vUv.xy);
            // Re-use fragment color from shader pipeline
            vec4 texture_color = gl_FragColor;
            vec4 k = vec4(u_time)*u_speed;
            // Use the xz-coordinated to view from top
            k.xy = vec2(vposition.x, vposition.z) * u_zoom;
            vec3 factors = vec3(1.0,1.0,1.0);
            float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*factors.x*0.5));
            float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*factors.y*0.2));
            float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*factors.z*0.5));
            gl_FragColor = vec4 (pow(min(min(val1,val2),val3), 8.0) * u_bright)+texture_color;
            float brightValue = pow(min(min(val1,val2),val3), 8.0) * u_bright;
            gl_FragColor = texture_color + (u_effect_color-texture_color) * min(u_intensity,brightValue);
            // -- <fog_fragment>
            // Note: fogFactor is here taken from the underlying shader. No need to re-define it here
            // float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
            gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
        // }
`;

export const Caustic_Shader2 = {
  fragment,
  fragment_pars,
  vertex,
  vertex_pars
};
