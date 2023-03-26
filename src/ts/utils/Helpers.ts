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

/**
 * Fetch the SVG at the given path and convert it to a THREE.Texture.
 * @param {string} svgPath
 * @param {function} onTextureReady
 */
export const svg2texture = (svgPath: string, onTextureReady: (texture: THREE.Texture) => void) => {
  const svgImage = document.createElement("img");
  svgImage.style.position = "absolute";
  svgImage.style.top = "-9999px";
  // The image _needs_ to be attached to the DOM, otherwise its
  // attributes will not be availale.
  document.body.appendChild(svgImage);
  svgImage.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = svgImage.clientWidth;
    canvas.height = svgImage.clientHeight;
    const canvasCtx = canvas.getContext("2d");
    canvasCtx.drawImage(svgImage, 0, 0);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    svgImage.remove();
    onTextureReady(texture);
  };
  svgImage.src = svgPath;
};
