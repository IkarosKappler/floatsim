/**
 * @author  Ikaros Kappler
 * @date    2023-03-27
 * @version 1.0.0
 */

import * as THREE from "three";
import { SceneContainer } from "./SceneContainer";
// import { EffectComposer, Pass } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

const distance_pars_vertex = /* glsl */ `
  varying vec2 vUv;
  varying float distRatio;
  varying float distance;
  uniform float pointMultiplier;
  `;

const distance_vertex = /* glsl */ `
  // 'distance' void main() {
    float maxDistance = 10.0;
    vUv = uv;
    distance = mvPosition.z;
    // gl_PointSize = size; // ( size * (maxDistance/mvPosition.z) );
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  // }
  `;

const distance_pars_fragment = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D velTex;
  uniform sampler2D posTex;
  varying float distRatio;
  varying float distance;
`;

const distance_fragment = /* glsl */ `
  // 'distance' void main() {
    vec3 pos = texture2D(posTex, vUv).rgb;
    
    // gl_FragColor = vec4( pos, 1.0 );
    // gl_FragColor = vec4(1.0,1.0,1.0,1.0);
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

    for (let i = 0; i < 1000; i++) {
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
      blending: THREE.AdditiveBlending,
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

    // this.initRenderPass(geometry, points);
  }

  /*
  initRenderPass(geometry: THREE.BufferGeometry, mesh: THREE.Points) {
    // const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    // const material = new THREE.MeshNormalMaterial();

    // mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    const customMaterial = new THREE.ShaderMaterial({
      fragmentShader: _FS,
      vertexShader: _VS
    });

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(this.sceneContainer.scene, this.sceneContainer.camera);

    // const effectHBlur = new ShaderPass(THREE.HorizontalBlurShader);
    // const effectVBlur = new ShaderPass(THREE.VerticalBlurShader);
    // effectHBlur.uniforms['h'].value = 1 / window.innerWidth;
    // effectVBlur.uniforms['v'].value = 1 / window.innerHeight;

    const myShader : Pass = {
      uniforms : {},

      vertexShader: _VS,

      fragmentShader: _FS };
      

    composer.addPass(renderPass);
    // composer.addPass(effectHBlur);
    // composer.addPass(effectVBlur);
    composer.addPass(myShader);
  }
  */
}
