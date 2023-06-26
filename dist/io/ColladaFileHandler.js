"use strict";
/**
 * A simple class to properly load Collada models.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-06-23 (Two days after midsommer)
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
exports.ColladaFileHandler = void 0;
var THREE = __importStar(require("three"));
var ColladaLoader_js_1 = require("three/examples/jsm/loaders/ColladaLoader.js");
var Helpers_1 = require("../utils/Helpers");
var ColladaFileHandler = /** @class */ (function () {
    function ColladaFileHandler(sceneContainer) {
        this.sceneContainer = sceneContainer;
    }
    /**
     * Try to load a Wavefront object file from the specific path. The function
     * will also try to load the MTL materials (if defined in the file).
     *
     * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
     * @param {string} colladaFileName
     * @param {Size3Immutable} options.targetBounds
     * @param {TripleImmutable<number>} options.targetPosition
     */
    ColladaFileHandler.prototype.loadColladaFile = function (basePath, colladaFileName, options, onObjectLoaded) {
        // Try loading the object
        console.log("Load collada file ", colladaFileName);
        var model = null;
        var _self = this;
        var loadingManager = new THREE.LoadingManager(function () {
            if (options && options.targetBounds) {
                // this.applyScale(loadedObject, options.targetBounds);
                (0, Helpers_1.applyObjectScale)(model, options.targetBounds);
            }
            if (options && options.targetPosition) {
                model.position.set(options.targetPosition.x, options.targetPosition.y, options.targetPosition.z);
            }
            _self.sceneContainer.scene.add(model);
            onObjectLoaded(model);
        });
        var loader = new ColladaLoader_js_1.ColladaLoader(loadingManager);
        // loader.load("./models/collada/elf/elf.dae", function (collada) {
        loader.load(basePath + colladaFileName, function (collada) {
            console.log("Collada model loaded", collada);
            model = collada.scene;
        });
    };
    return ColladaFileHandler;
}());
exports.ColladaFileHandler = ColladaFileHandler;
//# sourceMappingURL=ColladaFileHandler.js.map