"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
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
var SceneContainer_1 = require("./components/SceneContainer");
var gup_1 = require("./utils/gup");
var Params_1 = require("./utils/Params");
var TweakPane = __importStar(require("tweakpane"));
console.log("Main script starting ...");
globalThis.addEventListener("load", function () {
    console.log("Initializing");
    var GUP = (0, gup_1.gup)();
    var params = new Params_1.Params(GUP);
    console.log("SceneContainer", SceneContainer_1.SceneContainer);
    var sceneContainer = new SceneContainer_1.SceneContainer(params);
    console.log(TweakPane);
    var pane = new window["Tweakpane"].Pane();
    pane.addInput(sceneContainer.tweakParams, "compassZ", {
        min: -150,
        max: 150
    });
    var sonar = pane.addFolder({ title: "Sonar" });
    sonar.addInput(sceneContainer.tweakParams, "sonarX", {
        min: -350,
        max: 350
    });
    sonar.addInput(sceneContainer.tweakParams, "sonarY", {
        min: -350,
        max: 350
    });
    sonar.addInput(sceneContainer.tweakParams, "sonarZ", {
        min: -150,
        max: 150
    });
    pane.addInput(sceneContainer.tweakParams, "isRendering");
    pane.addInput(sceneContainer.tweakParams, "highlightHudFragments");
    // pane.on("change", (ev: TweakPane.TpChangeEvent<number>) => {
    //   console.log("changed: " + JSON.stringify(ev.value));
    // });
    pane.addInput(sceneContainer.tweakParams, "cutsceneShutterValue", {
        min: 0.0,
        max: 1.0
    });
});
//# sourceMappingURL=main.js.map