import * as THREE from "three";

import { CausticShaderMaterial } from "../../utils/texture/CausticShaderMaterial";
import { IHeightMap, Size3Immutable, TextureData } from "../interfaces";
import { bounds2size } from "../../utils/Helpers";

export class PerlinTerrain {
  readonly heightMap: IHeightMap;

  // The size of a terrain segment is not intended to be changed. Use scale
  readonly worldSize: Size3Immutable;
  readonly bounds: THREE.Box3;
  readonly texture: THREE.CanvasTexture;
  readonly geometry: THREE.PlaneGeometry;
  readonly mesh: THREE.Mesh;

  readonly causticShaderMaterial: CausticShaderMaterial;

  constructor(heightMap: IHeightMap, worldBunds: THREE.Box3, baseTexture: TextureData) {
    this.heightMap = heightMap;
    this.bounds = worldBunds;
    this.worldSize = bounds2size(worldBunds);
    this.geometry = PerlinTerrain.heightMapToPlaneGeometry(heightMap, this.worldSize);
    this.causticShaderMaterial = new CausticShaderMaterial(baseTexture);
    this.mesh = new THREE.Mesh(this.geometry, this.causticShaderMaterial.waterMaterial);
  }

  /**
   * Get the relative height value, the y position relative to bounds.min.y at the
   * given relative world coordinates. World coordinates go from
   *   - 0 <= x < width
   *   - 0 <= y < depth
   *
   * @param {number} x - The first coordinate along the `width` axis.
   * @param {number} z - The second coordinate along the `depth` axis.
   * @returns {number} The height value along the `height` (=y) axis relative to bounds.min.y.
   */
  getHeightAt(x: number, z: number): number {
    // Convert absolute positions inside [0..x..width] and [0..y..depth]
    // to relative values inside the height map.
    const xRel: number = Math.floor((x / this.worldSize.width) * this.heightMap.widthSegments);
    const zRel: number = Math.floor((z / this.worldSize.depth) * this.heightMap.depthSegments);
    const i: number = Math.max(0, Math.min(zRel * this.heightMap.depthSegments + xRel, this.heightMap.data.length - 1));
    return this.heightMap.data[i] * this.worldSize.height;
  }

  // /**
  //  * Create the raw perlin terrain data.
  //  *
  //  * @param widthSegments
  //  * @param depthSegments
  //  * @param options
  //  * @returns PerlinHeightMap
  //  */
  // static generatePerlinHeight(
  //   widthSegments: number,
  //   depthSegments: number,
  //   options?: { iterations?: number; quality?: number }
  // ): PerlinHeightMap {
  //   const iterations: number = options?.iterations ?? 5;
  //   const initialQuality: number = options?.quality ?? 1.5;
  //   console.log("iterations", iterations, "initialQuality", initialQuality);
  //   const useCustomNoise: boolean = true;
  //   const seed: number = Math.PI / 4;
  //   const size: number = widthSegments * depthSegments;
  //   const data: Uint8Array = new Uint8Array(size);
  //   // Todo: keep track of the height data and find min/max
  //   let minHeightValue = Number.MAX_VALUE;
  //   let maxHeightValue = Number.MIN_VALUE;

  //   const perlin = new ImprovedNoise();
  //   const getHeight = (x: number, y: number, z: number): number => {
  //     if (useCustomNoise) {
  //       return noise.perlin3(x, y, z);
  //     } else {
  //       return perlin.noise(x, y, z);
  //     }
  //   };

  //   const randomizer = new CustomRandom(seed);
  //   // z in [0..1]
  //   const z: number = randomizer.next(); // customRandom(seed) * 100;

  //   let resolution = initialQuality; // 1.5;
  //   // const depthFactor = 0.15; // 0.15 for custom noise
  //   const depthFactor = 0.12; // 0.15 for custom noise
  //   const qualityFactor = 4.0;

  //   for (let j = 0; j < iterations; j++) {
  //     for (let i = 0; i < size; i++) {
  //       const x = i % widthSegments,
  //         y = ~~(i / widthSegments);
  //       const pValue = getHeight(x / resolution, y / resolution, z);
  //       // if (i > 2 * widthSegments && i < 4 * widthSegments) {
  //       //   console.log("pValue", pValue);
  //       // }
  //       minHeightValue = Math.min(minHeightValue, pValue);
  //       maxHeightValue = Math.max(maxHeightValue, pValue);
  //       data[i] += Math.abs(pValue * resolution * depthFactor); // Math.pow(depthFactor, iterations - j));
  //       // data[i] += Math.abs((pValue * 2.0) / quality);
  //     }
  //     resolution *= qualityFactor;
  //     // quality *= quality;
  //   }
  //   console.log("minHeightValue", minHeightValue, "maxHeightvalue", maxHeightValue);

  //   return { data, widthSegments, depthSegments, minHeightValue, maxHeightValue };
  // } // END generatePerlinHeight

  static heightMapToPlaneGeometry(heightMap: IHeightMap, worldSize: Size3Immutable) {
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
      vertices[j + 1] = heightMap.data[i] * worldSize.height; // 10;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }
}
