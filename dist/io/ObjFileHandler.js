"use strict";
/**
 * A simple test for loading wavefront OBJ and MTL assets.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-04-10 (Happy Easter)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjFileHandler = void 0;
var OBJLoader_1 = require("three/examples/jsm/loaders/OBJLoader");
var MTLLoader_1 = require("three/examples/jsm/loaders/MTLLoader");
var Helpers_1 = require("../utils/Helpers");
var ObjFileHandler = /** @class */ (function () {
    // private readonly sceneContainer: SceneContainer;
    function ObjFileHandler() {
        // sceneContainer: SceneContainer) {
        // this.sceneContainer = sceneContainer;
    }
    /**
     * Try to load a Wavefront object file from the specific path. The function
     * will also try to load the MTL materials (if defined in the file).
     *
     * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
     * @param {string} objFileName
     * @param {Size3Immutable} options.targetBounds
     * @param {TripleImmutable<number>} options.targetPosition
     */
    ObjFileHandler.prototype.loadObjFile = function (basePath, objFileName, options, onObjectLoaded, onMaterialsLoaded, onError) {
        var _this = this;
        // Try loading the object
        this.loadObj(basePath, objFileName).then(function (loadedObject) {
            // console.log("object", loadedObject);
            if (options && options.targetBounds) {
                // this.applyScale(loadedObject, options.targetBounds);
                (0, Helpers_1.applyObjectScale)(loadedObject, options.targetBounds);
            }
            if (options && options.targetPosition) {
                loadedObject.position.set(options.targetPosition.x, options.targetPosition.y, options.targetPosition.z);
            }
            console.log("Loaded OBJ file ", objFileName);
            // this.sceneContainer.scene.add(loadedObject); // !!! REMOVED
            if (onObjectLoaded) {
                onObjectLoaded(loadedObject);
            }
            var materialFileNames = loadedObject.materialLibraries;
            if (materialFileNames) {
                _this.loadMaterials(basePath, materialFileNames)
                    .then(function (materials) {
                    // console.log("Materials", materials);
                    loadedObject.traverse(function (child) {
                        if (child.isMesh) {
                            // TODO: check type
                            var childMesh = child;
                            _this.locateMaterial(childMesh, materials);
                            if (Array.isArray(childMesh.material)) {
                                childMesh.material.forEach(function (mat) {
                                    mat.needsUpdate = true;
                                });
                            }
                            else {
                                childMesh.material.needsUpdate = true;
                            }
                        }
                    });
                    if (onMaterialsLoaded) {
                        onMaterialsLoaded(loadedObject);
                    }
                })
                    .catch(function (error) {
                    onError && onError(error);
                });
            } // END if
            else {
                onMaterialsLoaded && onMaterialsLoaded(loadedObject);
            }
        });
    };
    /**
     * This private helper function loads the OBJ file using THREE's OBJLoader.
     *
     * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
     * @param {string} objFileName - Usually an *.obj file name.
     * @returns {Promise<THREE.Group>} The object group from the file.
     */
    ObjFileHandler.prototype.loadObj = function (basePath, objFileName) {
        var objLoader = new OBJLoader_1.OBJLoader();
        return new Promise(function (accept, reject) {
            objLoader.load(basePath + objFileName, // An *.obj file
            function (object) {
                accept(object);
            }, function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            }, function (error) {
                console.log(error);
                reject(error);
            });
        });
    };
    /**
     * Try to load the MTL material files from the given path.
     *
     * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
     * @param {string[]} materialLibraries - Usually an array of *.mtl file names that are located in the given base path.
     * @returns
     */
    ObjFileHandler.prototype.loadMaterials = function (basePath, materialLibraries) {
        var promises = [];
        for (var i = 0; i < materialLibraries.length; i++) {
            promises.push(this.loadMaterial(basePath, materialLibraries[i]));
        }
        return Promise.all(promises);
    };
    /**
     * Load a single material from the specific MTL file.
     *
     * @param {string} basePath - The path muse end with the file system delimiter (usually '/' or '\').
     * @param {string} materialFileName - This should be an *.mtl file.
     * @returns
     */
    ObjFileHandler.prototype.loadMaterial = function (basePath, materialFileName) {
        var mtlLoader = new MTLLoader_1.MTLLoader();
        return new Promise(function (accept, reject) {
            mtlLoader.load(basePath + materialFileName, // "models/monkey.mtl",
            function (materials) {
                materials.preload();
                // console.log("Materials loaded", materialFileName, materials);
                accept(materials.materials);
            }, function (xhr) {
                // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            }, function (error) {
                console.log("An error happened", error);
                reject(error);
            });
        });
    };
    // private applyScale(object: THREE.Group, targetSize: Size3Immutable) {
    //   const objectBounds = new THREE.Box3().setFromObject(object);
    //   const objectSize = new THREE.Vector3();
    //   objectBounds.getSize(objectSize);
    //   object.scale.set(targetSize.width / objectSize.x, targetSize.height / objectSize.y, targetSize.depth / objectSize.x);
    //   // console.log("New scale", object.scale);
    // }
    ObjFileHandler.prototype.locateMaterial = function (object, materials) {
        var materialName = object.material.name;
        // console.log(`Looking for material named ${materialName}`);
        if (materialName) {
            var keys = Object.keys(materials);
            // console.log("keys", keys);
            for (var i = 0; i < materials.length; i++) {
                var materialSet = materials[i];
                var material = materialSet[materialName];
                //   console.log("key", key);
                if (material) {
                    // console.log("Material found", material);
                    //   material.receiveShadows
                    object.material = material;
                    return;
                }
            }
        }
    };
    return ObjFileHandler;
}());
exports.ObjFileHandler = ObjFileHandler;
//# sourceMappingURL=ObjFileHandler.js.map