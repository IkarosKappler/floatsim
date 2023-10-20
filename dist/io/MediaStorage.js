"use strict";
/**
 * A global class for storing media.
 * Try to avoid loading the same resource multiple times, use this storage.
 *
 * @author Ikaros Kappler
 * @date    2023-09-24
 * @version 1.0.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaStorage = void 0;
var three_1 = __importDefault(require("three"));
var ObjFileHandler_1 = require("./ObjFileHandler");
// This is intended to be used as a singleton.
var MediaStorageImpl = /** @class */ (function () {
    function MediaStorageImpl() {
        this.audioResources = {};
        this.objResources = {};
    }
    MediaStorageImpl.prototype.getText = function (path) {
        var _this = this;
        return new Promise(function (accept, reject) {
            _this.globalLibs.axios
                .get(path)
                .then(function (response) {
                // console.log(response);
                accept(response.data);
            })
                .catch(function (error) {
                // console.log(error);
                reject(error);
            })
                .finally(function () {
                // always executed
                // NOOP
            });
        });
    };
    MediaStorageImpl.prototype.getAudio = function (path) {
        var _this = this;
        return new Promise(function (accept, reject) {
            var audio = _this.audioResources[path];
            if (!audio) {
                audio = new Audio("resources/audio/custom-sounds/typewriter-01.wav");
                audio.addEventListener("canplay", function () {
                    accept(audio);
                });
                _this.audioResources[path] = audio;
            }
            else {
                accept(audio);
            }
        });
    };
    MediaStorageImpl.prototype.getObjMesh = function (basePath, objFileName, targetBounds) {
        var _this = this;
        var buoyObjectLoaded = function (_loadedObject) {
            console.log("Buoy mesh loaded");
            // NOOP
            // Wait until the 'materialsLoaded' callback is triggered; then the
            // object is fully loaded.
        };
        var _self = this;
        var objectKey = basePath + objFileName;
        return new Promise(function (accept, reject) {
            // Try to catch loaded object
            console.log("[MediaStorage] Try to load OBJ mesh", basePath, objFileName);
            var obj = _this.objResources[objectKey];
            if (obj) {
                accept(obj);
                return;
            }
            // Was not loaded befor -> load from web
            var buoyMaterialsLoaded = function (loadedObject) {
                console.log("Buoy material loaded");
                // loadedObject.rotateX(-Math.PI / 2.0);
                console.log("[Buoy material loaded] ", loadedObject);
                loadedObject.traverse(function (child) {
                    if (child.isMesh) {
                        // TODO: check type
                        var childMesh = child;
                        console.log("addBuoyAt", child);
                        if (Array.isArray(childMesh.material)) {
                            childMesh.material.forEach(function (mat) {
                                mat.side = three_1.default.BackSide;
                                mat.needsUpdate = true;
                            });
                        }
                        else {
                            childMesh.material.side = three_1.default.BackSide;
                            childMesh.material.needsUpdate = true;
                        }
                    }
                    // Clone.
                });
                // console.log("Creating buoy clones ...", targetPositions.length);
                // const buoys: Array<THREE.Object3D> = [];
                // for (var i = 0; i < targetPositions.length; i++) {
                //   const buoyCopy = loadedObject.clone();
                //   buoyCopy.position.set(targetPositions[i].x, targetPositions[i].y, targetPositions[i].z);
                //   this.scene.add(buoyCopy);
                //   buoys.push(buoyCopy);
                // }
                // accept(buoys);
                _self.objResources[objectKey] = loadedObject;
                accept(loadedObject);
            };
            new ObjFileHandler_1.ObjFileHandler().loadObjFile(basePath, objFileName, { targetBounds: targetBounds }, // , targetPosition: targetPositions[0] },
            buoyObjectLoaded, buoyMaterialsLoaded, reject);
        });
    };
    return MediaStorageImpl;
}());
// CURRENTLY NOT IN USE
exports.MediaStorage = new MediaStorageImpl();
//# sourceMappingURL=MediaStorage.js.map