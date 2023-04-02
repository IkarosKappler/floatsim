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

  attribute float rotation;
  varying float vRotation;
  `;

const distance_vertex = /* glsl */ `
  // 'distance' void main() {
    float maxDistance = 10.0;
    vUv = uv;

    float size = 4.0;

    float vParticleDensity = 0.0084;
    distance = - mvPosition.z;
    particleDistFactor = 1.0 - exp( - vParticleDensity * vParticleDensity * distance * distance );

    vRotation = rotation;
    gl_PointSize = size / particleDistFactor;
  // }
  `;

const distance_pars_fragment = /* glsl */ `
  varying vec2 vUv;
  // uniform sampler2D velTex;
  uniform sampler2D posTex; // TOTO: rename to tDiffuse
  varying float distance;
  varying float particleDistFactor;

  varying float vRotation;
`;

const distance_fragment = /* glsl */ `
  // 'distance' void main() {
    vec3 color = vec3(1.0, 1.0, 1.0);
    vec2 rotated = vec2(cos(vRotation) * (gl_PointCoord.x - 0.5) + 0.5, sin(vRotation) * (gl_PointCoord.y - 0.5) + 0.5);

    // Re-read from texture and apply rotation
    float mid = 0.5;
    uv = vec2(
      cos(vRotation) * (uv.x - mid) + sin(vRotation) * (uv.y - mid) + mid,
      cos(vRotation) * (uv.y - mid) - sin(vRotation) * (uv.x - mid) + mid
    );
    gl_FragColor = texture2D( map, uv );

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

    // const baseMaterial = new THREE.PointsMaterial();

    // TODO: rename to 'positions'
    const vertices = [];
    const colors = []; // .push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
    const sizes = []; //.push(p.currentSize);
    const angles = []; // .push(p.rotation);

    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(1000);
      const y = THREE.MathUtils.randFloatSpread(1000);
      const z = THREE.MathUtils.randFloatSpread(1000);

      const color = new THREE.Color(Math.random() * 0xffffff);
      const alpha = 0.0;
      const size = 10.0;
      const angle = Math.random() * Math.PI * 2.0;

      vertices.push(x, y, z);
      // positions.push(p.position.x, p.position.y, p.position.z);
      colors.push(color.r, color.g, color.b, alpha); // color.alpha);
      sizes.push(size);
      angles.push(angle);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute("colour", new THREE.Float32BufferAttribute(colors, 4));
    geometry.setAttribute("rotation", new THREE.Float32BufferAttribute(angles, 1));

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
    geometry.attributes.colour.needsUpdate = true;
    geometry.attributes.rotation.needsUpdate = true;

    const particleTexture = new THREE.TextureLoader().load("img/particle-a-256.png");

    const material = new THREE.PointsMaterial({
      color: new THREE.Color("rgba(255,255,255,0.2)"), // 0x888888,
      map: particleTexture,
      transparent: true,
      size: 5,
      // blending: THREE.AdditiveBlending,
      depthTest: false, // !!! Setting this to true produces flickering!
      blendDstAlpha: 1500
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
