"use strict";
/**
 * Generate the sine/cosine terrain data for the demo terrain.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDemoHeight = void 0;
var generateDemoHeight = function (width, depth, minHeight, maxHeight) {
    // Generates the height data (a sinus wave)
    var size = width * depth;
    var data = new Float32Array(size);
    var hRange = maxHeight - minHeight;
    var w2 = width / 2;
    var d2 = depth / 2;
    var phaseMult = 12;
    var p = 0;
    for (var j = 0; j < depth; j++) {
        for (var i = 0; i < width; i++) {
            var radius = Math.sqrt(Math.pow((i - w2) / w2, 2.0) + Math.pow((j - d2) / d2, 2.0));
            var height = (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange + minHeight;
            data[p] = height;
            p++;
        }
    }
    return data;
};
exports.generateDemoHeight = generateDemoHeight;
//# sourceMappingURL=generateDemoHeight.js.map