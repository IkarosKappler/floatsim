/**
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-03-26
 */
import * as THREE from "three";
import { IBounds2Immutable, Rect, Size3Immutable, Triple, Tuple } from "../components/interfaces";
/**
 * Get the CSS colors string with adjustable alpha value.
 * @param {THREE.Color} color
 * @param {number} alpha
 * @returns
 */
export declare const getColorStyle: (color: THREE.RGB, alpha: number) => string;
/**
 * A cheap custom random number generator.
 */
export declare class CustomRandom {
    private seed;
    /**
     * Construct a new generator with the given seed.
     * @param {number} seed - The seed to use.
     */
    constructor(seed: number);
    /**
     * Get the next pseudo random number.
     *
     * @static
     * @returns {numbr} A peusdo random number between 0.0 and 1.0.
     */
    next(): number;
}
/**
 * Convert bounds of form THREE.Box3 to a Vector3 containing the size.
 * @param bounds
 * @returns
 */
export declare const bounds2size: (bounds: THREE.Box3) => Size3Immutable;
/**
 * Fetch the SVG at the given path and convert it to a THREE.Texture.
 * @param {string} svgPath
 * @param {function} onTextureReady
 */
export declare const svg2texture: (svgPath: string, onTextureReady: (texture: THREE.Texture) => void) => void;
/**
 * This is a vector-like behavior and 'rotates' this vertex
 * around given center (around the z axis – rotation on the screen plane).
 *
 * @param {number} angle - The angle to 'rotate' this vertex; 0.0 means no change.
 * @param {XYCoords=} center - The center of rotation; default is (0,0).
 * @return {Vertex} The passed vertex, for chaining.
 * @memberof Vertex
 **/
export declare const rotateVertZ: (vertex: THREE.Vector3, angle: number, center?: Triple<number> | undefined) => THREE.Vector3;
/**
 * This is a vector-like behavior and 'rotates' this vertex
 * around given center (around the z axis – rotation on the screen plane).
 *
 * @param {number} angle - The angle to 'rotate' this vertex; 0.0 means no change.
 * @param {XYCoords=} center - The center of rotation; default is (0,0).
 * @return {Vertex} The passed vertex, for chaining.
 * @memberof Vertex
 **/
export declare const rotateVertY: (vertex: THREE.Vector3, angle: number, center?: Triple<number> | undefined) => THREE.Vector3;
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
    getCenter(): Tuple<number>;
    getRelativePos(xFract: number, yFract: number): Tuple<number>;
    getRelativeBounds(minFracts: Tuple<number>, maxFracts: Tuple<number>): IBounds2Immutable;
    scale(factor: number): Bounds2Immutable;
    move(amount: Tuple<number>): Bounds2Immutable;
    static fromMinMax(min: Tuple<number>, max: Tuple<number>): Bounds2Immutable;
}
