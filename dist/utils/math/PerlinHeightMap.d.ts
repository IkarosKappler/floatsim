import { IHeightMap } from "../../components/interfaces";
/**
 * A wrapper class for holding terrain data (generated from Perlin noise).
 */
export declare class PerlinHeightMap implements IHeightMap {
    readonly widthSegments: number;
    readonly depthSegments: number;
    readonly minHeightValue: number;
    readonly maxHeightValue: number;
    readonly data: Float32Array;
    /**
     * Create the raw perlin terrain data.
     *
     * @param widthSegments
     * @param depthSegments
     * @param options
     * @returns PerlinHeightMap
     */
    constructor(widthSegments: number, depthSegments: number, options?: {
        iterations?: number;
        quality?: number;
    });
    /**
     * Convert a position on the heightmap's x-y-grid to an offset inside the
     * underlying data array.
     *
     * @param {number} x - The x position in 0 <= x < widthSegments.
     * @param {number} z - The z position in 0 <= z < depthSegments.
     * @returns {number} The array offset (index) of the grid value in the data array.
     */
    getOffset(x: number, z: number): number;
    getValueAt(x: number, z: number): number;
    setValueAt(x: number, z: number, newValue: number): void;
    bilinearSmoothstep(squareSize: number): PerlinHeightMap;
    private aggregateNeightbourValues;
}
