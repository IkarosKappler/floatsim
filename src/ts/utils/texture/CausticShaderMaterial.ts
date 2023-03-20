/**
 * @date    2023-03-20
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

import * as THREE from "three";
import { PerlinHeightMap, TextureData } from "../../components/interfaces";
import { PerlinTerrain } from "../../components/PerlinTerrain";
import { PerlinTexture } from "./PerlinTexture";

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
    // this.clock = new THREE.Clock();
    // this.scene = new THREE.Scene();

    // // Initialize a new THREE renderer (you are also allowed
    // // to pass an existing canvas for rendering).
    // this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // // this.renderer.setClearColor(0xffffff, 0);
    // this.renderer.autoClear = false;

    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);

    // // ... and append it to the DOM
    // document.body.appendChild(this.renderer.domElement);

    // // Add some light
    // var pointLight = new THREE.PointLight(0xffffff);
    // // var pointLight = new THREE.AmbientLight(0xffffff);
    // pointLight.position.x = 10;
    // pointLight.position.y = 50;
    // pointLight.position.z = 130;
    // this.scene.add(pointLight);

    // // Add grid helper
    // var gridHelper = new THREE.GridHelper(90, 9, 0xff0000, 0xe8e8e8);
    // this.scene.add(gridHelper);
    // // Add an axes helper
    // var ah = new THREE.AxesHelper(50);
    // ah.position.y -= 0.1; // The axis helper should not intefere with the grid helper
    // this.scene.add(ah);
    // // Set the camera position
    // this.camera.position.set(75, 75, 75);
    // // And look at the cube again
    // this.camera.lookAt({ x: 0, y: 0, z: 0 }); // this.cube.position);
    // // Add cockpit

    //--- BEGIN--- Create Water Shader (TEST)
    // var vertShader = document.getElementById("vertexShader").innerHTML;
    // var fragShader = document.getElementById("fragmentShader").innerHTML;

    //---BEGIN--- Terrain Generation
    var zStartOffset = 80.0; // for Custom noise, different for Improved noise
    var worldWidthSegments = 256;
    var worldDepthSegments = 256;
    var perlinOptions = { iterations: 5, quality: 1.5 };
    // var terrainData = PerlinTerrain.generatePerlinHeight(worldWidthSegments, worldDepthSegments, perlinOptions);
    var terrainSize = { width: 7500, depth: 7500, height: 0 };
    console.log("PerlinTexture", PerlinTexture);
    // var baseTexture = new PerlinTexture(terrainData, terrainSize); //  worldWidthSegments, worldDepthSegments);

    // var terrain = new PerlinTerrain(terrainData, terrainSize, baseTexture);
    // terrain.mesh.position.y = -zStartOffset;
    // terrain.mesh.scale.set(0.1, 0.1, 0.1);
    // this.scene.add(terrain.mesh);
    //---END--- Terrain Generation

    //   var baseTexture = PerlinTerrain.generateTexture(terrainData.data, worldWidthSegments, worldDepthSegments);
    //   var dTex = new THREE.DataTexture(baseTexture.imageData, worldWidthSegments, worldDepthSegments, THREE.RGBAFormat);
    //   dTex.needsUpdate = true;

    //   var baseTexture = PerlinTerrain.generateTexture(terrainData.data, worldWidthSegments, worldDepthSegments);
    //   var baseTexture = new PerlinTexure(terrainData, terrainSize); //  worldWidthSegments, worldDepthSegments);

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
      zoom: { type: "f", value: 0.5 }, // 127.0 },
      speed: { type: "f", value: 0.8 },
      bright: { type: "f", value: 32.0 },
      u_time: { type: "f", value: 0.0 }, //this.clock.getDelta() },
      // u_texture: { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( 'texture.jpg' ) }
      u_texture: { type: "t", value: dTex } // , texture: dTex }
    };
    this.waterMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertShader,
      fragmentShader: fragShader
    });
    this.waterMaterial.defines = { "USE_UV": "" };
    //--- END--- Create Water Shader (TEST)

    // // Create a geometry conaining the logical 3D information (here: a cube)
    // var cubeGeometry = new THREE.BoxGeometry(12, 12, 12);
    // // Pick a material, something like MeshBasicMaterial, PhongMaterial,
    // var cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    // // Create the cube from the geometry and the material ...
    // this.cube = new THREE.Mesh(cubeGeometry, waterMaterial); // cubeMaterial);
    // this.cube.position.set(12, 12, 12);
    // // ... and add it to your scene.
    // this.scene.add(this.cube);

    // // THIS IS DIRTY
    // //   terrain.mesh.material = waterMaterial;

    // // Finally we want to be able to rotate the whole scene with the mouse:
    // // add an orbit control helper.
    // var _self = this;

    // const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    // // Always move the point light with the camera. Looks much better ;)
    // orbitControls.addEventListener("change", () => {
    //   pointLight.position.copy(_self.camera.position);
    // });
    // orbitControls.enableDamping = true;
    // orbitControls.dampingFactor = 1.0;
    // orbitControls.enableZoom = true;
    // orbitControls.target.copy(cube.position);

    // //   console.log("Stats", Stats);
    // this.stats = new Stats.Stats();
    // document.querySelector("body").appendChild(this.stats.domElement);

    // var loopNumber = 0;
    // var _render = function () {
    //   _self.stats.update();
    //   // Let's animate the cube: a rotation.
    //   // _self.cube.rotation.x += 0.01;
    //   // _self.cube.rotation.y += 0.005;
    //   _self.renderer.render(_self.scene, _self.camera);

    //   // waterMaterial.uniforms.u_time.value = _self.clock.getElapsedTime();
    //   _self.cube.material.uniforms.u_time.value = _self.clock.getElapsedTime();
    //   waterMaterial.uniforms.u_texture.texture = dTex;
    //   _self.cube.material.uniforms.u_texture.texture = dTex;
    //   if (loopNumber < 10) {
    //     console.log("waterMaterial.uniforms", loopNumber, waterMaterial.uniforms.u_time.value);
    //   }
    //   // waterMaterial.uniformsNeedUpdate = true;
    //   _self.cube.material.uniformsNeedUpdate = true;

    //   loopNumber++;
    //   requestAnimationFrame(_render);
    // };
    // _render();
  }

  update(elapsedTime: number) {
    // self.cube.material.uniforms.u_time.value = elapsedTime; // _self.clock.getElapsedTime();
    (this.waterMaterial.uniforms.u_time as any).value = elapsedTime; // _self.clock.getElapsedTime();
    // (this.waterMaterial.uniforms.u_texture as any).texture = dTex;
    // _self.cube.material.uniforms.u_texture.texture = dTex;
    if (this.loopNumber < 10) {
      console.log("waterMaterial.uniforms", this.loopNumber, this.waterMaterial.uniforms.u_time.value);
    }
    this.waterMaterial.uniformsNeedUpdate = true;
    // _self.cube.material.uniformsNeedUpdate = true;
    this.loopNumber++;
  }
}
