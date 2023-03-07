/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./components/SceneContainer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const SceneContainer_1 = require("./components/SceneContainer");
    console.log("Main script starting ...");
    globalThis.addEventListener("load", () => {
        console.log("Initializing");
        new SceneContainer_1.SceneContainer();
    });
});
//# sourceMappingURL=main.js.map