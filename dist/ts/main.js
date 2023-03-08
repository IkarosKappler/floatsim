"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
var SceneContainer_1 = require("./components/SceneContainer");
console.log("Main script starting ...");
globalThis.addEventListener("load", function () {
    console.log("Initializing");
    new SceneContainer_1.SceneContainer();
});
//# sourceMappingURL=main.js.map