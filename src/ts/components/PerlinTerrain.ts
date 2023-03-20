import * as THREE from "three";

// import Stats from 'three/addons/libs/stats.module.js';

// import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import { noise } from "../utils/perlin";
import { CausticShaderMaterial } from "../utils/texture/CausticShaderMaterial";
import { PerlinHeightMap, Size3Immutable, TextureData } from "./interfaces";

export class PerlinTerrain {
  // extends THREE.Mesh<THREE.PlaneGeometry> {
  readonly heightMap: PerlinHeightMap;
  // The size of a terrain segment is not intended to be changed. Use scale
  readonly worldSize: Size3Immutable;
  readonly texture: THREE.CanvasTexture;
  readonly geometry: THREE.PlaneGeometry;
  // readonly material: THREE.Material;
  readonly mesh: THREE.Mesh;

  readonly causticShaderMaterial: CausticShaderMaterial;

  constructor(heightMap: PerlinHeightMap, worldSize: Size3Immutable, baseTexture: TextureData) {
    // }, worldWidthSegments: number, worldDepthSegments: number) {
    // TODO: solve subclassing problem with ES5
    // super(
    //   new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1),
    //   PerlinTerrain.generateMeshMaterial(data, worldWidth, worldDepth)
    // );
    // THREE.Mesh.call(
    //   this,
    //   new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1),
    //   PerlinTerrain.generateMeshMaterial(data, worldWidth, worldDepth)
    // );
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

    // this.material = PerlinTerrain.generateMeshMaterial(this.heightMap.data, heightMap.widthSegments, heightMap.depthSegments);
    this.geometry.rotateX(-Math.PI / 2);

    // this.mesh = new THREE.Mesh(this.geometry, this.material);
    const canvasTexture = new THREE.CanvasTexture(baseTexture.imageCanvas);
    const baseMaterial = new THREE.MeshBasicMaterial({ map: canvasTexture, fog: true });

    this.causticShaderMaterial = new CausticShaderMaterial(heightMap, baseTexture);

    this.mesh = new THREE.Mesh(this.geometry, [baseMaterial, this.causticShaderMaterial.waterMaterial]);
    // this.mesh = new THREE.Mesh(this.geometry, baseMaterial);

    // !!! TODO: check this
    const vertices: Array<number> = (this.geometry.attributes.position as any).array;
    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = this.heightMap.data[i] * 10;
    }
  }

  /*
  public static generateTexture(
    data: Uint8Array,
    width: number,
    height: number
  ): { imageData: ImageData; imageDataArray: Uint8ClampedArray; imageCanvas: HTMLCanvasElement } {
    let context: CanvasRenderingContext2D;
    let imageData: ImageData;
    let imageDataArray: Uint8ClampedArray;
    let shade: number;

    const vector3: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

    const sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext("2d");
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);

    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    // !!! TODO Check
    imageDataArray = imageData.data; //  as any as Array<number>;

    for (let i = 0, j = 0, l = imageDataArray.length; i < l; i += 4, j++) {
      vector3.x = data[j - 2] - data[j + 2];
      vector3.y = 2;
      vector3.z = data[j - width * 2] - data[j + width * 2];
      vector3.normalize();

      shade = vector3.dot(sun);

      imageDataArray[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
      imageDataArray[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
      imageDataArray[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
      imageDataArray[i + 3] = 255;
    }

    context.putImageData(imageData, 0, 0);

    // Scaled 4x

    const canvasScaled = document.createElement("canvas");
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext("2d");
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    imageData = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageDataArray = imageData.data;

    for (let i = 0, l = imageDataArray.length; i < l; i += 4) {
      const v = ~~(Math.random() * 5);

      imageDataArray[i] += v;
      imageDataArray[i + 1] += v;
      imageDataArray[i + 2] += v;
    }

    context.putImageData(imageData, 0, 0);

    return { imageData, imageDataArray, imageCanvas: canvasScaled };
  }

  private static generateMeshMaterial = (data: Uint8Array, worldWidth: number, worldDepth: number) => {
    const textureData = PerlinTerrain.generateTexture(data, worldWidth, worldDepth);
    const texture = new THREE.CanvasTexture(textureData.imageCanvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return new THREE.MeshBasicMaterial({ map: texture });
  };
  */

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
