import { IHeightMap } from "../../components/interfaces";
/**
 * A wrapper class for holding terrain data (generated from Perlin noise).
 */
export declare class PerlinHeightMap implements IHeightMap {
    readonly widthSegments: number;
    readonly depthSegments: number;
    readonly minHeightValue: number;
    readonly maxHeightValue: number;
    readonly data: Uint8Array;
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
    bilinearSmoothStep(): PerlinHeightMap;
}
