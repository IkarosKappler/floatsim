/**
 * @author  Ikaros Kappler
 * @date    2023-03-27
 * @version 1.0.0
 */

import * as THREE from "three";
import { SceneContainer } from "./SceneContainer";
import { HUDData, ISceneContainer, TweakParams, UpdateableComponent } from "./interfaces";

const distance_pars_vertex = /* glsl */ `
  varying vec2 vUv;
  varying float distance;
  uniform float pointMultiplier;
  varying float particleDistFactor;

  attribute float aRotation;
  attribute float aSize;
  attribute vec4 aColor;
  varying float vRotation;
  varying vec4 vColor;
  `;

const distance_vertex = /* glsl */ `
  // 'distance' void main() {
    float maxDistance = 10.0;
    vUv = uv;

    float vParticleDensity = 0.0084;
    distance = - mvPosition.z;
    particleDistFactor = 1.0 - exp( - vParticleDensity * vParticleDensity * distance * distance );

    vRotation = aRotation;
    vColor = aColor;
    gl_PointSize = aSize / particleDistFactor;
  // }
  `;

const distance_pars_fragment = /* glsl */ `
  varying vec2 vUv;
  // uniform sampler2D velTex;
  uniform sampler2D posTex; // TOTO: rename to tDiffuse
  varying float distance;
  varying float particleDistFactor;

  varying float vRotation;
  varying vec4 vColor;
`;

const distance_fragment = /* glsl */ `
  // 'distance' void main() {
    vec2 rotated = vec2(cos(vRotation) * (gl_PointCoord.x - 0.5) + 0.5, sin(vRotation) * (gl_PointCoord.y - 0.5) + 0.5);

    // Re-read from texture and apply rotation
    float mid = 0.5;
    uv = vec2(
      cos(vRotation) * (uv.x - mid) + sin(vRotation) * (uv.y - mid) + mid,
      cos(vRotation) * (uv.y - mid) - sin(vRotation) * (uv.x - mid) + mid
    );
    gl_FragColor = texture2D( map, uv ) * vColor; // vec4( vColor.rgb, 1.0 );

    float minAlpha = 0.0;
    float maxAlpha = 0.25;
    
    // gl_FragColor.a = mix( gl_FragColor.a, 0.0, particleDistFactor );
    gl_FragColor.a = minAlpha + (maxAlpha-minAlpha)*mix( gl_FragColor.a, 0.0, particleDistFactor );

  // }
  `;

interface IParticle {
  velocity: THREE.Vector3;
  position: THREE.Vector3;
}

export class FloatingParticles implements UpdateableComponent {
  private readonly sceneContainer: SceneContainer;
  readonly texturePath: string;
  private readonly geometry: THREE.BufferGeometry;
  private readonly particles: Array<IParticle>;

  constructor(sceneContainer: SceneContainer, texturePath: string) {
    this.sceneContainer = sceneContainer;
    this.texturePath = texturePath;

    console.log("THREE.ShaderChunk.map_particle_fragment", THREE.ShaderChunk.map_particle_pars_fragment);

    this.geometry = new THREE.BufferGeometry();
    this.particles = [];
    this.init();
  }

  private init() {
    // Inspired by
    //    https://discourse.threejs.org/t/function-to-extend-materials/7882

    const positions = [];
    const colors = [];
    const sizes = [];
    const angles = [];

    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(1000);
      const y = THREE.MathUtils.randFloatSpread(1000);
      const z = THREE.MathUtils.randFloatSpread(1000);

      const color = new THREE.Color(
        128 + Math.floor(Math.random() * 127),
        128 + Math.floor(Math.random() * 127),
        128 + Math.floor(Math.random() * 127)
      );
      const alpha = 0.5 + Math.random() * 0.5;
      const size = Math.random() * 5.0;
      const angle = Math.random() * Math.PI * 2.0;

      positions.push(x, y, z);
      colors.push(color.r, color.g, color.b, alpha);

      sizes.push(size);
      angles.push(angle);

      this.particles.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(1.0 + Math.random() * 2, 0.0, 1.0 + Math.random() * 2)
      });
    }

    // this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    this.geometry.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 4));
    this.geometry.setAttribute("aRotation", new THREE.Float32BufferAttribute(angles, 1));

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.aSize.needsUpdate = true;
    this.geometry.attributes.aColor.needsUpdate = true;
    this.geometry.attributes.aRotation.needsUpdate = true;

    const particleTexture = new THREE.TextureLoader().load(this.texturePath);

    const material = new THREE.PointsMaterial({
      color: new THREE.Color("rgba(255,255,255,0.2)"), // 0x888888,
      map: particleTexture,
      transparent: true,
      // size: 5,
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

    const points = new THREE.Points(this.geometry, material);

    this.sceneContainer.scene.add(points);
  }

  // @implement UpdateableComponent
  update(elapsedTime: number, _deltaTime: number): void {
    const positions = [];
    for (var i = 0; i < this.particles.length; i++) {
      positions.push(this.particles[i].position.x + this.particles[i].velocity.x * elapsedTime);
      positions.push(this.particles[i].position.y + this.particles[i].velocity.y * elapsedTime);
      positions.push(this.particles[i].position.z + this.particles[i].velocity.z * elapsedTime);
    }
    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.attributes.position.needsUpdate = true;
  }
}
