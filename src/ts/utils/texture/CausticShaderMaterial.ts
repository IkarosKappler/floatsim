/**
 * @date    2023-03-20
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

import * as THREE from "three";
import { PerlinHeightMap, TextureData } from "../../components/interfaces";

const vertShader = `
        // # include <fog_pars_vertex>
        #include <fog_vertex>

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

      #include <fog_fragment>
      // # include <fog_pars_fragment>

      // Scales the effect
        uniform float u_zoom;
        // The effect speed
        uniform float u_speed;
        // General brightness
        uniform float u_bright;
        // Intensity, like the maximal alpha value of the effect
        uniform float u_intensity;
        // The current shader animation time frame
        uniform float u_time;
        // The underlying texture to use
        uniform sampler2D u_texture;
        // The effect color on its peak brightness value
        uniform vec4 u_effect_color;


        varying vec2 vUv;
        varying vec3 vposition;

        void main()
        {
            // uncoment when using real texture
            // vec4 texture_color = texture2D(u_texture, vUv.xy);
            // vec4 effect_color = vec4(0.19, 0.86, 0.86, 1.0);
            vec4 texture_color = vec4(0.19, 0.86, 0.86, 0.0);


            vec4 k = vec4(u_time)*u_speed;

            // Use the xz-coordinated to view from top
            k.xy = vec2(vposition.x, vposition.z) * u_zoom;
            vec3 factors = vec3(1.0,1.0,1.0);

            float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*factors.x*0.5));
            float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*factors.y*0.2));
            float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*factors.z*0.5));
            
            gl_FragColor = vec4 (pow(min(min(val1,val2),val3), 8.0) * u_bright)+texture_color;
            // float brightValue = pow(min(min(val1,val2),val3), 8.0) * u_bright;

            // gl_FragColor = texture_color + (effect_color-texture_color) * min(intensity,brightValue);
            // gl_FragColor = texture_color + (u_effect_color-texture_color) * min(u_intensity,brightValue);

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
      baseTexture.imageCanvas.width, //  worldWidthSegments,
      baseTexture.imageCanvas.height, //  worldDepthSegments,
      THREE.RGBAFormat
    );

    dTex.needsUpdate = true;

    // var uniforms = {
    //   u_zoom: { type: "f", value: worldWidthSegments * 0.00001 }, // 0.05 }, // 127.0 },
    //   u_speed: { type: "f", value: 0.4 },
    //   u_bright: { type: "f", value: 32.0 },
    //   u_intensity: { type: "f", value: 0.5 },
    //   u_time: { type: "f", value: 0.0 },
    //   u_texture: { type: "t", value: dTex }, // , texture: dTex }
    //   u_effect_color: { type: "t", value: new THREE.Vector4(0.19, 0.86, 0.86, 1.0) }
    // };
    var uniforms = THREE.UniformsUtils.merge([
      // THREE.UniformsLib["fog"],
      // THREE.UniformsLib.common,
      // THREE.UniformsLib.specularmap,
      // THREE.UniformsLib.envmap,
      // THREE.UniformsLib.aomap,
      // THREE.UniformsLib.lightmap,
      // THREE.UniformsLib.emissivemap,
      // THREE.UniformsLib.bumpmap,
      // THREE.UniformsLib.normalmap,
      // THREE.UniformsLib.displacementmap,
      // THREE.UniformsLib.gradientmap,
      THREE.UniformsLib.fog,
      // THREE.UniformsLib.lights,
      {
        u_zoom: { type: "f", value: worldWidthSegments * 0.00001 }, // 0.05 }, // 127.0 },
        u_speed: { type: "f", value: 0.4 },
        u_bright: { type: "f", value: 32.0 },
        u_intensity: { type: "f", value: 0.5 },
        u_time: { type: "f", value: 0.0 },
        u_texture: { type: "t", value: dTex }, // , texture: dTex }
        // u_effect_color: { type: "t", value: new THREE.Vector4(0.19, 0.86, 0.86, 1.0) }
        // u_effect_color: { type: "t", value: new THREE.Vector4(0.9, 0.9, 0.9, 1.0) }
        u_effect_color: { type: "t", value: new THREE.Vector4(0.19, 0.86, 0.86, 1.0) }
      }
    ]);
    this.waterMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      transparent: true
      // fog: true,
      // fogColor: new THREE.Color(0x021a38) // TODO: get from fog handler
    });
    // TODO: is this still required?
    // this.waterMaterial.defines = { "USE_UV": "" };

    // --- BEGIN--- MIX IN FOG SHADER

    const commonChunk = THREE.ShaderChunk.common; // ["common"];
    const fogParsFrag = THREE.ShaderChunk.fog_pars_fragment; //["fog_pars_fragment"];
    const fogFrag = THREE.ShaderChunk.fog_fragment; // ["fog_fragment"];
    // const fogFrag = ${THREE.ShaderChunk[ "fog_fragment" ]}
    const fogParsVert = THREE.ShaderChunk.fog_pars_fragment; // ["fog_pars_vertex"];
    const fogVert = THREE.ShaderChunk.fog_pars_fragment; // ["fog_vertex"];

    // console.log("fogParsFrag", fogParsFrag);
    // console.log("fogFrag", fogFrag);
    // console.log("fogParsVert", fogParsVert);
    // console.log("fogVert", fogVert);

    // this.waterMaterial.onBeforeCompile = shader => {
    //   shader.vertexShader = shader.vertexShader.replace(`#include <fog_pars_vertex>`, fogParsVert);
    //   shader.vertexShader = shader.vertexShader.replace(`#include <fog_vertex>`, fogVert);
    //   shader.fragmentShader = shader.fragmentShader.replace(`#include <fog_pars_fragment>`, fogParsFrag);
    //   shader.fragmentShader = shader.fragmentShader.replace(`#include <fog_fragment>`, fogFrag);
    // };

    // --- END --- MIX IN FOG SHADER
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
