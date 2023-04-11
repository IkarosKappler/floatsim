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
    // const i: number = Math.max(0, Math.min(zRel * this.heightMap.depthSegments + xRel, this.heightMap.data.length - 1));
    const i: number = this.heightMap.getOffset(xRel, zRel);
    return this.heightMap.data[i] * this.worldSize.height;
  }

  /**
   * A static helper function to convert a heightmap to a plane geometry. Useful if
   * you need the geometry without the specific terrain material.
   * @param heightMap
   * @param worldSize
   * @returns
   */
  static heightMapToPlaneGeometry(heightMap: IHeightMap, worldSize: Size3Immutable): THREE.PlaneGeometry {
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
      vertices[j + 1] = heightMap.data[i] * worldSize.height;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }
}
