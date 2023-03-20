import * as THREE from "three";

import { TextureData, PerlinHeightMap, Size3Immutable } from "../../components/interfaces";

export class PerlinTexture implements TextureData {
  readonly material: THREE.Material;
  readonly imageData: ImageData;
  readonly imageDataArray: Uint8ClampedArray;
  readonly imageCanvas: HTMLCanvasElement;

  constructor(heightMap: PerlinHeightMap, worldSize: Size3Immutable) {
    const textureData = PerlinTexture.generateTexture(heightMap.data, heightMap.widthSegments, heightMap.depthSegments);
    this.imageCanvas = textureData.imageCanvas;
    this.imageData = textureData.imageData;
    this.imageDataArray = textureData.imageDataArray;

    const texture = new THREE.CanvasTexture(textureData.imageCanvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    this.material = new THREE.MeshBasicMaterial({ map: texture });
  }

  public static generateTexture(data: Uint8Array, width: number, height: number): TextureData {
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
}
