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
  var vertShader = document.getElementById("vertexShader").innerHTML;
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
    fogColor: { type: "t", value: new THREE.Color(0x021a38) }, // TODO: change fog color
    vFogDepth: { type: "f", value: 0.0021 }, // ???
    fogDensity: { type: "f", value: 0.0021 }, // TODO: take from FogHandler
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
  var waterMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    transparent: true
  });
  //--- END--- Create Water Shader (TEST)

  // Create a geometry conaining the logical 3D information (here: a cube)
  var cubeGeometry = new THREE.BoxGeometry(12, 12, 12);
  // Pick a material, something like MeshBasicMaterial, PhongMaterial,
  var cubeBaseMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  // Create the cube from the geometry and the material ...
  cubeGeometry.clearGroups();
  cubeGeometry.addGroup(0, Number.POSITIVE_INFINITY, 0);
  cubeGeometry.addGroup(0, Number.POSITIVE_INFINITY, 1);
  this.cube = new THREE.Mesh(cubeGeometry, [cubeBaseMaterial, waterMaterial]);

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
    _self.stats.update();
    // Let's animate the cube: a rotation.
    _self.cube.rotation.x += 0.01;
    _self.cube.rotation.y += 0.005;
    _self.renderer.render(_self.scene, _self.camera);

    _self.cube.material[1].uniforms.u_time.value = elapsedTime;
    terrain.causticShaderMaterial.update(elapsedTime, this.scene.fog.color);
    _self.cube.material[1].uniformsNeedUpdate = true;

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
