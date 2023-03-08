import * as THREE from "three";

// import Stats from 'three/addons/libs/stats.module.js';

// import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import { noise } from "../utils/perlin";

export class PerlinTerrain {
  // extends THREE.Mesh<THREE.PlaneGeometry> {
  readonly data: Uint8Array;
  readonly worldWidth: number;
  readonly worldDepth: number;
  readonly texture: THREE.CanvasTexture;
  readonly geometry: THREE.PlaneGeometry;
  readonly material: THREE.Material;
  readonly mesh: THREE.Mesh;

  constructor(data: Uint8Array, worldWidth: number, worldDepth: number) {
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
    this.data = data;
    this.geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
    this.material = PerlinTerrain.generateMeshMaterial(data, worldWidth, worldDepth);
    this.geometry.rotateX(-Math.PI / 2);
    this.worldWidth = worldWidth;

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // this.data = this.generateHeight(this.worldWidth, this.worldWidth);
    // this.init();
    //   }

    //   init() {
    // this.data = PerlinTerrain.generateHeight(this.worldWidth, this.worldWidth);

    // const geometry = new THREE.PlaneGeometry(7500, 7500, this.worldWidth - 1, this.worldDepth - 1);
    // geometry.rotateX(-Math.PI / 2);

    // !!! TODO: check this
    const vertices = (this.geometry.attributes.position as any).array;

    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = this.data[i] * 10;
    }

    // this.texture = new THREE.CanvasTexture(PerlinTerrain.generateTexture(this.data, this.worldWidth, this.worldDepth));
    // this.texture.wrapS = THREE.ClampToEdgeWrapping;
    // this.texture.wrapT = THREE.ClampToEdgeWrapping;

    // mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
    // scene.add(mesh);

    // renderer = new THREE.WebGLRenderer();
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // container.appendChild(renderer.domElement);

    //   controls = new FirstPersonControls(camera, renderer.domElement);
    // controls.movementSpeed = 150;
    // controls.lookSpeed = 0.1;

    //   stats = new Stats();
    // container.appendChild(stats.dom);

    //

