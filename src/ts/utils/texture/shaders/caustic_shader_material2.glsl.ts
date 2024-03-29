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

        // Source for Hue/Brightness/Saturation in GLSL
        //    https://gamedev.stackexchange.com/questions/59797/glsl-shader-change-hue-saturation-brightness
        //    http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
        vec3 rgb2hsv(vec3 c)
        {
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }

        vec3 hsv2rgb(vec3 c)
        {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
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
            // gl_FragColor = texture_color + (u_effect_color-texture_color) * min(u_intensity,brightValue);

            // vec3 vHSV = vec3(1,1,1);
            // vec3 fragRGB = texture_color.rgb;
            // vec3 fragHSV = rgb2hsv(fragRGB).xyz;
            // fragHSV.x += vHSV.x / 360.0;
            // fragHSV.yz *= vHSV.yz;
            // fragHSV.xyz = mod(fragHSV.xyz, 1.0);
            // fragRGB = hsv2rgb(fragHSV);
            // gl_FragColor = vec4(fragRGB, texture_color.w);

            // vec3 vHSV = vec3(1.0,1.0,1.0);
            // TODO: convert this to a VARYING
            vec3 vHSV = rgb2hsv(u_effect_color.rgb).rgb;
            vec3 fragRGB = texture_color.rgb;
            // vec3 fragRGB = mix( texture_color.rgb, u_effect_color.rgb, u_bright*0.25 );
            // vec3 fragRGB = (texture_color + (u_effect_color-texture_color) * min(u_intensity,brightValue)).rgb;
            vec3 fragHSV = rgb2hsv(fragRGB).xyz;
            // fragHSV.x += mod(min(u_intensity,brightValue), 360.0);
            fragHSV.z += mod( min(u_intensity,brightValue), 1.0);
            // fragHSV.x += vHSV.x / 360.0;
            // fragHSV.yz *= vHSV.yz;
            fragHSV.xyz = mod(fragHSV.xyz, 1.0);
            fragRGB = hsv2rgb(fragHSV);
            gl_FragColor = vec4(fragRGB, texture_color.w);
            
            // gl_FragColor.rgb = mix( gl_FragColor.rgb, u_effect_color.rgb, brightValue*u_intensity*0.25 );
            // Try to mix in the effect color.
            gl_FragColor.rgb += (u_effect_color.rgb * (1.0- brightValue*u_intensity)) * 0.15;

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
