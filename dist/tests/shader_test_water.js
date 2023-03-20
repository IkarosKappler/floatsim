globalThis.addEventListener("load", function () {
  this.clock = new THREE.Clock();
  this.scene = new THREE.Scene();

  // Initialize a new THREE renderer (you are also allowed
  // to pass an existing canvas for rendering).
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  // this.renderer.setClearColor(0xffffff, 0);
  this.renderer.autoClear = false;

  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);

  // ... and append it to the DOM
  document.body.appendChild(this.renderer.domElement);

  // Add some light
  var pointLight = new THREE.PointLight(0xffffff);
  // var pointLight = new THREE.AmbientLight(0xffffff);
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
  // Set the camera position
  this.camera.position.set(75, 75, 75);
  // And look at the cube again
  this.camera.lookAt({ x: 0, y: 0, z: 0 }); // this.cube.position);
  // Add cockpit

  //--- BEGIN--- Create Water Shader (TEST)
  var vertShader = document.getElementById("vertexShader").innerHTML;
  var fragShader = document.getElementById("fragmentShader").innerHTML;

  //---BEGIN--- Terrain Generation
  var zStartOffset = 80.0; // for Custom noise, different for Improved noise
  var worldWidthSegments = 256;
  var worldDepthSegments = 256;
  var perlinOptions = { iterations: 5, quality: 1.5 };
  var terrainData = PerlinTerrain.generatePerlinHeight(worldWidthSegments, worldDepthSegments, perlinOptions);
  var terrainSize = { width: 7500, depth: 7500, height: 0 };
  console.log("PerlinTexture", PerlinTexture);
  var baseTexture = new PerlinTexture(terrainData, terrainSize); //  worldWidthSegments, worldDepthSegments);

  var terrain = new PerlinTerrain(terrainData, terrainSize, baseTexture);
  terrain.mesh.position.y = -zStartOffset;
  terrain.mesh.scale.set(0.1, 0.1, 0.1);
  this.scene.add(terrain.mesh);
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
  var dTex = new THREE.DataTexture(baseTexture.imageData, worldWidthSegments, worldDepthSegments, THREE.RGBAFormat);
  dTex.needsUpdate = true;

  //   uniform float zoom = 127.0; // 7f;
  //   uniform float speed = .8;
  //   uniform float bright = 63.0; // 3f;
  var uniforms = {
    zoom: { type: "f", value: 0.5 }, // 127.0 },
    speed: { type: "f", value: 0.8 },
    bright: { type: "f", value: 32.0 },
    u_time: { type: "f", value: this.clock.getDelta() },
    // u_texture: { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( 'texture.jpg' ) }
    u_texture: { type: "t", value: dTex } // , texture: dTex }
  };
  var waterMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader
  });
  waterMaterial.defines = { "USE_UV": "" };
  //--- END--- Create Water Shader (TEST)

  // Create a geometry conaining the logical 3D information (here: a cube)
  var cubeGeometry = new THREE.BoxGeometry(12, 12, 12);
  // Pick a material, something like MeshBasicMaterial, PhongMaterial,
  var cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  // Create the cube from the geometry and the material ...
  this.cube = new THREE.Mesh(cubeGeometry, waterMaterial); // cubeMaterial);
  this.cube.position.set(12, 12, 12);
  // ... and add it to your scene.
  this.scene.add(this.cube);

  // THIS IS DIRTY
  //   terrain.mesh.material = waterMaterial;

  // Finally we want to be able to rotate the whole scene with the mouse:
  // add an orbit control helper.
  var _self = this;

  const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
  // Always move the point light with the camera. Looks much better ;)
  orbitControls.addEventListener("change", () => {
    pointLight.position.copy(_self.camera.position);
  });
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
    // _self.cube.rotation.x += 0.01;
    // _self.cube.rotation.y += 0.005;
    _self.renderer.render(_self.scene, _self.camera);

    // waterMaterial.uniforms.u_time.value = _self.clock.getElapsedTime();
    _self.cube.material.uniforms.u_time.value = elapsedTime; // _self.clock.getElapsedTime();
    waterMaterial.uniforms.u_texture.texture = dTex;
    _self.cube.material.uniforms.u_texture.texture = dTex;
    if (loopNumber < 10) {
      console.log("waterMaterial.uniforms", loopNumber, waterMaterial.uniforms.u_time.value);
    }
    // waterMaterial.uniformsNeedUpdate = true;
    // terrain.mesh.material.uniformsNeedUpdate = true;
    terrain.causticShaderMaterial.update(elapsedTime);
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
