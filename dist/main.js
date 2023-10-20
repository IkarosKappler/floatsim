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
var FrontendUI_1 = require("./dom/frontend/FrontendUI");
var KeyHandler_1 = require("./io/KeyHandler");
var gup_1 = require("./utils/gup");
var Params_1 = require("./utils/Params");
var TweakPane = __importStar(require("tweakpane"));
var MediaStorage_1 = require("./io/MediaStorage");
console.log("Main script starting ...");
globalThis.addEventListener("load", function () {
    console.log("[main] Initializing");
    var preactLib = globalThis["preact"];
    var axiosLib = globalThis["axios"];
    console.log("[main] preact", preactLib);
    var globalLibs = {
        preact: preactLib,
        axios: axiosLib
    };
    // The globalLibs will be used by the MediaStorage singleton
    MediaStorage_1.MediaStorage.globalLibs = globalLibs;
    console.log("[main] globalLibs", globalLibs);
    var GUP = (0, gup_1.gup)();
    var params = new Params_1.Params(GUP);
    console.log("SceneContainer", SceneContainer_1.SceneContainer);
    var sceneContainer = new SceneContainer_1.SceneContainer(params);
    var frontendUI = new FrontendUI_1.FrontendUI(sceneContainer, globalLibs, params);
    console.log("frontendUI", frontendUI);
    console.log(TweakPane);
    var pane = new window["Tweakpane"].Pane({ title: "Params" });
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
    pane.addInput(sceneContainer.tweakParams, "cutsceneShutterValue", {
        min: 0.0,
        max: 1.0
    });
    pane.addInput(sceneContainer.tweakParams, "fontSize", {
        min: 7.0,
        max: 22.0
    });
    pane.addInput(sceneContainer.tweakParams, "lineHeight", {
        min: 7.0,
        max: 22.0
    });
    pane
        .addInput(sceneContainer.tweakParams, "cameraFov", {
        min: 10.0,
        max: 90.0
    })
        .on("change", function (ev) {
        sceneContainer.camera.fov = ev.value;
        sceneContainer.camera.updateProjectionMatrix();
    });
    pane
        .addInput(sceneContainer.tweakParams, "fogDensity", {
        min: 0.0,
        max: 0.015
    })
        .on("change", function (ev) {
        sceneContainer.scene.fog.density = ev.value;
    });
    pane
        .addInput(sceneContainer.hudData, "batteryCharge", {
        min: 0.0,
        max: 1.0
    })
        .on("change", function (ev) {
        // console.log(" batteryCharge changed: " + JSON.stringify(ev.value));
    });
    pane.addInput(sceneContainer.hudData, "isBatteryDamaged");
    pane.addInput(sceneContainer.hudData, "isThermometerDamaged");
    pane.expanded = false;
    var keyHandler = new KeyHandler_1.KeyHandler({ element: document.body, trackAll: false });
    keyHandler
        .down("h", function (e) {
        var curNavPoint = sceneContainer.gameLogicManager.navpointRouter.getCurrentNavpoint();
        if (curNavPoint) {
            sceneContainer.messageBox.showMessage("Your next nav point is ".concat(curNavPoint.label, "."));
        }
        else {
            sceneContainer.messageBox.showMessage("There is no next nav point.");
        }
    })
        .down("p", function (e) {
        console.log("[main] Pausing/unpausing game");
        sceneContainer.togglePause();
    });
    sceneContainer.gameListeners.gameRunningListeners.add(function (isGameRunning, isGamePaused) {
        console.log("[main] Game paused?", isGamePaused);
    });
    sceneContainer.initializGame();
});
//# sourceMappingURL=main.js.map