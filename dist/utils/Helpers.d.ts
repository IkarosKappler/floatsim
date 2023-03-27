/**
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-03-26
 */
import * as THREE from "three";
import { IBounds2Immutable, Rect, Tuple } from "../components/interfaces";
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
/**
 * A simple immutable bounds class with helper functions for relative positioning.
 */
export declare class Bounds2Immutable implements IBounds2Immutable {
    readonly min: Tuple<number>;
    readonly max: Tuple<number>;
    readonly width: number;
    readonly height: number;
    constructor(x: number | Rect, y?: number, width?: number, height?: number);
    private getRelativeX;
    private getRelativeY;
    getRelativePos(xFract: number, yFract: number): Tuple<number>;
    getRelativeBounds(minFracts: Tuple<number>, maxFracts: Tuple<number>): IBounds2Immutable;
    scale(factor: number): Bounds2Immutable;
    move(amount: Tuple<number>): Bounds2Immutable;
    static fromMinMax(min: Tuple<number>, max: Tuple<number>): Bounds2Immutable;
}
