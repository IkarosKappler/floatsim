export const vertex = /* glsl */ `
    // -- <fog_pars_vertex>
    // uniform vec3 fogColor;
    // varying float vFogDepth;
    // uniform float fogDensity;
    varying float vFogDepth;
    

    varying vec2 vUv; 
    varying vec3 vposition;
    varying vec4 mvPosition;

    void main() {
    
    
    // This is just the local position.
    vUv = uv; // position;
    // This is the global position in the world.
    vposition = (modelMatrix * vec4(position, 1.0)).xyz;
    
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * modelViewPosition; 


    // General THREEJS varying
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0);

    // # --- <fog_vertex>
    vFogDepth = - mvPosition.z;
    }
`;

export const fragment = /* glsl */ `
    // -- <fog_pars_fragment>
    uniform vec3 fogColor;
    varying float vFogDepth;
    uniform float fogDensity;
    

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
    
    
    varying vec2 vUv;
    varying vec3 vposition;
    varying vec4 mvPosition;
    
    void main()
    {
        // uncoment when using real texture
        vec4 texture_color = texture2D(u_texture, vUv.xy);
        // vec4 effect_color = vec4(0.19, 0.86, 0.86, 1.0);
        // vec4 texture_color = vec4(0.19, 0.86, 0.86, 0.0);
        
        
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
        // // gl_FragColor = texture_color + (u_effect_color-texture_color) * min(u_intensity,brightValue);
        // gl_FragColor.rgb = gl_FragColor.xyz;

        // -- <fog_fragment>
        float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );

        // // Dither
        // gl_FragColor.rgb = dithering( gl_FragColor.rgb );
    }
`;
