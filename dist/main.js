"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
var SceneContainer_1 = require("./components/SceneContainer");
var gup_1 = require("./utils/gup");
var Params_1 = require("./utils/Params");
console.log("Main script starting ...");
globalThis.addEventListener("load", function () {
    console.log("Initializing");
    var GUP = (0, gup_1.gup)();
    var params = new Params_1.Params(GUP);
    console.log("SceneContainer", SceneContainer_1.SceneContainer);
    new SceneContainer_1.SceneContainer(params);
});
//# sourceMappingURL=main.js.map