import * as THREE from "three";

import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import { noise } from "../utils/perlin";
import { CausticShaderMaterial } from "../utils/texture/CausticShaderMaterial";
import { PerlinHeightMap, Size3Immutable, TextureData } from "./interfaces";
import { bounds2size } from "../utils/Helpers";

export class PerlinTerrain {
  readonly heightMap: PerlinHeightMap;

  // The size of a terrain segment is not intended to be changed. Use scale
  readonly worldSize: Size3Immutable;
  readonly bounds: THREE.Box3;
  readonly texture: THREE.CanvasTexture;
  readonly geometry: THREE.PlaneGeometry;
  readonly mesh: THREE.Mesh;

  readonly causticShaderMaterial: CausticShaderMaterial;

  // constructor(heightMap: PerlinHeightMap, worldSize: Size3Immutable, baseTexture: TextureData) {
  constructor(heightMap: PerlinHeightMap, worldBunds: THREE.Box3, baseTexture: TextureData) {
    this.heightMap = heightMap;
    // this.worldSize = worldSize;
    this.bounds = worldBunds;

    const worldSize = bounds2size(worldBunds);
    this.geometry = new THREE.PlaneGeometry(
      worldSize.x, // width,
      worldSize.z, // depth,
      heightMap.widthSegments - 1,
      heightMap.depthSegments - 1
    );
    // Add to layers: base texture and caustic effect layer
    this.geometry.clearGroups();
    this.geometry.addGroup(0, Number.POSITIVE_INFINITY, 0);
    this.geometry.addGroup(0, Number.POSITIVE_INFINITY, 1);
    this.geometry.rotateX(-Math.PI / 2);

    this.causticShaderMaterial = new CausticShaderMaterial(baseTexture);

    this.mesh = new THREE.Mesh(this.geometry, this.causticShaderMaterial.waterMaterial);

    // !!! TODO: check this
    const vertices: Array<number> = (this.geometry.attributes.position as any).array;
    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = this.heightMap.data[i] * 10;
    }
  }

  private static customRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Create the raw perlin terrain data.
   *
   * @param widthSegments
   * @param depthSegments
   * @param options
   * @returns PerlinHeightMap
   */
  static generatePerlinHeight(
    widthSegments: number,
    depthSegments: number,
    options?: { iterations?: number; quality?: number }
  ): PerlinHeightMap {
    const iterations = options?.iterations ?? 5;
    const initialQuality: number = options?.quality ?? 1.5;
    console.log("iterations", iterations, "initialQuality", initialQuality);
    const useCustomNoise = true;
    const seed = Math.PI / 4;
    const size = widthSegments * depthSegments;
    const data = new Uint8Array(size);
    // Todo: keep track of the height data and find min/max
    let minHeightValue = Number.MAX_VALUE;
    let maxHeightValue = Number.MIN_VALUE;

    const perlin = new ImprovedNoise();
    const getHeight = (x, y, z): number => {
      if (useCustomNoise) {
        return noise.perlin3(x, y, z);
      } else {
        return perlin.noise(x, y, z);
      }
    };

    const z = this.customRandom(seed) * 100;

    let resolution = initialQuality; // 1.5;
    // const depthFactor = 0.15; // 0.15 for custom noise
    const depthFactor = 0.12; // 0.15 for custom noise
    const qualityFactor = 4.0;

    for (let j = 0; j < iterations; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % widthSegments,
          y = ~~(i / widthSegments);
        const pValue = getHeight(x / resolution, y / resolution, z);
        // if (i > 2 * widthSegments && i < 4 * widthSegments) {
        //   console.log("pValue", pValue);
        // }
        minHeightValue = Math.min(minHeightValue, pValue);
        maxHeightValue = Math.max(maxHeightValue, pValue);
        data[i] += Math.abs(pValue * resolution * depthFactor); // Math.pow(depthFactor, iterations - j));
        // data[i] += Math.abs((pValue * 2.0) / quality);
      }
      resolution *= qualityFactor;
      // quality *= quality;
    }
    console.log("minHeightValue", minHeightValue, "maxHeightvalue", maxHeightValue);

    return { data, widthSegments, depthSegments, minHeightValue, maxHeightValue };
  }
}
