import * as THREE from "three";
import { HUDData } from "./interfaces";

export class HudComponent {
  private hudCanvas: HTMLCanvasElement;
  private hudBitmap: CanvasRenderingContext2D;
  private hudCamera: THREE.OrthographicCamera;
  private hudScene: THREE.Scene;
  private hudImage: HTMLImageElement;
  private hudTexture: THREE.Texture;
  private hudMaterial: THREE.MeshBasicMaterial;
  private plane: THREE.Mesh;
  private compassMesh: THREE.Mesh;

  constructor(width: number, height: number) {
    // BEGIN Try a HUD
    // We will use 2D canvas element to render our HUD.
    this.hudCanvas = document.createElement("canvas");
    // Again, set dimensions to fit the screen.
    this.hudCanvas.width = width;
    this.hudCanvas.height = height;

    // Get 2D context and draw something supercool.
    this.hudBitmap = this.hudCanvas.getContext("2d");
    this.hudBitmap.font = "Normal 16px Arial";
    this.hudBitmap.textAlign = "center";
    this.hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
    this.hudBitmap.fillText("Initializing...", width / 2, height / 2);
    this.hudImage = new Image();
    this.hudImage.onload = function () {
      // hudBitmap.drawImage(hudImage, 69, 50);
    };

    // Create the camera and set the viewport to match the screen dimensions.
    this.hudCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 1000);
    this.hudCamera.position.z = 40;
    // Create also a custom scene for HUD.
    this.hudScene = new THREE.Scene();

    // Create texture from rendered graphics.
    this.hudTexture = new THREE.Texture(this.hudCanvas);
    this.hudTexture.needsUpdate = true;

    // Create HUD material.
    this.hudMaterial = new THREE.MeshBasicMaterial({
      map: this.hudTexture,
      //   alphaMap: hudImageAlphaMap,
      transparent: true
      // opacity: 1
    });

    // Create plane to render the HUD. This plane fill the whole screen.
    var planeGeometry = new THREE.PlaneGeometry(100, 100); //width, height);
    this.plane = new THREE.Mesh(planeGeometry, this.hudMaterial);
    this.plane.scale.set(width / 100, height / 100, 1);
    this.plane.position.z = -150; // Depth in the scene
    this.hudScene.add(this.plane);
    console.log("blaaaaah");

    // Create a compass
    const compassGeometry = new THREE.CylinderGeometry(30, 30, 10, 8, 2);
    const compassMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.compassMesh = new THREE.Mesh(compassGeometry, compassMaterial);
    this.compassMesh.position.add(new THREE.Vector3(30, 300, -160)); // Radius=30 -> definitely in range of camera
    this.hudScene.add(this.compassMesh);
  }

  setHudSize(width: number, height: number) {
    this.hudCanvas.width = width;
    this.hudCanvas.height = height;
    this.hudTexture = new THREE.Texture(this.hudCanvas);
    this.hudTexture.needsUpdate = true;
    this.hudMaterial.map = this.hudTexture;
    this.plane.scale.set(width / 100, height / 100, 1);
  }

  renderHud(renderer: THREE.WebGLRenderer, data: HUDData) {
    // Render the HUD scene
    var hudSize = { width: 240, height: 80 };

    // Update HUD graphics.
    // this.hudBitmap.globalAlpha = 0.5;
    this.hudBitmap.font = "Normal 16px Arial";
    this.hudBitmap.textAlign = "center";
    this.hudBitmap.fillStyle = "rgba(255,255,255,0.5)";

    // console.log("this.hudCanvas.width", this.hudCanvas.width);

    // Clear only the lower HUD rect?
    // this.hudBitmap.clearRect(
    //   this.hudCanvas.width - hudSize.width,
    //   this.hudCanvas.height - hudSize.height,
    //   hudSize.width,
    //   hudSize.height
    // );

    // Or clear the whole scene?
    this.hudBitmap.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);

    this.hudBitmap.fillStyle = "rgba(0,192,192,0.5)";
    this.hudBitmap.fillRect(
      this.hudCanvas.width - hudSize.width,
      this.hudCanvas.height - hudSize.height,
      hudSize.width,
      hudSize.height
    );
    // this.hudBitmap.drawImage(this.hudImage, 0, 0); // 69, 50);
    // Draw HUD in the lower right corner
    this.hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
    // var hudText =  "RAD [x:" +
    // (this.hudData.x % (2 * Math.PI)).toFixed(1) +
    // ", y:" +
    // (this.hudData.y % (2 * Math.PI)).toFixed(1) +
    // ", z:" +
    // (this.hudData.z % (2 * Math.PI)).toFixed(1) +
    // "]";
    var hudText = `Depth: ${data.depth.toFixed(1)}m`;
    this.hudBitmap.fillText(hudText, this.hudCanvas.width - hudSize.width / 2, this.hudCanvas.height - hudSize.height / 2);
    this.hudTexture.needsUpdate = true;

    // Update compass
    this.compassMesh.rotation.set(data.shipRotation.x, data.shipRotation.y, data.shipRotation.z);

    // Render HUD on top of the scene.
    renderer.render(this.hudScene, this.hudCamera);
    // END Try a HUD
  }
}
