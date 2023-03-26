"use strict";
/**
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-03-26
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorStyle = void 0;
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
//# sourceMappingURL=Helpers.js.map