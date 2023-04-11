import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";
import { IHeightMap } from "../../components/interfaces";
import { CustomRandom } from "../Helpers";
import { noise } from "./perlin";

/**
 * A wrapper class for holding terrain data (generated from Perlin noise).
 */
export class PerlinHeightMap implements IHeightMap {
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
  constructor(widthSegments: number, depthSegments: number, options?: { iterations?: number; quality?: number }) {
    this.widthSegments = widthSegments;
    this.depthSegments = depthSegments;

    const iterations: number = options?.iterations ?? 5;
    const initialQuality: number = options?.quality ?? 1.5;
    console.log("iterations", iterations, "initialQuality", initialQuality);
    const useCustomNoise: boolean = true;
    const seed: number = Math.PI / 4;
    const size: number = widthSegments * depthSegments;

    this.data = new Uint8Array(size);

    // Todo: keep track of the height data and find min/max
    let minHeightValue = Number.MAX_VALUE;
    let maxHeightValue = Number.MIN_VALUE;

    const perlin = new ImprovedNoise();
    const getHeight = (x: number, y: number, z: number): number => {
      if (useCustomNoise) {
        return noise.perlin3(x, y, z);
      } else {
        return perlin.noise(x, y, z);
      }
    };

    const randomizer = new CustomRandom(seed);
    // z in [0..1]
    const z: number = randomizer.next(); // customRandom(seed) * 100;

    let resolution = initialQuality; // 1.5;
    // const depthFactor = 0.15; // 0.15 for custom noise
    const depthFactor = 0.12; // 0.15 for custom noise
    const qualityFactor = 4.0;

    for (let j = 0; j < iterations; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % widthSegments,
          y = ~~(i / widthSegments);
        const pValue = getHeight(x / resolution, y / resolution, z);
        minHeightValue = Math.min(minHeightValue, pValue);
        maxHeightValue = Math.max(maxHeightValue, pValue);
        this.data[i] += Math.abs(pValue * resolution * depthFactor);
      }
      resolution *= qualityFactor;
      // quality *= quality;
    }
    console.log("minHeightValue", minHeightValue, "maxHeightvalue", maxHeightValue);

    this.minHeightValue = minHeightValue;
    this.maxHeightValue = maxHeightValue;
  } // END constructor

  /**
   * Convert a position on the heightmap's x-y-grid to an offset inside the
   * underlying data array.
   *
   * @param {number} x - The x position in 0 <= x < widthSegments.
   * @param {number} z - The z position in 0 <= z < depthSegments.
   * @returns {number} The array offset (index) of the grid value in the data array.
   */
  getOffset(x: number, z: number): number {
    return Math.max(0, Math.min(z * this.depthSegments + x, this.data.length - 1));
  }

  getValueAt(x: number, z: number): number {
    return this.data[this.getOffset(x, z)];
  }

  setValueAt(x: number, z: number, newValue: number) {
    const index = this.getOffset(x, z);
    this.data[index] = newValue;
  }

  bilinearSmoothstep(squareSize: number): PerlinHeightMap {
    // const squareArea = squareSize * squareSize;
    for (var x = 0; x < this.widthSegments; x++) {
      for (var z = 0; z < this.depthSegments; z++) {
        // const values = [
        //   [this.getValueAt(x, z), z + 1 < this.depthSegments ? this.getValueAt(x, z + 1) : this.getValueAt(x, z)],
        //   [
        //     x + 1 < this.widthSegments ? this.getValueAt(x + 1, z) : this.getValueAt(x, z),
        //     x + 1 < this.widthSegments && z + 1 < this.depthSegments ? this.getValueAt(x + 1, z + 1) : this.getValueAt(x, z)
        //   ]
        // ];
        // this.setValueAt(x, z, (values[0][0] + values[0][1] + values[1][0] + values[1][1]) / 4.0);
        this.setValueAt(x, z, this.aggregateNeightbourValues(x, z, squareSize));
      }
    }
    return this;
  }

  private aggregateNeightbourValues(x: number, z: number, squareSize: number): number {
    let value = 0;
    let count = 0;
    for (var i = 0; i < squareSize && x + i < this.widthSegments; i++) {
      for (var j = 0; j < squareSize && z + j < this.depthSegments; j++) {
        value += this.getValueAt(x + i, z + j);
        count++;
      }
    }
    return value / count;
  }
}
