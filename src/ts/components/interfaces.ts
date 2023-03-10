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
