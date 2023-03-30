/**
 * This shader might need some rebuild in the future:
 *  - This contains a re-implementation of the fog (exp2) shader
 *  - no lights are recognized right now
 *
 * @date    2023-03-20
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

import * as THREE from "three";
import { TextureData } from "../../components/interfaces";
import { vertex, fragment } from "./shaders/caustic_shader_material.glsl";

export class CausticShaderMaterial {
  readonly waterMaterial: THREE.ShaderMaterial;
  private loopNumber: number = 0;

  constructor(baseTexture: TextureData) {
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
    // TODO: FIX THIS TYPE!!!
    var dTex = new THREE.DataTexture(
      baseTexture.imageData as unknown as BufferSource,
      baseTexture.imageCanvas.width,
      baseTexture.imageCanvas.height,
      THREE.RGBAFormat
    );
    dTex.needsUpdate = true;

    // const commonChunk = THREE.ShaderChunk.common;
    // const fogParsFrag = THREE.ShaderChunk.fog_pars_fragment;
    // const fogFrag = THREE.ShaderChunk.fog_fragment;
    // const fogParsVert = THREE.ShaderChunk.fog_pars_vertex;
    // const fogVert = THREE.ShaderChunk.fog_vertex;
    // const shadowVert = THREE.ShaderChunk.shadow_vert;

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
      // THREE.UniformsLib.fog,
      // THREE.UniformsLib.lights,
      {
        // Fog shader
        // TODO: take initial fog color from FogHandler?
        fogColor: { type: "t", value: new THREE.Color(0x021a38) },
        vFogDepth: { type: "f", value: 0.0021 },
        fogDensity: { type: "f", value: 0.0021 },
        // Caustic shader
        u_zoom: { type: "f", value: worldWidthSegments * 0.000025 },
        u_speed: { type: "f", value: 0.4 },
        u_bright: { type: "f", value: 32.0 },
        u_intensity: { type: "f", value: 0.5 },
        u_time: { type: "f", value: 0.0 },
        u_texture: { type: "t", value: dTex },
        // u_effect_color: { type: "t", value: new THREE.Vector4(0.19, 0.86, 0.86, 1.0) }
        u_effect_color: { type: "t", value: new THREE.Vector4(0.5, 0.85, 0.95) }
      }
    ]);
    this.waterMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      fog: true,
      transparent: false,
      alphaToCoverage: true
    });
  }

  update(elapsedTime: number, fogColor: THREE.Color) {
    this.waterMaterial.uniforms.u_time.value = elapsedTime;
    this.waterMaterial.uniforms.fogColor.value = fogColor;
    this.waterMaterial.uniformsNeedUpdate = true;
    this.loopNumber++;
  }
}
