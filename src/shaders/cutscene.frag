#define FOG_EXP2 1

// The shutter color for opaque pixels
uniform vec3 u_shutter_color;

uniform int u_canvas_width; // = 100.0;
uniform int u_canvas_height; //  = 100.0;

// Specifies if the texture should be used
uniform bool u_use_texture;

// The underlying texture to use
uniform sampler2D u_texture;

// The shutter amount in 0.0 (close) to 1.0 (open)
uniform float u_shutter_amount;

varying vec2 vUv;
varying vec3 vposition;


void main()
{

    // uncoment when using real texture
    // vec4 texture_color = texture2D(u_texture, vUv.xy);

    // TODO: pass pixel size as uniforms
    float f_canvas_width = float(u_canvas_width); // 100.0;
    float f_canvas_height = float(u_canvas_height); // 100.0;
    float rowOffsetFactor = 2.0;
    vec4 light_color = vec4(1.0, 1.0, 1.0, 0.0);
    if( u_use_texture ) {
        light_color = texture2D(u_texture, vUv.xy);
    }
    // vec4 dark_color = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 dark_color = vec4( u_shutter_color.rgb, 1.0 );

    // Please use full integer values here, no fractions
    float f_shutter_width = 5.0;
    float f_shutter_height = 5.0;
    // 25
    float f_shutter_square = f_shutter_width*f_shutter_height;

    // A value between 0.0 ... height
    float offsetY = ( mod( round(vUv.y*f_canvas_height), f_shutter_height) );
    // A value between 0.0 ... width
    float offsetX = ( mod( round(vUv.x*f_canvas_width - rowOffsetFactor*offsetY), f_shutter_width) );

    // Between 0.0 and f_shutter_square (exclusive)
    float relX = ( offsetY * f_shutter_width + (offsetX) );

    // Apply a threshhold
    //   * all elements below the threshold (shutter_amount) are opaque
    //   * all elements above the threshold (shutter_amount) are transparent
    float opacity = floor( (relX+1.0) / ((f_shutter_square)*(u_shutter_amount)+1.0) );
    opacity = clamp( opacity, 0.0, 1.0);

    gl_FragColor = mix( light_color, dark_color, opacity );
}