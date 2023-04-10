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
exports.Bounds2Immutable = exports.svg2texture = exports.bounds2size = exports.getColorStyle = void 0;
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
 * Convert bounds of form THREE.Box3 to a Vector3 containing the size.
 * @param bounds
 * @returns
 */
var bounds2size = function (bounds) {
    // THREE.Vector3 => {
    var size = new THREE.Vector3();
    bounds.getSize(size);
    // return size;
    return { width: size.x, height: size.y, depth: size.z };
};
exports.bounds2size = bounds2size;
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
/**
 * A simple immutable bounds class with helper functions for relative positioning.
 */
var Bounds2Immutable = /** @class */ (function () {
    // TODO: try function overloading with the new Typescript here
    function Bounds2Immutable(x, y, width, height) {
        var _a, _b;
        if (typeof x === "number") {
            this.width = width !== null && width !== void 0 ? width : 0;
            this.height = height !== null && height !== void 0 ? height : 0;
            this.min = { x: x, y: y !== null && y !== void 0 ? y : 0 };
            this.max = { x: this.min.x + this.width, y: this.min.y + this.height };
        }
        else {
            this.width = (_a = x.width) !== null && _a !== void 0 ? _a : 0;
            this.height = (_b = x.height) !== null && _b !== void 0 ? _b : 0;
            this.min = { x: x.x, y: x.y };
            this.max = { x: x.x + this.width, y: x.y + this.height };
        }
    }
    Bounds2Immutable.prototype.getRelativeX = function (xFract) {
        return this.min.x + this.width * xFract;
    };
    Bounds2Immutable.prototype.getRelativeY = function (yFract) {
        return this.min.y + this.height * yFract;
    };
    Bounds2Immutable.prototype.getRelativePos = function (xFract, yFract) {
        return { x: this.getRelativeX(xFract), y: this.getRelativeY(yFract) };
    };
    Bounds2Immutable.prototype.getRelativeBounds = function (minFracts, maxFracts) {
        var minAbs = this.getRelativePos(minFracts.x, minFracts.y);
        var maxAbs = this.getRelativePos(maxFracts.x, maxFracts.y);
        return new Bounds2Immutable(Math.min(minAbs.x, maxAbs.x), Math.min(minAbs.y, maxAbs.y), Math.abs(maxAbs.x - minAbs.x), Math.abs(maxAbs.y - minAbs.y));
    };
    Bounds2Immutable.prototype.scale = function (factor) {
        return new Bounds2Immutable(this.min.x * factor, this.min.y * factor, this.width * factor, this.height * factor);
    };
    Bounds2Immutable.prototype.move = function (amount) {
        return new Bounds2Immutable(this.min.x + amount.x, this.min.y + amount.y, this.width, this.height);
    };
    Bounds2Immutable.fromMinMax = function (min, max) {
        return new Bounds2Immutable(min.x, min.y, max.x - min.x, max.y - min.y);
    };
    return Bounds2Immutable;
}());
exports.Bounds2Immutable = Bounds2Immutable;
//# sourceMappingURL=Helpers.js.map