/**
 * @date    2023-03-20
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

import * as THREE from "three";
import { PerlinHeightMap, TextureData } from "../../components/interfaces";

const vertShader = `
        varying vec2 vUv; 
        varying vec3 vposition;

        void main() {
            // This is just the local position.
            vUv = uv; // position;
            // This is the global position in the world.
            vposition = (modelMatrix * vec4(position, 1.0)).xyz;

            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            gl_Position = projectionMatrix * modelViewPosition; 
        }
        `;

const fragShader = `
        uniform float zoom;
        uniform float speed;
        uniform float bright;
        uniform float u_time;
        uniform sampler2D u_texture;

        varying vec2 vUv;
        varying vec3 vposition;

        void main()
        {
            // uncoment when using real texture
            vec4 texture_color = texture2D(u_texture, vUv.xy);
            // vec4 texture_color = vec4(0.192156862745098/2., 0.6627450980392157/2., 0.9333333333333333/2., 1.0);

            vec4 k = vec4(u_time)*speed;
            // k.xy = vec2(vUv * zoom);
            // k.xy = vec2(vposition * zoom);

            // Use the xz-coordinated to view from top
            k.xy = vec2(vposition.x, vposition.z) * zoom;

            float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
            float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.2));
            float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
            gl_FragColor = vec4 (pow(min(min(val1,val2),val3), 7.0) * bright)+texture_color;
            // gl_FragColor = texture_color;

            // vec3 color = 0.5 + 0.5*cos(u_time*speed+vUv.xyx+vec3(0,2,4));
            // gl_FragColor = vec4(color,1.0);
        }
    `;

export class CausticShaderMaterial {
  readonly waterMaterial: THREE.ShaderMaterial;
  private loopNumber: number = 0;

  constructor(terrainData: PerlinHeightMap, baseTexture: TextureData) {
    //---BEGIN--- Terrain Generation
    var worldWidthSegments = 256;
    var worldDepthSegments = 256;

    var imageData = baseTexture.imageData;
    var buffer = imageData.data.buffer; // ArrayBuffer
    var arrayBuffer = new ArrayBuffer(imageData.data.length);
    var binary = new Uint8Array(arrayBuffer);
    for (var i = 0; i < binary.length; i++) {
      binary[i] = imageData.data[i];
    }
    //   var dTex = new THREE.DataTexture(binary, worldWidthSegments, worldDepthSegments, THREE.RGBAFormat);
    // var dTex = new THREE.DataTexture(baseTexture.imageData, worldWidthSegments, worldDepthSegments, THREE.RGBAFormat);
    // TODO: FIX THIS TYPE!!!
    var dTex = new THREE.DataTexture(
      // binary, //baseTexture.imageData, // as unknown as BufferSource,
      baseTexture.imageData as unknown as BufferSource,
      worldWidthSegments,
      worldDepthSegments,
      THREE.RGBAFormat
    );

    dTex.needsUpdate = true;

    //   uniform float zoom = 127.0; // 7f;
    //   uniform float speed = .8;
    //   uniform float bright = 63.0; // 3f;
    var uniforms = {
      zoom: { type: "f", value: 0.5 },
      speed: { type: "f", value: 0.8 },
      bright: { type: "f", value: 32.0 },
      u_time: { type: "f", value: 0.0 },
      u_texture: { type: "t", value: dTex }
    };
    this.waterMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertShader,
      fragmentShader: fragShader
    });
    // TODO: is this still required?
    // this.waterMaterial.defines = { "USE_UV": "" };
  }

  update(elapsedTime: number) {
    // self.cube.material.uniforms.u_time.value = elapsedTime; // _self.clock.getElapsedTime();
    (this.waterMaterial.uniforms.u_time as any).value = elapsedTime; // _self.clock.getElapsedTime();
    if (this.loopNumber < 10) {
      console.log("waterMaterial.uniforms", this.loopNumber, this.waterMaterial.uniforms.u_time.value);
    }
    this.waterMaterial.uniformsNeedUpdate = true;
    this.loopNumber++;
  }
}
