globalThis.addEventListener("load", function () {
  this.clock = new THREE.Clock();
  this.scene = new THREE.Scene();

  // Initialize a new THREE renderer (you are also allowed
  // to pass an existing canvas for rendering).
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.autoClear = false;

  this.scene.background = new THREE.Color(0.75, 0.86, 0.86);
  this.scene.fog = new THREE.FogExp2(0x021a38, 0.0051);

  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  this.camera.position.set(75, 75, 75);
  this.camera.lookAt({ x: 0, y: 0, z: 0 });

  // ... and append it to the DOM
  document.body.appendChild(this.renderer.domElement);

  // Add some light
  var pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  // Add grid helper
  var gridHelper = new THREE.GridHelper(90, 9, 0xff0000, 0xe8e8e8);
  this.scene.add(gridHelper);
  // Add an axes helper
  var ah = new THREE.AxesHelper(50);
  ah.position.y -= 0.1; // The axis helper should not intefere with the grid helper
  this.scene.add(ah);

  //--- BEGIN--- Create Water Shader (TEST)
  var vertShader_pars = document.getElementById("vertexShader-pars").innerHTML;
  var vertShader = document.getElementById("vertexShader").innerHTML;
  var fragShader_pars = document.getElementById("fragmentShader-pars").innerHTML;
  var fragShader = document.getElementById("fragmentShader").innerHTML;

  //---BEGIN--- Terrain Generation
  var zStartOffset = 80.0; // for Custom noise, different for Improved noise
  var worldWidthSegments = 256;
  var worldDepthSegments = 256;
  var perlinOptions = { iterations: 5, quality: 1.5 };
  var heightMap = new PerlinHeightMap(worldWidthSegments, worldDepthSegments, perlinOptions);
  // var terrainSize = { width: 7500, depth: 7500, height: 0 };
  const terrainSize = { width: 2048.0, depth: 2048.0, height: 10.0 };
  console.log("PerlinTexture", PerlinTexture);
  var baseTexture = new PerlinTexture(heightMap, terrainSize);

  const terrainCenter = new THREE.Vector3(0, 0, 0);
  const terrainBounds = new THREE.Box3(
    new THREE.Vector3(
      terrainCenter.x - terrainSize.width / 2.0,
      terrainCenter.y - terrainSize.height / 2.0,
      terrainCenter.z - terrainSize.depth / 2.0
    ),
    new THREE.Vector3(
      terrainCenter.x + terrainSize.width / 2.0,
      terrainCenter.y + terrainSize.height / 2.0,
      terrainCenter.z + terrainSize.depth / 2.0
    )
  );
  const terrainTexture = new PerlinTexture(heightMap, terrainSize);
  // const terrain = new PerlinTerrain(terrainData, terrainSize, terrainTexture);
  const terrain = new PerlinTerrain(heightMap, terrainBounds, terrainTexture);

  // var terrain = new PerlinTerrain(heightMap, terrainSize, baseTexture);
  terrain.mesh.position.y = -zStartOffset;
  terrain.mesh.scale.set(0.1, 0.1, 0.1);
  this.scene.add(terrain.mesh);
  //---END--- Terrain Generation

  var imageData = baseTexture.imageData;
  var buffer = imageData.data.buffer; // ArrayBuffer
  var arrayBuffer = new ArrayBuffer(imageData.data.length);
  var binary = new Uint8Array(arrayBuffer);
  for (var i = 0; i < binary.length; i++) {
    binary[i] = imageData.data[i];
  }
  var dTex = new THREE.DataTexture(baseTexture.imageData, worldWidthSegments, worldDepthSegments, THREE.RGBAFormat);
  dTex.needsUpdate = true;

  var uniforms = {
    // Fog
    // fogColor: { type: "t", value: new THREE.Color(0x021a38) }, // TODO: change fog color
    // vFogDepth: { type: "f", value: 0.0021 }, // ???
    // fogDensity: { type: "f", value: 0.0021 }, // TODO: take from FogHandler
    // Caustics
    u_zoom: { type: "f", value: 0.5 },
    u_speed: { type: "f", value: 0.4 },
    u_bright: { type: "f", value: 32.0 },
    u_intensity: { type: "f", value: 0.5 },
    u_time: { type: "f", value: this.clock.getDelta() },
    u_texture: { type: "t", value: dTex }, // , texture: dTex }
    // u_effect_color: { type: "t", value: new THREE.Color(0.19, 0.86, 0.86) },
    u_effect_color: { type: "t", value: new THREE.Vector4(0.29, 0.75, 0.89) }
  };
  // var waterMaterial = new THREE.ShaderMaterial({
  //   uniforms: uniforms,
  //   vertexShader: vertShader,
  //   fragmentShader: fragShader,
  //   transparent: true
  // });
  var waterMaterial = new THREE.MeshBasicMaterial({
    // uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    transparent: true,
    fog: true,
    fogColor: 0x021a38,
    vFogDepth: 0.0021,
    fogDensity: 0.0021,
    map: dTex
    // u_zoom: 0.5,
    // u_speed: 0.4,
    // u_bright: 32.0,
    // u_intensity: 0.5,
    // u_time: this.clock.getDelta(),
    // u_texture: dTex,
    // u_effect_color: new THREE.Vector4(0.29, 0.75, 0.89)
  });
  // How to pass uniforms to my custom shader?
  //    See https://medium.com/@pailhead011/extending-three-js-materials-with-glsl-78ea7bbb9270
  waterMaterial.userData.myUniforms = uniforms;
  waterMaterial.onBeforeCompile = (shader, renderer) => {
    console.log("onBeforeCompile");
    console.log(shader.fragmentShader);
    console.log(shader.vertexShader);

    // shader.uniforms.u_time = waterMaterial.userData.myUniforms.u_time; //pass this input by reference
    // Pass my uniforms to the shader by reference (!)
    //    this will make them accessible and changeable later.
    for (var entry of Object.entries(waterMaterial.userData.myUniforms)) {
      var uniformName = entry[0];
      var uniformValue = entry[1];
      shader.uniforms[uniformName] = uniformValue;
    }

    // Compare to:
    //    https://threejs.org/examples/webgl_materials_modified
    // shader.uniforms.fogColor = { value: new THREE.Vector3(2, 26, 56) };
    // shader.uniforms.vFogDepth = { value: 0.0021 };
    // shader.uniforms.fogDensity = { value: 0.0021 };
    shader.uniforms.u_zoom = { value: 0.5 };
    shader.uniforms.u_speed = { type: "f", value: 0.4 };
    shader.uniforms.u_bright = { value: 32.0 };
    shader.uniforms.u_intensity = { value: 0.5 };
    // shader.uniforms.u_time = { type: "f", value: this.clock.getDelta() };
    shader.uniforms.u_texture = { value: dTex }; // This can probably be removed
    shader.uniforms.u_effect_color = { value: new THREE.Vector4(0.29, 0.75, 0.89) };

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <clipping_planes_pars_fragment>",
        ["#include <clipping_planes_pars_fragment>", fragShader_pars].join("\n")
      )
      .replace("#include <dithering_fragment>", ["#include <dithering_fragment>", fragShader].join("\n"));

    shader.vertexShader = shader.vertexShader
      .replace("#include <clipping_planes_pars_vertex>", ["#include <clipping_planes_pars_vertex>", vertShader_pars].join("\n"))
      .replace("#include <fog_vertex>", ["#include <fog_vertex>", vertShader].join("\n"));
  };
  //--- END--- Create Water Shader (TEST)

  // Create a geometry conaining the logical 3D information (here: a cube)
  var cubeGeometry = new THREE.BoxGeometry(12, 12, 12);
  // Pick a material, something like MeshBasicMaterial, PhongMaterial,
  // var cubeBaseMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  // Create the cube from the geometry and the material ...
  // cubeGeometry.clearGroups();
  // cubeGeometry.addGroup(0, Number.POSITIVE_INFINITY, 0);
  // cubeGeometry.addGroup(0, Number.POSITIVE_INFINITY, 1);
  // this.cube = new THREE.Mesh(cubeGeometry, [cubeBaseMaterial, waterMaterial]);

  this.cube = new THREE.Mesh(cubeGeometry, waterMaterial);
  //  // this.geometry = new THREE.BufferGeometry();
  // fogColor: 0x021a38,
  //   vFogDepth: 0.0021,
  //   fogDensity: 0.0021,
  // u_zoom: 0.5,
  //   u_speed: 0.4,
  //   u_bright: 32.0,
  //   u_intensity: 0.5,
  //   u_time: this.clock.getDelta(),
  //   u_texture: dTex,
  //   u_effect_color: new THREE.Vector4(0.29, 0.75, 0.89)

  // var fogColor = new Int8Array(3);
  // fogColor[0] = 2;
  // fogColor[1] = 26;
  // fogColor[2] = 56;
  // this.cube.geometry.setAttribute("fogColor", new THREE.Float32BufferAttribute(fogColor, 3)); // 0x021a38
  // this.cube.geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
  // this.cube.geometry.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 4));
  // this.cube.geometry.setAttribute("aRotation", new THREE.Float32BufferAttribute(angles, 1));

  // this.cube.geometry.attributes.position.needsUpdate = true;
  // this.cube.geometry.attributes.aSize.needsUpdate = true;
  // this.cube.geometry.attributes.aColor.needsUpdate = true;
  // this.cube.geometry.attributes.aRotation.needsUpdate = true;

  this.cube.position.set(12, 12, 12);
  // ... and add it to your scene.
  this.scene.add(this.cube);

  // Finally we want to be able to rotate the whole scene with the mouse:
  // add an orbit control helper.
  var _self = this;

  const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
  // Always move the point light with the camera. Looks much better ;)
  const updateCameraLight = () => {
    pointLight.position.copy(_self.camera.position);
  };
  orbitControls.addEventListener("change", updateCameraLight);
  updateCameraLight();
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 1.0;
  orbitControls.enableZoom = true;
  orbitControls.target.copy(cube.position);

  //   console.log("Stats", Stats);
  this.stats = new Stats.Stats();
  document.querySelector("body").appendChild(this.stats.domElement);

  var loopNumber = 0;
  var _render = function () {
    var elapsedTime = _self.clock.getElapsedTime();
    // if (loopNumber < 10) {
    //   console.log("elapsedTime", elapsedTime);
    // }
    _self.stats.update();
    // Let's animate the cube: a rotation.
    _self.cube.rotation.x += 0.01;
    _self.cube.rotation.y += 0.005;
    _self.renderer.render(_self.scene, _self.camera);

    // _self.cube.material.uniforms.u_time.value = elapsedTime;
    // TODO: UPDATING THE TIME IS NOT WORKING ANY MORE
    // var u_time_attribute_array = new Float32Array(1);
    // u_time_attribute_array[0] = elapsedTime;
    // var u_time_attribute = new THREE.Float32BufferAttribute(u_time_attribute_array, 1);
    // _self.cube.geometry.setAttribute("u_time", u_time_attribute);
    // u_time_attribute.needsUpdate = true;
    // self.cube.geometry.attributes.u_time.needsUpdate = true;
    waterMaterial.userData.myUniforms.u_time.value = elapsedTime;

    terrain.causticShaderMaterial.update(elapsedTime, _self.scene.fog.color);
    _self.cube.material.uniformsNeedUpdate = true;

    loopNumber++;
    requestAnimationFrame(_render);
  };
  _render();

  function onWindowResize() {
    _self.camera.aspect = window.innerWidth / window.innerHeight;
    _self.camera.updateProjectionMatrix();
    _self.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Call the rendering function. This will cause and infinite recursion (we want
  // that here, because the animation shall run forever).
  onWindowResize();

  window.addEventListener("resize", function () {
    onWindowResize();
  });
});
