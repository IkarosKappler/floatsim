globalThis.addEventListener("load", function () {
  this.clock = new THREE.Clock();
  this.scene = new THREE.Scene();

  const tweakParams = {
    iterations: 5,
    quality: 2.5,
    y: 0.0
  };

  // Initialize a new THREE renderer (you are also allowed
  // to pass an existing canvas for rendering).
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.autoClear = false;

  this.scene.background = new THREE.Color(0.75, 0.86, 0.86);
  this.scene.fog = new THREE.FogExp2(0x021a38, 0.0051 / 4);

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

  const ambientLight = new THREE.AmbientLight(0x888888);
  this.scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.x = 20;
  directionalLight.position.y = -100;
  directionalLight.position.z = 15;
  this.scene.add(directionalLight);

  // Add grid helper
  var gridHelper = new THREE.GridHelper(90, 9, 0xff0000, 0xe8e8e8);
  this.scene.add(gridHelper);
  // Add an axes helper
  var ah = new THREE.AxesHelper(50);
  ah.position.y -= 0.1; // The axis helper should not intefere with the grid helper
  this.scene.add(ah);

  //---BEGIN--- Terrain Generation
  var planeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  var terrainSize = { width: 20, depth: 20, height: 0.1 };
  var terrainCenter = new THREE.Vector3(0, 0, 0);
  var terrainBounds = new THREE.Box3(
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
  var worldSize = bounds2size(terrainBounds);

  var worldWidthSegments = 256;
  var worldDepthSegments = 256;

  var meshes = [];

  var rebuildTerrainAt = function (offsetX, offsetY) {
    var perlinOptions = {
      iterations: tweakParams.iterations,
      quality: tweakParams.quality,
      offset: { x: offsetX, y: offsetY + tweakParams.y }
    };
    var heightMap = new PerlinHeightMap(worldWidthSegments, worldDepthSegments, perlinOptions);
    heightMap.bilinearSmoothstep(2);

    var geometry = PerlinTerrain.heightMapToPlaneGeometry(heightMap, worldSize);
    var mesh = new THREE.Mesh(geometry, planeMaterial);
    meshes.push(mesh);
    // mesh.scale.set(0.01, 0.01, 0.01);
    mesh.position.set(offsetX * terrainSize.width, 0, offsetY * terrainSize.depth);
    this.scene.add(mesh);
  };
  var rebuildTerrain = function () {
    for (var i in meshes) {
      this.scene.remove(meshes[i]);
    }
    meshes = [];
    rebuildTerrainAt(0, 0);
    rebuildTerrainAt(0, 1.0);
  };
  rebuildTerrain();

  // Finally we want to be able to rotate the whole scene with the mouse:
  // add an orbit control helper.
  var _self = this;

  const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
  // Always move the point light with the camera. Looks much better ;)
  const updateCameraLight = () => {
    // pointLight.position.copy(_self.camera.position);
  };
  orbitControls.addEventListener("change", updateCameraLight);
  updateCameraLight();
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 1.0;
  orbitControls.enableZoom = true;
  orbitControls.target.copy(new THREE.Vector3()); // cube.position);

  //   console.log("Stats", Stats);
  this.stats = new Stats.Stats();
  document.querySelector("body").appendChild(this.stats.domElement);

  var loopNumber = 0;
  var _render = function () {
    var elapsedTime = _self.clock.getElapsedTime();
    _self.stats.update();
    _self.renderer.render(_self.scene, _self.camera);
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

  var initTweakPane = function () {
    // console.log(TweakPane);
    const pane = new window["Tweakpane"].Pane();
    pane.addInput(tweakParams, "y", {
      min: -1.0,
      max: 1.0
    });
    pane.addInput(tweakParams, "iterations", {
      min: 1,
      max: 10,
      step: 1
    });
    pane.addInput(tweakParams, "quality", {
      min: 0.0,
      max: 5.0
    });
    pane.on("change", ev => {
      // console.log("changed: " + JSON.stringify(ev.value));
      rebuildTerrain();
    });
  };
  initTweakPane();
});
