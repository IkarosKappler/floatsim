"use strict";
/**
 * A simple class to properly load FBX models.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-06-26
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FbxFileHandler = void 0;
var FBXLoader_js_1 = require("three/examples/jsm/loaders/FBXLoader.js");
var Helpers_1 = require("../utils/Helpers");
var FbxFileHandler = /** @class */ (function () {
    function FbxFileHandler(sceneContainer) {
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
    FbxFileHandler.prototype.loadFbxFile = function (basePath, fbxFileName, options, onObjectLoaded) {
        // Try loading the object
        var _this = this;
        var fbxLoader = new FBXLoader_js_1.FBXLoader();
        fbxLoader.load(
        //   "models/Kachujin G Rosales.fbx",
        basePath + fbxFileName, function (loadedObject) {
            if (options && options.targetBounds) {
                // this.applyScale(loadedObject, options.targetBounds);
                (0, Helpers_1.applyObjectScale)(loadedObject, options.targetBounds);
            }
            if (options && options.targetPosition) {
                loadedObject.position.set(options.targetPosition.x, options.targetPosition.y, options.targetPosition.z);
            }
            // object.traverse(function (child) {
            //     if ((child as THREE.Mesh).isMesh) {
            //         // (child as THREE.Mesh).material = material
            //         if ((child as THREE.Mesh).material) {
            //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
            //         }
            //     }
            // })
            // object.scale.set(.01, .01, .01)
            _this.sceneContainer.scene.add(loadedObject);
            onObjectLoaded(loadedObject);
        }, function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        }, function (error) {
            console.log(error);
        });
        // console.log("Load collada file ", colladaFileName);
        // let model = null;
        // const _self = this;
        // const loadingManager = new THREE.LoadingManager(function () {
        //   if (options && options.targetBounds) {
        //     // this.applyScale(loadedObject, options.targetBounds);
        //     applyObjectScale(model, options.targetBounds);
        //   }
        //   if (options && options.targetPosition) {
        //     model.position.set(options.targetPosition.x, options.targetPosition.y, options.targetPosition.z);
        //   }
        //   _self.sceneContainer.scene.add(model);
        //   onObjectLoaded(model);
        // });
        // const loader = new ColladaLoader(loadingManager);
        // // loader.load("./models/collada/elf/elf.dae", function (collada) {
        // loader.load(basePath + colladaFileName, function (collada) {
        //   console.log("Collada model loaded", collada);
        //   model = collada.scene;
        // });
    };
    return FbxFileHandler;
}());
exports.FbxFileHandler = FbxFileHandler;
//# sourceMappingURL=FbxFileHandler.js.map