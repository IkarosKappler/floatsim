/**
 * Global interfaces.
 */

export interface HUDData {
  depth: number;
}

export interface MinMax {
  min: number;
  max: number;
}

export interface SceneData {
  initialDepth: number;
  //   normalFogDepth: number;
  deepFogDepth: MinMax;
  highFogDepth: MinMax;
}

export interface Size3Immutable {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
}

export interface PerlinHeightMap {
  widthSegments: number;
  depthSegments: number;
  minHeightValue: number;
  maxHeightValue: number;
  data: Uint8Array;
}
