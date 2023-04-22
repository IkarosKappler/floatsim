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

  var tweakParams = {
    shutter_color: 0x001828,
    shutter_amount: 0.5,
    canvas_width: 180,
    canvas_height: 180,
    direction_h_ltr: true,
    direction_v_ttb: true
  };

  //--- BEGIN--- Create Cutscene Shader (TEST)
  var vertShader = document.getElementById("vertexShader").innerHTML;
  var fragShader = document.getElementById("fragmentShader").innerHTML;
  var textureImage = new THREE.TextureLoader().load("../resources/img/cockpit-nasa.png", function (tex) {});
  var uniforms = {
    // Fog
    u_shutter_color: { type: "t", value: new THREE.Color(tweakParams.shutter_color) },
    u_canvas_width: { type: "i", value: tweakParams.canvas_width },
    u_canvas_height: { type: "i", value: tweakParams.canvas_height },
    u_use_texture: { type: "b", value: true },
    u_direction_h_ltr: { type: "b", value: true },
    u_direction_v_ttb: { type: "b", value: true },
    u_shutter_amount: { type: "f", value: tweakParams.shutter_amount },
    u_texture: { type: "t", value: textureImage },
    u_effect_color: { type: "t", value: new THREE.Vector4(0.29, 0.75, 0.89) }
  };
  var cutsceneMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    transparent: true
  });
  //--- END--- Create Cutscene Shader (TEST)

  const planeGeometry = new THREE.BoxGeometry(100, 1, 100, 1, 1, 1);
  this.planeMesh = new THREE.Mesh(planeGeometry, cutsceneMaterial);
  this.scene.add(this.planeMesh);

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
  orbitControls.target.copy(planeMesh.position);

  //   console.log("Stats", Stats);
  this.stats = new Stats.Stats();
  document.querySelector("body").appendChild(this.stats.domElement);

  var loopNumber = 0;
  var _render = function () {
    var elapsedTime = _self.clock.getElapsedTime();
    _self.stats.update();
    _self.renderer.render(_self.scene, _self.camera);
    // _self.planeMesh.material.uniformsNeedUpdate = true;
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

  var pane = new window["Tweakpane"].Pane();
  pane.addInput(tweakParams, "canvas_width", { min: 1, max: 1000 }).on("change", function (ev) {
    _self.planeMesh.material.uniforms.u_canvas_width.value = ev.value;
    _self.planeMesh.material.uniformsNeedUpdate = true;
  });
  pane.addInput(tweakParams, "canvas_height", { min: 1, max: 1000 }).on("change", function (ev) {
    _self.planeMesh.material.uniforms.u_canvas_height.value = ev.value;
    _self.planeMesh.material.uniformsNeedUpdate = true;
  });
  pane
    .addInput(tweakParams, "shutter_amount", {
      min: 0.0,
      max: 1.0
    })
    .on("change", function (ev) {
      _self.planeMesh.material.uniforms.u_shutter_amount.value = ev.value;
      _self.planeMesh.material.uniformsNeedUpdate = true;
    });
  pane.addInput(tweakParams, "direction_h_ltr").on("change", function (ev) {
    _self.planeMesh.material.uniforms.u_direction_h_ltr.value = ev.value;
    _self.planeMesh.material.uniformsNeedUpdate = true;
  });
  pane.addInput(tweakParams, "direction_v_ttb").on("change", function (ev) {
    _self.planeMesh.material.uniforms.u_direction_v_ttb.value = ev.value;
    _self.planeMesh.material.uniformsNeedUpdate = true;
  });
  pane
    .addInput(tweakParams, "shutter_color", {
      view: "color"
    })
    .on("change", function (ev) {
      _self.planeMesh.material.uniforms.u_shutter_color.value = new THREE.Color(ev.value);
      _self.planeMesh.material.uniformsNeedUpdate = true;
    });
});
