import * as THREE from "three";

// import Stats from 'three/addons/libs/stats.module.js';

// import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import { noise } from "../utils/perlin";
import { CausticShaderMaterial } from "../utils/texture/CausticShaderMaterial";
import { PerlinHeightMap, Size3Immutable, TextureData } from "./interfaces";
import { SceneContainer } from "./SceneContainer";

export class PerlinTerrain {
  readonly heightMap: PerlinHeightMap;
  // The size of a terrain segment is not intended to be changed. Use scale
  readonly worldSize: Size3Immutable;
  readonly texture: THREE.CanvasTexture;
  readonly geometry: THREE.PlaneGeometry;
  readonly mesh: THREE.Mesh;

  readonly causticShaderMaterial: CausticShaderMaterial;

  constructor(heightMap: PerlinHeightMap, worldSize: Size3Immutable, baseTexture: TextureData) {
    this.heightMap = heightMap;
    this.worldSize = worldSize;
    this.geometry = new THREE.PlaneGeometry(
      worldSize.width,
      worldSize.depth,
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
    let seed = Math.PI / 4;
    const size = widthSegments * depthSegments;
    const data = new Uint8Array(size);
    // Todo: keep track of the height data and find min/max
    let minHeightValue = Number.MAX_VALUE;
    let maxHeightvalue = Number.MIN_VALUE;
    if (useCustomNoise) {
      const z = this.customRandom(seed) * 100;

      let quality = initialQuality; // 1.5;
      const depthFactor = 0.15;

      for (let j = 0; j < iterations; j++) {
        for (let i = 0; i < size; i++) {
          const x = i % widthSegments,
            y = ~~(i / widthSegments);
          data[i] += Math.abs(noise.perlin3(x / quality, y / quality, z) * quality * depthFactor);
        }

        quality *= 5;
      }
    } else {
      console.log("Improved Noise: ", ImprovedNoise);
      const perlin = new ImprovedNoise();
      //   z = Math.random() * 100;
      const z = this.customRandom(seed) * 100;

      let quality = initialQuality; //1.5;
      const depthFactor = 0.25;

      for (let j = 0; j < iterations; j++) {
        for (let i = 0; i < size; i++) {
          const x = i % widthSegments,
            y = ~~(i / widthSegments);
          data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * depthFactor);
        }

        quality *= 5;
      }
    }

    return { data, widthSegments, depthSegments, minHeightValue: 0.0, maxHeightValue: 0.0 };
  }
}
