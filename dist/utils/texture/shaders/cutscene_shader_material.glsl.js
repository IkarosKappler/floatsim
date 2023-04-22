"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cutscene_Shader = void 0;
var vertex = /* glsl */ "\n    varying vec2 vUv; \n    varying vec3 vposition;\n\n    void main() {\n        // This is just the local position.\n        vUv = uv; // position;\n        // This is the global position in the world.\n        vposition = (modelMatrix * vec4(position, 1.0)).xyz;\n\n        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);\n        gl_Position = projectionMatrix * modelViewPosition; \n    }\n    ";
var fragment = /* glsl */ "\n    // The shutter color for opaque pixels\n    uniform vec3 u_shutter_color;\n\n    uniform int u_canvas_width; // = 100.0;\n    uniform int u_canvas_height; //  = 100.0;\n\n    // Specifies if the texture should be used\n    uniform bool u_use_texture;\n\n    // Specifies the directions\n    uniform bool u_direction_h_ltr;\n    uniform bool u_direction_v_ttb;\n\n    // The underlying texture to use\n    uniform sampler2D u_texture;\n\n    // The shutter amount in 0.0 (close) to 1.0 (open)\n    uniform float u_shutter_amount;\n\n    varying vec2 vUv;\n    varying vec3 vposition;\n\n\n    void main()\n    {\n\n        // uncoment when using real texture\n        // vec4 texture_color = texture2D(u_texture, vUv.xy);\n\n        // TODO: pass pixel size as uniforms\n        float f_canvas_width = float(u_canvas_width); // 100.0;\n        float f_canvas_height = float(u_canvas_height); // 100.0;\n        float rowOffsetFactor = 2.0;\n        vec4 light_color = vec4(1.0, 1.0, 1.0, 0.0);\n        if( u_use_texture ) {\n            light_color = texture2D(u_texture, vUv.xy);\n        }\n        // vec4 dark_color = vec4(0.0, 0.0, 0.0, 1.0);\n        vec4 dark_color = vec4( u_shutter_color.rgb, 1.0 );\n\n        // Please use full integer values here, no fractions\n        float f_shutter_width = 5.0;\n        float f_shutter_height = 5.0;\n        // 25\n        float f_shutter_square = f_shutter_width*f_shutter_height;\n\n        // Decide if left-to-right/right-to-left and top-down/bottom-up\n        float f_ux, f_uy;\n        if( u_direction_h_ltr ) {\n            f_ux = vUv.x;\n        } else {\n            f_ux = 1.0-vUv.x;\n        }\n        if( u_direction_v_ttb ) {\n            f_uy = vUv.y;\n        } else {\n            f_uy = 1.0-vUv.y;\n        }\n\n        // A value between 0.0 ... height\n        float offsetY = ( mod( round(f_uy*f_canvas_height), f_shutter_height) );\n        // A value between 0.0 ... width\n        float offsetX = ( mod( round(f_ux*f_canvas_width - rowOffsetFactor*offsetY), f_shutter_width) );\n\n        // Between 0.0 and f_shutter_square (exclusive)\n        float relX = ( offsetY * f_shutter_width + (offsetX) );\n\n        // Apply a threshhold\n        //   * all elements below the threshold (shutter_amount) are opaque\n        //   * all elements above the threshold (shutter_amount) are transparent\n        float opacity = floor( (relX+1.0) / ((f_shutter_square)*(u_shutter_amount)+1.0) );\n        opacity = clamp( opacity, 0.0, 1.0);\n\n        gl_FragColor = mix( light_color, dark_color, opacity );\n    }\n    ";
exports.Cutscene_Shader = {
    vertex: vertex,
    fragment: fragment
};
//# sourceMappingURL=cutscene_shader_material.glsl.js.map