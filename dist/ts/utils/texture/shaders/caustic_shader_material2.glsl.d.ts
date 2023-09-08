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
export declare const Caustic_Shader2: {
    fragment: string;
    fragment_pars: string;
    vertex: string;
    vertex_pars: string;
};
