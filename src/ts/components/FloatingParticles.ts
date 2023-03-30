/**
 * @author  Ikaros Kappler
 * @date    2023-03-27
 * @version 1.0.0
 */

import * as THREE from "three";
import { SceneContainer } from "./SceneContainer";

const _VS = `
  varying vec2 vUv;
  varying float distRatio;
  varying float distance;
  uniform float pointMultiplier;
  attribute float size;

  void main() {
    float maxDistance = 10.0;
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // gl_PointSize = 0.0001 * size * pointMultiplier / gl_Position.w;
    // gl_PointSize *= ( 4.0 / -mvPosition.z );
    // gl_PointSize = 8.0;

    // float distRatio = smoothstep(25., 75., -mvPosition.z);
    // float distRatio = 1.0 / - mvPosition.z;
    // if( distRatio < 0.5 ) discard;
    // gl_PointSize = size * (1. + (1. - distRatio) * 5.);
    // gl_PointSize = size * distRatio;

    distance = mvPosition.z;
    // distRatio = smoothstep(25., 75., -mvPosition.z);
    // gl_PointSize = size * (1. + (1. - distRatio) * 5.);
    // distRatio = 4.0 - (maxDistance / (distance));
    // gl_PointSize = size  * distRatio;

    gl_PointSize = size; // ( size * (maxDistance/mvPosition.z) );

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }`;

const _FS = `
  varying vec2 vUv;
  uniform sampler2D velTex;
  uniform sampler2D posTex;
  varying float distRatio;
  varying float distance;

  void main() {
    // vec3 velocity = texture2D(velTex, vUv).rgb;
    vec3 pos = texture2D(posTex, vUv).rgb;

    vec2 uv = gl_PointCoord - 0.5;
    float a = atan(uv.x,uv.y);
    float r = 3.1415/float(3.);
    float d1 = cos(floor(.5+a/r)*r-a)*length(uv) * 2.;
    
    float d2 = length(uv);
    
    float d = mix(d1, d2, distRatio);
    
    // if(d > 0.5) discard;
    // if( distance > 200.0 ) discard;
    
    gl_FragColor = vec4(1.0,1.0,1.0,1.0); // vec4( pos, 1.0 );
  }`;

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
