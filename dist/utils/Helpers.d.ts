/**
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-03-26
 */
import * as THREE from "three";
/**
 * Get the CSS colors string with adjustable alpha value.
 * @param {THREE.Color} color
 * @param {number} alpha
 * @returns
 */
export declare const getColorStyle: (color: THREE.RGB, alpha: number) => string;
/**
 * Fetch the SVG at the given path and convert it to a THREE.Texture.
 * @param {string} svgPath
 * @param {function} onTextureReady
 */
export declare const svg2texture: (svgPath: string, onTextureReady: (texture: THREE.Texture) => void) => void;
