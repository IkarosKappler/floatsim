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
export const getColorStyle = (color: THREE.RGB, alpha: number): string => {
  return `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, ${alpha})`;
};
