"use strict";
/**
 * A simple test for loading immobile "concrete" assets.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2023-04-10 (Happy Easter)
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
exports.Concrete = void 0;
var THREE = __importStar(require("three"));
var OBJLoader_1 = require("three/examples/jsm/loaders/OBJLoader");
var MTLLoader_1 = require("three/examples/jsm/loaders/MTLLoader");
var Concrete = /** @class */ (function () {
    function Concrete(sceneContainer) {
        this.sceneContainer = sceneContainer;
    }
    Concrete.prototype.loadObjFile = function (basePath, objFileName, options) {
        var _this = this;
        this.loadObj(basePath, objFileName).then(function (object) {
            console.log("object", object);
            // (object.children[0] as THREE.Mesh).material = material
            var materialFileNames = object.materialLibraries;
            _this.loadMaterials(basePath, materialFileNames).then(function (materials) {
                console.log("Materials", materials);
                object.traverse(function (child) {
                    if (child.isMesh) {
                        var childMesh = child;
                        // TODO: check type
                        //   this.loadMaterials((childMesh as any).materialLibraries).then(materials => {
                        //
                        childMesh.geometry.computeVertexNormals();
                        _this.locateMaterial(childMesh, materials);
                        if (options && options.targetBounds) {
                            _this.applyScale(object, options.targetBounds);
                        }
                        if (options && options.targetPosition) {
                            object.position.set(options.targetPosition.x, options.targetPosition.y, options.targetPosition.z);
                        }
                        _this.sceneContainer.scene.add(object);
                        //   });
                        //   (child as THREE.Mesh).material = material;
                    }
                });
            });
        });
    };
    Concrete.prototype.loadObj = function (basePath, objFileName) {
        var objLoader = new OBJLoader_1.OBJLoader();
        return new Promise(function (accept, reject) {
            objLoader.load(
            // "resources/meshes/wavefront/concrete-ring/newscene.obj",
            basePath + objFileName, function (object) {
                // (object.children[0] as THREE.Mesh).material = material
                // object.traverse(function (child) {
                //     if ((child as THREE.Mesh).isMesh) {
                //         (child as THREE.Mesh).material = material
                //     }
                // })
                // sceneHandler.scene.add(object);
                accept(object);
            }, function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            }, function (error) {
                console.log(error);
                reject();
            });
        });
    };
    Concrete.prototype.loadMaterials = function (basePath, materialLibraries) {
        var promises = [];
        for (var i = 0; i < materialLibraries.length; i++) {
            promises.push(this.loadMaterial(basePath, materialLibraries[i]));
        }
        return Promise.all(promises);
    };
    Concrete.prototype.loadMaterial = function (basePath, materialFileName) {
        var mtlLoader = new MTLLoader_1.MTLLoader();
        return new Promise(function (accept, reject) {
            mtlLoader.load(basePath + materialFileName, // "models/monkey.mtl",
            function (materials) {
                materials.preload();
                console.log("Materials loaded", materialFileName, materials);
                accept(materials.materials);
            }, function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            }, function (error) {
                console.log("An error happened", error);
                reject();
            });
        });
    };
    Concrete.prototype.applyScale = function (object, targetSize) {
        var objectBounds = new THREE.Box3().setFromObject(object);
        var objectSize = new THREE.Vector3();
        objectBounds.getSize(objectSize);
        object.scale.set(targetSize.width / objectSize.x, targetSize.height / objectSize.y, targetSize.depth / objectSize.x);
        console.log("New scale", object.scale);
    };
    Concrete.prototype.locateMaterial = function (object, materials) {
        var materialName = object.material.name;
        console.log("Looking for material named ".concat(materialName));
        if (materialName) {
            var keys = Object.keys(materials);
            console.log("keys", keys);
            for (var i = 0; i < materials.length; i++) {
                var materialSet = materials[i];
                var material = materialSet[materialName];
                //   console.log("key", key);
                if (material) {
                    console.log("Material found", material);
                    object.material = material;
                    return;
                }
            }
        }
    };
    return Concrete;
}());
exports.Concrete = Concrete;
//# sourceMappingURL=Concrete.js.map