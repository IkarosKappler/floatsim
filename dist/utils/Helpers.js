"use strict";
/**
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-03-26
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
exports.svg2texture = exports.getColorStyle = void 0;
var THREE = __importStar(require("three"));
// import { SVGLoader, SVGResult } from "three/examples/jsm/loaders/SVGLoader.js";
/**
 * Get the CSS colors string with adjustable alpha value.
 * @param {THREE.Color} color
 * @param {number} alpha
 * @returns
 */
var getColorStyle = function (color, alpha) {
    return "rgba(".concat(Math.floor(color.r * 255), ", ").concat(Math.floor(color.g * 255), ", ").concat(Math.floor(color.b * 255), ", ").concat(alpha, ")");
};
exports.getColorStyle = getColorStyle;
var svg2texture = function (svgPath, onTextureReady) {
    //   const svgPath = "img/compass-texture-d.svg";
    //   const onSvgLoaded = (data: SVGResult) => {
    //     console.log("SVG data", data);
    //   };
    //   const compassTextureSvg = new SVGLoader().load(svgPath, onSvgLoaded);
    //   var svg = document.getElementById("svgContainer").querySelector("svg");
    //   var svgData = new XMLSerializer().serializeToString(svg);
    //   var canvas = document.createElement("canvas");
    //   var svgSize = svg.getBoundingClientRect();
    //   canvas.width = svgSize.width;
    //   canvas.height = svgSize.height;
    //   var ctx = canvas.getContext("2d");
    //   var img = document.createElement("img");
    //   //   img.setAttribute("src", "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(svgData))));
    //   img.setAttribute("src", svgPath);
    //   img.onload = function () {
    //     ctx.drawImage(img, 0, 0);
    //     var texture = new THREE.Texture(canvas);
    //     texture.needsUpdate = true;
    //   };
    //   var canvas = document.createElement("canvas");
    //   var texture = new THREE.Texture(canvas);
    //   texture.needsUpdate = true;
    //   var geometry = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
    //   var material = new THREE.MeshBasicMaterial({ map: texture });
    //   material.map.minFilter = THREE.LinearFilter;
    //   const mesh = new THREE.Mesh(geometry, material);
    var svgImage = document.createElement("img");
    // imgPreview.style.position = 'absolute';
    // imgPreview.style.top = '-9999px';
    document.body.appendChild(svgImage);
    svgImage.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = svgImage.clientWidth;
        canvas.height = svgImage.clientHeight;
        var canvasCtx = canvas.getContext("2d");
        canvasCtx.drawImage(svgImage, 0, 0);
        // const imgData = canvas.toDataURL("image/png");
        // callback(canvas); //imgData);
        // document.body.removeChild(imgPreview);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        svgImage.remove();
        onTextureReady(texture);
    };
    svgImage.src = svgPath;
};
exports.svg2texture = svg2texture;
//# sourceMappingURL=Helpers.js.map