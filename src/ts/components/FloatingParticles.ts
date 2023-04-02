/**
 * @author  Ikaros Kappler
 * @date    2023-03-27
 * @version 1.0.0
 */

import * as THREE from "three";
import { SceneContainer } from "./SceneContainer";

const distance_pars_vertex = /* glsl */ `
  varying vec2 vUv;
  varying float distance;
  uniform float pointMultiplier;

  varying float particleDistFactor;
  `;

const distance_vertex = /* glsl */ `
  // 'distance' void main() {
    float maxDistance = 10.0;
    vUv = uv;

    float size = 4.0;

    float vParticleDensity = 0.0084;
    distance = - mvPosition.z;
    particleDistFactor = 1.0 - exp( - vParticleDensity * vParticleDensity * distance * distance );
    // gl_PointSize = size; // ( size * (maxDistance/mvPosition.z) );
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);

    gl_PointSize = size / particleDistFactor;
  // }
  `;

const distance_pars_fragment = /* glsl */ `
  varying vec2 vUv;
  // uniform sampler2D velTex;
  uniform sampler2D posTex;
  varying float distance;

  varying float particleDistFactor;
`;

const distance_fragment = /* glsl */ `
  // 'distance' void main() {
    vec3 pos = texture2D(posTex, vUv).rgb;

    // float vParticleDensity = 0.0084;
    float minAlpha = 0.0;
    float maxAlpha = 0.33;
    
    // gl_FragColor.a = mix( gl_FragColor.a, 0.0, particleDistFactor );
    gl_FragColor.a = minAlpha + (maxAlpha-minAlpha)*mix( gl_FragColor.a, 0.0, particleDistFactor );

  // }
  `;

export class FloatingParticles {
  private readonly sceneContainer: SceneContainer;

  constructor(sceneContainer: SceneContainer) {
    this.sceneContainer = sceneContainer;

    console.log("THREE.ShaderChunk.map_particle_fragment", THREE.ShaderChunk.map_particle_pars_fragment);

    this.init();
  }

  private init() {
    // Found at
    //    https://discourse.threejs.org/t/function-to-extend-materials/7882

    const baseMaterial = new THREE.PointsMaterial();
    // BEGIN extend-material
    // END extend-material

    const vertices = [];

    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(1000);
      const y = THREE.MathUtils.randFloatSpread(1000);
      const z = THREE.MathUtils.randFloatSpread(1000);

      vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    const particleTexture = new THREE.TextureLoader().load("img/particle-a-256.png");

    const material = new THREE.PointsMaterial({
      color: new THREE.Color("rgba(255,255,255,0.2)"), // 0x888888,
      map: particleTexture,
      transparent: true,
      size: 5,
      // blending: THREE.AdditiveBlending,
      depthTest: false, // !!! Setting this to true produces flickering!
      blendDstAlpha: 1500
      //   alphaTest: 0.5
      //   alphaToCoverage: true,
      //   transmission: 1,
      //   thickness: 0.2,
      //   roughness: 0,
      //   metalness: 1,
      //   blendDstAlpha: 5
    });
    material.onBeforeCompile = (shader, renderer) => {
      console.log("onBeforeCompile");
      console.log(shader.fragmentShader);
      console.log(shader.vertexShader);

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <clipping_planes_pars_fragment>",
          ["#include <clipping_planes_pars_fragment>", distance_pars_fragment].join("\n")
        )
        .replace(
          "#include <premultiplied_alpha_fragment>",
          ["#include <premultiplied_alpha_fragment>", distance_fragment].join("\n")
        );

      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <clipping_planes_pars_vertex>",
          ["#include <clipping_planes_pars_vertex>", distance_pars_vertex].join("\n")
        )
        .replace("#include <fog_vertex>", ["#include <fog_vertex>", distance_vertex].join("\n"));
    };

    // https://stackoverflow.com/questions/67832321/how-to-reuse-the-three-js-fragment-shader-output

    const points = new THREE.Points(geometry, material);

    this.sceneContainer.scene.add(points);
  }
}
