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
/**
 * Fetch the SVG at the given path and convert it to a THREE.Texture.
 * @param {string} svgPath
 * @param {function} onTextureReady
 */
var svg2texture = function (svgPath, onTextureReady) {
    var svgImage = document.createElement("img");
    svgImage.style.position = "absolute";
    svgImage.style.top = "-9999px";
    // The image _needs_ to be attached to the DOM, otherwise its
    // attributes will not be availale.
    document.body.appendChild(svgImage);
    svgImage.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = svgImage.clientWidth;
        canvas.height = svgImage.clientHeight;
        var canvasCtx = canvas.getContext("2d");
        canvasCtx.drawImage(svgImage, 0, 0);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        svgImage.remove();
        onTextureReady(texture);
    };
    svgImage.src = svgPath;
};
exports.svg2texture = svg2texture;
//# sourceMappingURL=Helpers.js.map