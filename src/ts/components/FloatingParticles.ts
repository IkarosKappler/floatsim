/**
 * @author  Ikaros Kappler
 * @date    2023-03-27
 * @version 1.0.0
 */

import * as THREE from "three";
import { SceneContainer } from "./SceneContainer";

export class FloatingParticles {
  private readonly sceneContainer: SceneContainer;

  constructor(sceneContainer: SceneContainer) {
    this.sceneContainer = sceneContainer;

    this.testB();
  }

  private testB() {
    // From the demo
    //    https://threejs.org/examples/?q=particles#webgl_points_sprites
    let parameters;
    const materials = [];
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const textureLoader = new THREE.TextureLoader();

    const sprite1 = textureLoader.load("img/particle-a.png");
    const sprite2 = textureLoader.load("img/particle-a.png");
    const sprite3 = textureLoader.load("img/particle-a.png");
    const sprite4 = textureLoader.load("img/particle-a.png");
    const sprite5 = textureLoader.load("img/particle-a.png");

    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 2000 - 1000;
      const y = Math.random() * 2000 - 1000;
      const z = Math.random() * 2000 - 1000;

      vertices.push(x, y, z);
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    parameters = [
      [[1.0, 0.2, 0.5], sprite2, 20 / 5],
      [[0.95, 0.1, 0.5], sprite3, 15 / 5],
      [[0.9, 0.05, 0.5], sprite1, 10 / 5],
      [[0.85, 0, 0.5], sprite5, 8 / 5],
      [[0.8, 0, 0.5], sprite4, 5 / 5]
    ];

    for (let i = 0; i < parameters.length; i++) {
      const color = parameters[i][0];
      const sprite = parameters[i][1];
      const size = parameters[i][2];

      materials[i] = new THREE.PointsMaterial({
        // color: "rgba(255,255,255,0.5)",
        size: size,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: false, // !!! Setting this to true produces flickering!
        transparent: true,
        blendDstAlpha: 1500
      });
      materials[i].color.setHSL(color[0], color[1], color[2]);

      const particles = new THREE.Points(geometry, materials[i]);

      particles.rotation.x = Math.random() * 6;
      particles.rotation.y = Math.random() * 6;
      particles.rotation.z = Math.random() * 6;

      this.sceneContainer.scene.add(particles);
    }
  }

  private testA() {
    const vertices = [];

    for (let i = 0; i < 1000; i++) {
      const x = THREE.MathUtils.randFloatSpread(200);
      const y = THREE.MathUtils.randFloatSpread(200);
      const z = THREE.MathUtils.randFloatSpread(200);

      vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    const particleTexture = new THREE.TextureLoader().load("img/particle-a.png");

    const material = new THREE.PointsMaterial({
      color: new THREE.Color("rgba(255,255,255,0.5)"), // 0x888888,
      map: particleTexture,
      transparent: true,
      depthTest: false
      //   alphaTest: 0.5
      //   alphaToCoverage: true,
      //   transmission: 1,
      //   thickness: 0.2,
      //   roughness: 0,
      //   metalness: 1,
      //   blendDstAlpha: 5
    });
    // const material = new THREE.MeshPhongMaterial({
    //   //   color: new THREE.Color("rgba(255,255,255,0.5)"),
    //   color: 0xffffff,
    //   map: particleTexture,
    //   transparent: true,
    //   alphaTest: 0.5
    // });

    const points = new THREE.Points(geometry, material);

    this.sceneContainer.scene.add(points);
  }
}
