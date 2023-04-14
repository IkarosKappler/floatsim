"use strict";
/**
 * A simple cockpit: a texture plus alpha channel on a plane placed in
 * front of the camera.
 *
 * @author  Ikaros Kappler
 * @date    2023-03-08
 * @version 1.0.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CockpitPlane = void 0;
var THREE = __importStar(require("three"));
var CockpitPlane = /** @class */ (function () {
    function CockpitPlane() {
        var _this = this;
        this.textureSize = { width: 100, height: 100 };
        var cockpitTexture = new THREE.TextureLoader().load("resources/img/cockpit-nasa.png");
        cockpitTexture.addEventListener("load", function () {
            _this.textureSize.width = cockpitTexture.image.width;
            _this.textureSize.height = cockpitTexture.image.height;
        });
        var cockpitAlpahMap = new THREE.TextureLoader().load("resources/img/cockpit-nasa-alphamap.png");
        var material = new THREE.MeshBasicMaterial({
            color: 0x888888,
            map: cockpitTexture,
            alphaMap: cockpitAlpahMap,
            transparent: true,
            side: THREE.DoubleSide
        });
        cockpitTexture.wrapS = THREE.ClampToEdgeWrapping;
        cockpitTexture.wrapT = THREE.ClampToEdgeWrapping;
        cockpitAlpahMap.wrapS = THREE.ClampToEdgeWrapping;
        cockpitAlpahMap.wrapT = THREE.ClampToEdgeWrapping;
        var geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
        geometry.rotateX(-Math.PI / 4);
        geometry.translate(0, 0, -250); //-12);
        this.mesh = new THREE.Mesh(geometry, material);
    }
    CockpitPlane.prototype.setCockpitSize = function (width, height) {
        // this.mesh.scale.set(width / 40, height / 40, 1);
        // this.mesh.scale.set(width, height, 1);
        // Find best fit
        var ratio = 1.5; //height / width;
        this.mesh.scale.set(width * ratio, height * ratio, 1);
    };
    return CockpitPlane;
}());
exports.CockpitPlane = CockpitPlane;
//# sourceMappingURL=CockpitPlane.js.map