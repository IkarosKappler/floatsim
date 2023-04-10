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

  constructor(heightMap: PerlinHeightMap, worldBunds: THREE.Box3, baseTexture: TextureData) {
    this.heightMap = heightMap;
    this.bounds = worldBunds;
    this.worldSize = bounds2size(worldBunds);
    this.geometry = PerlinTerrain.heightMapToPlaneGeometry(heightMap, this.worldSize);
    this.causticShaderMaterial = new CausticShaderMaterial(baseTexture);
    this.mesh = new THREE.Mesh(this.geometry, this.causticShaderMaterial.waterMaterial);
  }

  getHeightAt(x: number, y: number): number {
    // Convert absolute positions inside [0..x..width] and [0..y..depth]
    // to relative values inside the height map.
    const xRel = Math.floor((x / this.worldSize.width) * this.heightMap.widthSegments);
    const yRel = Math.floor((y / this.worldSize.depth) * this.heightMap.depthSegments);
    const i = yRel * this.heightMap.widthSegments + xRel;
    return this.heightMap.data[i];
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
  } // END generatePerlinHeight

  static heightMapToPlaneGeometry(heightMap: PerlinHeightMap, worldSize: Size3Immutable) {
    //THREE.Vector3) {
    const geometry = new THREE.PlaneGeometry(
      worldSize.width,
      worldSize.depth,
      heightMap.widthSegments - 1,
      heightMap.depthSegments - 1
    );
    geometry.rotateX(-Math.PI / 2);

    // !!! TODO: check this
    const vertices: Array<number> = (geometry.attributes.position as any).array;
    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = heightMap.data[i] * 10;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }
}
