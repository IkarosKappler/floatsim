import * as THREE from "three";

import { CausticShaderMaterial2 } from "../../utils/texture/CausticShaderMaterial2";
import { IHeightMap, Size3Immutable, TextureData, Triple } from "../interfaces";
import { bounds2size } from "../../utils/Helpers";

export class PerlinTerrain {
  readonly heightMap: IHeightMap;

  // The size of a terrain segment is not intended to be changed. Use scale
  readonly worldSize: Size3Immutable;
  readonly bounds: THREE.Box3;
  readonly texture: THREE.CanvasTexture;
  readonly geometry: THREE.PlaneGeometry;
  readonly mesh: THREE.Mesh;

  readonly causticShaderMaterial: CausticShaderMaterial2;

  constructor(heightMap: IHeightMap, worldBunds: THREE.Box3, baseTexture: TextureData) {
    this.heightMap = heightMap;
    this.bounds = worldBunds;
    this.worldSize = bounds2size(worldBunds);
    this.geometry = PerlinTerrain.heightMapToPlaneGeometry(heightMap, this.worldSize);
    this.causticShaderMaterial = new CausticShaderMaterial2(baseTexture);
    this.mesh = new THREE.Mesh(this.geometry, this.causticShaderMaterial.waterMaterial);
  }

  /**
   * Get the absolute height position, at the given absolute world coordinates. World coordinates
   * don't have any bouds. If the given coordinates a beyond the limits of this terrain segment
   * then the closest bound position is used.
   *
   * @param {number} absX - The first coordinate along the `width` axis (local coordinates).
   * @param {number} absZ - The second coordinate along the `depth` axis (local coordinates).
   * @returns {number} The absolute height value along the `height` (=y) axis.
   */
  getHeightAtWorldPosition(absX: number, absZ: number): number {
    return (
      this.mesh.position.y +
      this.getHeightAtRelativePosition(
        absX - this.mesh.position.x + this.worldSize.width / 2,
        absZ - this.mesh.position.z + this.worldSize.depth / 2
      )
    );
  }

  /**
   * Get the relative height value, the y position relative to bounds.min.y at the
   * given relative world (local) coordinates. Local coordinates go from
   *   - 0 <= x < width
   *   - 0 <= y < depth
   *
   * @param {number} x - The first coordinate along the `width` axis (local coordinates).
   * @param {number} z - The second coordinate along the `depth` axis (local coordinates).
   * @returns {number} The height value along the `height` (=y) axis relative to bounds.min.y.
   */
  getHeightAtRelativePosition(x: number, z: number): number {
    // Convert absolute positions inside [0..x..width] and [0..y..depth]
    // to relative values inside the height map.
    const xRel: number = Math.floor((x / this.worldSize.width) * this.heightMap.widthSegments);
    const zRel: number = Math.floor((z / this.worldSize.depth) * this.heightMap.depthSegments);
    // const i: number = Math.max(0, Math.min(zRel * this.heightMap.depthSegments + xRel, this.heightMap.data.length - 1));
    const i: number = this.heightMap.getOffset(xRel, zRel);
    return this.heightMap.data[i] * this.worldSize.height;
  }

  /**
   * Check if the given world coordinates are located in this segment's bounds.
   *
   * @param {number} absX - The x position in world coordinates.
   * @param {number} absZ - The z position in world coordinates.
   * @returns {boolean}
   */
  containsAbsolutePosition(absX: number, absZ: number): boolean {
    const relX = absX - this.mesh.position.x + this.worldSize.width / 2;
    const relZ = absZ - this.mesh.position.z + this.worldSize.depth / 2;
    return relX >= 0 && relX < this.worldSize.width && relZ >= 0 && relZ < this.worldSize.depth;
  }

  /**
   * Get the absolute position in this terrain for the given x-z coordinates,
   * the y position relative to bounds.min.y at the
   * given relative world coordinates. World coordinates go from
   *   - 0 <= x < width
   *   - 0 <= y < depth
   *
   * @param {Triple<number>} position - The x-z position to use. Result will be stored in the y component.
   * @returns {Triple<number>} The same vector but with new y value.
   */
  // getThreePositionAt(position: Triple<number>): Triple<number> {
  //   position.y = this.bounds.min.y + this.getHeightAt(position.x, position.z);
  //   return position;
  // }

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