    // window.addEventListener("resize", onWindowResize);
  }

  private makeTerrain() {
    // let container;
    let camera, scene, renderer;
    let mesh, texture;

    const worldWidth = 256,
      worldDepth = 256;
    const clock = new THREE.Clock();

    // const init = () => {

    //   this.data = generateHeight(worldWidth, worldDepth);

    //   const geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
    //   geometry.rotateX(-Math.PI / 2);

    //   // !!! TODO: check this
    //   const vertices = (geometry.attributes.position as any).array;

    //   for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    //     vertices[j + 1] = data[i] * 10;
    //   }

    //   texture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth));
    //   texture.wrapS = THREE.ClampToEdgeWrapping;
    //   texture.wrapT = THREE.ClampToEdgeWrapping;

    //   mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
    //   // scene.add(mesh);

    //   // renderer = new THREE.WebGLRenderer();
    //   // renderer.setPixelRatio(window.devicePixelRatio);
    //   // renderer.setSize(window.innerWidth, window.innerHeight);
    //   // container.appendChild(renderer.domElement);

    //   //   controls = new FirstPersonControls(camera, renderer.domElement);
    //   // controls.movementSpeed = 150;
    //   // controls.lookSpeed = 0.1;

    //   //   stats = new Stats();
    //   // container.appendChild(stats.dom);

    //   //

    //   // window.addEventListener("resize", onWindowResize);
    // };

    // function onWindowResize() {
    //   camera.aspect = window.innerWidth / window.innerHeight;
    //   camera.updateProjectionMatrix();

    //   renderer.setSize(window.innerWidth, window.innerHeight);

    //   controls.handleResize();
    // }

    // const customRandom = (seed: number) => {
    //   const x = Math.sin(seed++) * 10000;
    //   return x - Math.floor(x);
    // };

    // const generateHeight = (width: number, height: number) => {
    //   let seed = Math.PI / 4;
    //   // window.Math.random = function () {
    //   //   const x = Math.sin(seed++) * 10000;
    //   //   return x - Math.floor(x);
    //   // };

    //   const size = width * height,
    //     data = new Uint8Array(size);
    //   //   console.log("Improved Noise: ", ImprovedNoise);
    //   //   const perlin = new ImprovedNoise(),
    //   //   z = Math.random() * 100;
    //   const z = customRandom(seed) * 100;

    //   let quality = 1;
    //   //   let depth = 1;

    //   for (let j = 0; j < 4; j++) {
    //     for (let i = 0; i < size; i++) {
    //       const x = i % width,
    //         y = ~~(i / width);
    //       //   data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);

    //       data[i] += Math.abs(noise.perlin3(x / quality, y / quality, z) * quality * 0.5);
    //     }

    //     quality *= 5;
    //   }

    //   return data;
    // };

    // const generateTexture = (data: Uint8Array, width: number, height: number) => {
    //   let context, image, imageData, shade;

    //   const vector3 = new THREE.Vector3(0, 0, 0);

    //   const sun = new THREE.Vector3(1, 1, 1);
    //   sun.normalize();

    //   const canvas = document.createElement("canvas");
    //   canvas.width = width;
    //   canvas.height = height;

    //   context = canvas.getContext("2d");
    //   context.fillStyle = "#000";
    //   context.fillRect(0, 0, width, height);

    //   image = context.getImageData(0, 0, canvas.width, canvas.height);
    //   // !!! TODO Check
    //   imageData = image.data; //  as any as Array<number>;

    //   for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
    //     vector3.x = data[j - 2] - data[j + 2];
    //     vector3.y = 2;
    //     vector3.z = data[j - width * 2] - data[j + width * 2];
    //     vector3.normalize();

    //     shade = vector3.dot(sun);

    //     imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
    //     imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
    //     imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
    //   }

    //   context.putImageData(image, 0, 0);

    //   // Scaled 4x

    //   const canvasScaled = document.createElement("canvas");
    //   canvasScaled.width = width * 4;
    //   canvasScaled.height = height * 4;

    //   context = canvasScaled.getContext("2d");
    //   context.scale(4, 4);
    //   context.drawImage(canvas, 0, 0);

    //   image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    //   imageData = image.data;

    //   for (let i = 0, l = imageData.length; i < l; i += 4) {
    //     const v = ~~(Math.random() * 5);

    //     imageData[i] += v;
    //     imageData[i + 1] += v;
    //     imageData[i + 2] += v;
    //   }

    //   context.putImageData(image, 0, 0);

    //   return canvasScaled;
    // };

    // this.init();
    // return mesh;
  } // END constructor

  private static generateTexture(data: Uint8Array, width: number, height: number) {
    let context, image, imageData, shade;

    const vector3 = new THREE.Vector3(0, 0, 0);

    const sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext("2d");
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    // !!! TODO Check
    imageData = image.data; //  as any as Array<number>;

    for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
      vector3.x = data[j - 2] - data[j + 2];
      vector3.y = 2;
      vector3.z = data[j - width * 2] - data[j + width * 2];
      vector3.normalize();

      shade = vector3.dot(sun);

      imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
      imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
      imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
    }

    context.putImageData(image, 0, 0);

    // Scaled 4x

    const canvasScaled = document.createElement("canvas");
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext("2d");
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (let i = 0, l = imageData.length; i < l; i += 4) {
      const v = ~~(Math.random() * 5);

      imageData[i] += v;
      imageData[i + 1] += v;
      imageData[i + 2] += v;
    }

    context.putImageData(image, 0, 0);

    return canvasScaled;
  }

  private static customRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  private static generateMeshMaterial = (data: Uint8Array, worldWidth: number, worldDepth: number) => {
    const texture = new THREE.CanvasTexture(PerlinTerrain.generateTexture(data, worldWidth, worldDepth));
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return new THREE.MeshBasicMaterial({ map: texture });
  };

  static generatePerlinHeight(width: number, height: number) {
    let seed = Math.PI / 4;
    // window.Math.random = function () {
    //   const x = Math.sin(seed++) * 10000;
    //   return x - Math.floor(x);
    // };

    const size = width * height,
      data = new Uint8Array(size);
    //   console.log("Improved Noise: ", ImprovedNoise);
    //   const perlin = new ImprovedNoise(),
    //   z = Math.random() * 100;
    const z = this.customRandom(seed) * 100;

    let quality = 1.5;
    const depthFactor = 0.15;

    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % width,
          y = ~~(i / width);
        //   data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);

        data[i] += Math.abs(noise.perlin3(x / quality, y / quality, z) * quality * depthFactor);
      }

      quality *= 5;
    }

    return data;
  }
}
