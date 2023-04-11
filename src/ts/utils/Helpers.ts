/**
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-03-26
 */

import * as THREE from "three";
import { IBounds2Immutable, Rect, Size3Immutable, Tuple } from "../components/interfaces";

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
 * A cheap custom random number generator.
 */
export class CustomRandom {
  private seed: number = 0;

  /**
   * Construct a new generator with the given seed.
   * @param {number} seed - The seed to use.
   */
  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Get the next pseudo random number.
   *
   * @static
   * @returns {numbr} A peusdo random number between 0.0 and 1.0.
   */
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

/**
 * Convert bounds of form THREE.Box3 to a Vector3 containing the size.
 * @param bounds
 * @returns
 */
export const bounds2size = (bounds: THREE.Box3): Size3Immutable => {
  // THREE.Vector3 => {
  const size = new THREE.Vector3();
  bounds.getSize(size);
  // return size;
  return { width: size.x, height: size.y, depth: size.z };
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

/**
 * A simple immutable bounds class with helper functions for relative positioning.
 */
export class Bounds2Immutable implements IBounds2Immutable {
  readonly min: Tuple<number>;
  readonly max: Tuple<number>;
  readonly width: number;
  readonly height: number;

  // TODO: try function overloading with the new Typescript here
  constructor(x: number | Rect, y?: number, width?: number, height?: number) {
    if (typeof x === "number") {
      this.width = width ?? 0;
      this.height = height ?? 0;
      this.min = { x: x, y: y ?? 0 };
      this.max = { x: this.min.x + this.width, y: this.min.y + this.height };
    } else {
      this.width = x.width ?? 0;
      this.height = x.height ?? 0;
      this.min = { x: x.x, y: x.y };
      this.max = { x: x.x + this.width, y: x.y + this.height };
    }
  }

  private getRelativeX(xFract: number) {
    return this.min.x + this.width * xFract;
  }

  private getRelativeY(yFract: number) {
    return this.min.y + this.height * yFract;
  }

  getRelativePos(xFract: number, yFract: number): Tuple<number> {
    return { x: this.getRelativeX(xFract), y: this.getRelativeY(yFract) };
  }
  getRelativeBounds(minFracts: Tuple<number>, maxFracts: Tuple<number>): IBounds2Immutable {
    const minAbs = this.getRelativePos(minFracts.x, minFracts.y);
    const maxAbs = this.getRelativePos(maxFracts.x, maxFracts.y);
    return new Bounds2Immutable(
      Math.min(minAbs.x, maxAbs.x),
      Math.min(minAbs.y, maxAbs.y),
      Math.abs(maxAbs.x - minAbs.x),
      Math.abs(maxAbs.y - minAbs.y)
    );
  }

  scale(factor: number): Bounds2Immutable {
    return new Bounds2Immutable(this.min.x * factor, this.min.y * factor, this.width * factor, this.height * factor);
  }

  move(amount: Tuple<number>) {
    return new Bounds2Immutable(this.min.x + amount.x, this.min.y + amount.y, this.width, this.height);
  }

  static fromMinMax(min: Tuple<number>, max: Tuple<number>) {
    return new Bounds2Immutable(min.x, min.y, max.x - min.x, max.y - min.y);
  }
}
