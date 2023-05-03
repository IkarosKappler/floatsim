/**
 * This shader might need some rebuild in the future:
 *  - This contains a re-implementation of the fog (exp2) shader
 *  - no lights are recognized right now
 *
 * @date     2023-03-20
 * @modified 2023-05-03 Refactored to a new class that extends MeshBasicMaterial.
 * @author   Ikaros Kappler
 * @version  1.1.0
 */

import * as THREE from "three";
import { TextureData } from "../../components/interfaces";
import { Caustic_Shader2 } from "./shaders/caustic_shader_material2.glsl";

export class CausticShaderMaterial2 {
  readonly waterMaterial: THREE.MeshBasicMaterial;
  private loopNumber: number = 0;

  constructor(baseTexture: TextureData) {
    //---BEGIN--- Terrain Generation
    const worldWidthSegments = 256;
    const worldDepthSegments = 256;

    const imageData = baseTexture.imageData;
    const buffer = imageData.data.buffer; // ArrayBuffer
    const arrayBuffer = new ArrayBuffer(imageData.data.length);
    const binary = new Uint8Array(arrayBuffer);
    for (var i = 0; i < binary.length; i++) {
      binary[i] = imageData.data[i];
    }
    // TODO: FIX THIS TYPE!!!
    const dTex = new THREE.DataTexture(
      baseTexture.imageData as unknown as BufferSource,
      baseTexture.imageCanvas.width,
      baseTexture.imageCanvas.height,
      THREE.RGBAFormat
    );
    dTex.needsUpdate = true;

    const uniforms = {
      // Define uniforms according to my custom-shader-2.
      u_zoom: { type: "f", value: worldWidthSegments * 0.000025 },
      u_speed: { type: "f", value: 0.4 },
      u_bright: { type: "f", value: 32.0 },
      u_intensity: { type: "f", value: 0.5 },
      u_time: { type: "f", value: 0 },
      // Is not used by my shader anymore (used in MeshBasicMaterial instead)
      //   u_texture: { type: "t", value: dTex },
      u_effect_color: { type: "t", value: new THREE.Vector4(0.29, 0.75, 0.89) }
    };

    this.waterMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      fog: true,
      map: dTex
    });
    // How to pass uniforms to my custom shader?
    //    See https://medium.com/@pailhead011/extending-three-js-materials-with-glsl-78ea7bbb9270
    this.waterMaterial.userData.myUniforms = uniforms;
    this.waterMaterial.onBeforeCompile = (shader, renderer) => {
      //   console.log("onBeforeCompile");
      //   console.log(shader.fragmentShader);
      //   console.log(shader.vertexShader);

      // Pass my uniforms to the shader by reference (!)
      //    this will make them accessible and changeable later.
      for (var entry of Object.entries(this.waterMaterial.userData.myUniforms)) {
        const uniformName = entry[0];
        const uniformValue = entry[1] as THREE.IUniform<any>;
        shader.uniforms[uniformName] = uniformValue;
      }

      // Compare to:
      //    https://threejs.org/examples/webgl_materials_modified
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <clipping_planes_pars_fragment>",
          ["#include <clipping_planes_pars_fragment>", Caustic_Shader2.fragment_pars].join("\n")
        )
        .replace("#include <dithering_fragment>", ["#include <dithering_fragment>", Caustic_Shader2.fragment].join("\n"));

      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <clipping_planes_pars_vertex>",
          ["#include <clipping_planes_pars_vertex>", Caustic_Shader2.vertex_pars].join("\n")
        )
        .replace("#include <fog_vertex>", ["#include <fog_vertex>", Caustic_Shader2.vertex].join("\n"));
    };
  }

  update(elapsedTime: number, fogColor: THREE.Color) {
    this.waterMaterial.userData.myUniforms.u_time.value = elapsedTime;
    // this.waterMaterial.uniformsNeedUpdate = true;
    // this.waterMaterial.needsUpdate = true;
    this.loopNumber++;
  }
}
