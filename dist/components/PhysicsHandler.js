"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-03-11
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
exports.PhysicsHandler = void 0;
var THREE = __importStar(require("three"));
var Ammo_1 = require("../Ammo");
// Heightfield parameters
var terrainWidthExtents = 100;
var terrainDepthExtents = 100;
var terrainWidthSegmentCount = 128;
var terrainDepthSegmentCount = 128;
var terrainHalfWidth = terrainWidthSegmentCount / 2;
var terrainHalfDepth = terrainDepthSegmentCount / 2;
var terrainMaxHeight = 8;
var terrainMinHeight = -2;
var time = 0;
var objectTimePeriod = 3;
var timeNextSpawn = time + objectTimePeriod;
var maxNumObjects = 30;
// interns
var heightData = null;
var ammoHeightData = null;
var physicsWorld = null;
var dynamicObjects = [];
var worldTransform;
var collisionConfiguration = null; // new Ammo.btDefaultCollisionConfiguration();
var dispatcher = null; // new Ammo.btCollisionDispatcher( collisionConfiguration );
var broadphase = null; // new Ammo.btDbvtBroadphase();
var solver = null; // new Ammo.btSequentialImpulseConstraintSolver();
var PhysicsHandler = /** @class */ (function () {
    function PhysicsHandler(sceneContainer, terrain) {
        this.ammoIsReady = false;
        this.sceneContainer = sceneContainer;
        this.terrain = terrain;
        heightData = generateHeight(terrainWidthSegmentCount, terrainDepthSegmentCount, terrainMinHeight, terrainMaxHeight);
        this.initTestGraphics();
    }
    PhysicsHandler.prototype.start = function () {
        // Variable declaration
        var _this = this;
        var _self = this;
        // Ammojs Initialization
        // Ammo().then(start);
        // const ammo = Ammo();
        // console.log("tmp", ammo, typeof ammo.then);
        // (ammo as any).then(start);
        // Take a look at lib/jsm/phyrics/AmmoPhysics.js
        console.log("AmmoImport", Ammo_1.Ammo);
        var AmmoLib = new Ammo_1.Ammo(); // eslint-disable-line no-undef
        console.log("AmmoLib", AmmoLib);
        AmmoLib.then(function (ammo) {
            console.log("THEN", ammo);
            _this.ammo = ammo;
            _this.ammoIsReady = true;
            // if (true) {
            //   return;
            // }
            // BEGIN ADD TEST MESHES
            // Boxes
            // END ADD TEST MESHES
            // heightData = generateHeight(terrainWidthSegmentCount, terrainDepthSegmentCount, terrainMinHeight, terrainMaxHeight);
            var frameRate = 60;
            ammo.btDefaultCollisionConfiguration();
            collisionConfiguration = new ammo.btDefaultCollisionConfiguration();
            dispatcher = new ammo.btCollisionDispatcher(collisionConfiguration);
            broadphase = new ammo.btDbvtBroadphase();
            solver = new ammo.btSequentialImpulseConstraintSolver();
            physicsWorld = new ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
            physicsWorld.setGravity(new ammo.btVector3(0, -9.8, 0));
            worldTransform = new ammo.btTransform();
            initPhysics(ammo);
            if (true) {
                return;
            }
            // Create the terrain body
            var groundShape = createTerrainShape();
            var groundTransform = new ammo.btTransform();
            groundTransform.setIdentity();
            // Shifts the terrain, since bullet re-centers it on its bounding box.
            groundTransform.setOrigin(new ammo.btVector3(0, (terrainMaxHeight + terrainMinHeight) / 2, 0));
            var groundMass = 0;
            var groundLocalInertia = new ammo.btVector3(0, 0, 0);
            var groundMotionState = new ammo.btDefaultMotionState(groundTransform);
            var groundBody = new ammo.btRigidBody(new ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, groundShape, groundLocalInertia));
            physicsWorld.addRigidBody(groundBody);
            var transformAux1 = new ammo.btTransform();
            // ... START ANIM?
            var meshes = [];
            var meshMap = new WeakMap();
            function addMesh(mesh, mass) {
                if (mass === void 0) { mass = 0; }
                var shape = getShape(mesh.geometry);
                if (shape !== null) {
                    if (mesh instanceof THREE.InstancedMesh && mesh.isInstancedMesh) {
                        handleInstancedMesh(mesh, mass, shape);
                    }
                    else if (mesh.isMesh) {
                        handleMesh(ammo, mesh, mass, shape);
                    }
                }
            }
            function handleInstancedMesh(mesh, mass, shape) {
                // const array = mesh.instanceMatrix.array;
                var array = mesh.instanceMatrix.array; // TODO: check
                var bodies = [];
                for (var i = 0; i < mesh.count; i++) {
                    var index = i * 16;
                    var transform = new AmmoLib.btTransform();
                    transform.setFromOpenGLMatrix(array.slice(index, index + 16));
                    var motionState = new AmmoLib.btDefaultMotionState(transform);
                    var localInertia = new AmmoLib.btVector3(0, 0, 0);
                    shape.calculateLocalInertia(mass, localInertia);
                    var rbInfo = new AmmoLib.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
                    var body = new AmmoLib.btRigidBody(rbInfo);
                    physicsWorld.addRigidBody(body);
                    bodies.push(body);
                }
                if (mass > 0) {
                    meshes.push(mesh);
                    meshMap.set(mesh, bodies);
                }
            }
            function getShape(geometry) {
                var parameters = geometry.parameters;
                // TODO change type to is*
                if (geometry.type === "BoxGeometry") {
                    var sx = parameters.width !== undefined ? parameters.width / 2 : 0.5;
                    var sy = parameters.height !== undefined ? parameters.height / 2 : 0.5;
                    var sz = parameters.depth !== undefined ? parameters.depth / 2 : 0.5;
                    var shape = new AmmoLib.btBoxShape(new AmmoLib.btVector3(sx, sy, sz));
                    shape.setMargin(0.05);
                    return shape;
                }
                else if (geometry.type === "SphereGeometry" || geometry.type === "IcosahedronGeometry") {
                    var radius = parameters.radius !== undefined ? parameters.radius : 1;
                    var shape = new AmmoLib.btSphereShape(radius);
                    shape.setMargin(0.05);
                    return shape;
                }
                return null;
            }
            function handleMesh(ammo, mesh, mass, shape) {
                var position = mesh.position;
                var quaternion = mesh.quaternion;
                var transform = new ammo.btTransform();
                transform.setIdentity();
                transform.setOrigin(new ammo.btVector3(position.x, position.y, position.z));
                transform.setRotation(new ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
                var motionState = new ammo.btDefaultMotionState(transform);
                var localInertia = new ammo.btVector3(0, 0, 0);
                shape.calculateLocalInertia(mass, localInertia);
                var rbInfo = new ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
                var body = new ammo.btRigidBody(rbInfo);
                // body.setFriction( 4 );
                physicsWorld.addRigidBody(body);
                if (mass > 0) {
                    meshes.push(mesh);
                    meshMap.set(mesh, body);
                }
            }
            //
            var lastTime = 0;
            function step() {
                var time = performance.now();
                if (lastTime > 0) {
                    var delta = (time - lastTime) / 1000;
                    // console.time( 'world.step' );
                    physicsWorld.stepSimulation(delta, 10);
                    // console.timeEnd( 'world.step' );
                }
                lastTime = time;
                //
                for (var i = 0, l = meshes.length; i < l; i++) {
                    var mesh = meshes[i];
                    if (mesh.isInstancedMesh) {
                        var array = mesh.instanceMatrix.array;
                        var bodies = meshMap.get(mesh);
                        for (var j = 0; j < bodies.length; j++) {
                            var body = bodies[j];
                            var motionState = body.getMotionState();
                            motionState.getWorldTransform(worldTransform);
                            var position = worldTransform.getOrigin();
                            var quaternion = worldTransform.getRotation();
                            compose(position, quaternion, array, j * 16);
                        }
                        mesh.instanceMatrix.needsUpdate = true;
                    }
                    else if (mesh.isMesh) {
                        var body = meshMap.get(mesh);
                        var motionState = body.getMotionState();
                        motionState.getWorldTransform(worldTransform);
                        var position = worldTransform.getOrigin();
                        var quaternion = worldTransform.getRotation();
                        mesh.position.set(position.x(), position.y(), position.z());
                        mesh.quaternion.set(quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w());
                    }
                }
            }
            function compose(position, quaternion, array, index) {
                var x = quaternion.x(), y = quaternion.y(), z = quaternion.z(), w = quaternion.w();
                var x2 = x + x, y2 = y + y, z2 = z + z;
                var xx = x * x2, xy = x * y2, xz = x * z2;
                var yy = y * y2, yz = y * z2, zz = z * z2;
                var wx = w * x2, wy = w * y2, wz = w * z2;
                array[index + 0] = 1 - (yy + zz);
                array[index + 1] = xy + wz;
                array[index + 2] = xz - wy;
                array[index + 3] = 0;
                array[index + 4] = xy - wz;
                array[index + 5] = 1 - (xx + zz);
                array[index + 6] = yz + wx;
                array[index + 7] = 0;
                array[index + 8] = xz + wy;
                array[index + 9] = yz - wx;
                array[index + 10] = 1 - (xx + yy);
                array[index + 11] = 0;
                array[index + 12] = position.x();
                array[index + 13] = position.y();
                array[index + 14] = position.z();
                array[index + 15] = 1;
            }
            function setMeshPosition(mesh, position, index) {
                if (index === void 0) { index = 0; }
                if (mesh.isInstancedMesh) {
                    var bodies = meshMap.get(mesh);
                    var body = bodies[index];
                    body.setAngularVelocity(new AmmoLib.btVector3(0, 0, 0));
                    body.setLinearVelocity(new AmmoLib.btVector3(0, 0, 0));
                    worldTransform.setIdentity();
                    worldTransform.setOrigin(new AmmoLib.btVector3(position.x, position.y, position.z));
                    body.setWorldTransform(worldTransform);
                }
                else if (mesh.isMesh) {
                    var body = meshMap.get(mesh);
                    body.setAngularVelocity(new AmmoLib.btVector3(0, 0, 0));
                    body.setLinearVelocity(new AmmoLib.btVector3(0, 0, 0));
                    worldTransform.setIdentity();
                    worldTransform.setOrigin(new AmmoLib.btVector3(position.x, position.y, position.z));
                    body.setWorldTransform(worldTransform);
                }
            }
            // function generateHeight(width, depth, minHeight, maxHeight) {
            //   // Generates the height data (a sinus wave)
            //   const size = width * depth;
            //   const data = new Float32Array(size);
            //   const hRange = maxHeight - minHeight;
            //   const w2 = width / 2;
            //   const d2 = depth / 2;
            //   const phaseMult = 12;
            //   let p = 0;
            //   for (let j = 0; j < depth; j++) {
            //     for (let i = 0; i < width; i++) {
            //       const radius = Math.sqrt(Math.pow((i - w2) / w2, 2.0) + Math.pow((j - d2) / d2, 2.0));
            //       const height = (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange + minHeight;
            //       data[p] = height;
            //       p++;
            //     }
            //   }
            //   return data;
            // }
            // animate
            setInterval(step, 1000 / frameRate);
            return {
                addMesh: addMesh,
                setMeshPosition: setMeshPosition
                // addCompoundMesh
            };
            // ... END ANIM?
            // AmmoLib.btDefaultCollisionConfiguration();
            // const ammoInstance = new AmmoLib();
            // const collisionConfiguration = new AmmoLib.btDefaultCollisionConfiguration();
            // const dispatcher = new AmmoLib.btCollisionDispatcher( collisionConfiguration );
            // const broadphase = new AmmoLib.btDbvtBroadphase();
            // const solver = new AmmoLib.btSequentialImpulseConstraintSolver();
            // const world = new AmmoLib.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
            // world.setGravity( new AmmoLib.btVector3( 0, - 9.8, 0 ) );
            // const worldTransform = new AmmoLib.btTransform();
            // ... START FROM THE TERRAIN DEMO
            function createTerrainShape() {
                // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
                var heightScale = 1;
                // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
                var upAxis = 1;
                // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
                var hdt = "PHY_FLOAT";
                // Set this to your needs (inverts the triangles)
                var flipQuadEdges = false;
                // Creates height data buffer in Ammo heap
                console.log("IS NULL?", AmmoLib);
                ammoHeightData = ammo._malloc(4 * terrainWidthSegmentCount * terrainDepthSegmentCount);
                // Copy the javascript height data array to the Ammo one.
                var p = 0;
                var p2 = 0;
                for (var j = 0; j < terrainDepthSegmentCount; j++) {
                    for (var i = 0; i < terrainWidthSegmentCount; i++) {
                        // write 32-bit float data to memory
                        ammo.HEAPF32[(ammoHeightData + p2) >> 2] = heightData[p];
                        _self;
                        p++;
                        // 4 bytes/float
                        p2 += 4;
                    }
                }
                // Creates the heightfield physics shape
                var heightFieldShape = new ammo.btHeightfieldTerrainShape(terrainWidthSegmentCount, terrainDepthSegmentCount, ammoHeightData, heightScale, terrainMinHeight, terrainMaxHeight, upAxis, hdt, flipQuadEdges);
                // Set horizontal scale
                var scaleX = terrainWidthExtents / (terrainWidthSegmentCount - 1);
                var scaleZ = terrainDepthExtents / (terrainDepthSegmentCount - 1);
                heightFieldShape.setLocalScaling(new ammo.btVector3(scaleX, 1, scaleZ));
                heightFieldShape.setMargin(0.05);
                return heightFieldShape;
            }
            // ... END FROM THE TERRAIN DEMO
        });
    };
    PhysicsHandler.prototype.initTestGraphics = function () {
        // const geometry = new THREE.PlaneGeometry(terrainWidthExtents, terrainDepthExtents, terrainWidth - 1, terrainDepth - 1);
        var geometry = new THREE.PlaneGeometry(terrainWidthExtents, terrainDepthExtents, terrainWidthSegmentCount - 1, terrainDepthSegmentCount - 1);
        geometry.rotateX(-Math.PI / 2);
        // TODO: use setXYZ and count from BufferAttribute
        var vertices = geometry.attributes.position.array;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            // j + 1 because it is the y component that we modify
            vertices[j + 1] = heightData[i];
            // vertices[j + 1] = this.terrain.data[i]; // heightData[i];
        }
        geometry.computeVertexNormals();
        var groundMaterial = new THREE.MeshPhongMaterial({ color: 0xc7c7c7 });
        var terrainMesh = new THREE.Mesh(geometry, groundMaterial);
        terrainMesh.receiveShadow = true;
        terrainMesh.castShadow = true;
        this.sceneContainer.scene.add(terrainMesh);
    };
    PhysicsHandler.prototype.render = function () {
        var deltaTime = this.sceneContainer.clock.getDelta();
        if (dynamicObjects.length < maxNumObjects && time > timeNextSpawn) {
            generateObject(this.ammo, this.sceneContainer.scene);
            timeNextSpawn = time + objectTimePeriod;
        }
        this.updatePhysics(deltaTime);
        // renderer.render(scene, camera);
        time += deltaTime;
    };
    PhysicsHandler.prototype.updatePhysics = function (deltaTime) {
        console.log("[updatePhysics] physicsWorld", physicsWorld);
        if (!this.ammoIsReady) {
            return;
        }
        physicsWorld.stepSimulation(deltaTime, 10);
        // Update objects
        for (var i = 0, il = dynamicObjects.length; i < il; i++) {
            var objThree = dynamicObjects[i];
            var objPhys = objThree.userData.physicsBody;
            var ms = objPhys.getMotionState();
            if (ms) {
                ms.getWorldTransform(worldTransform);
                var p = worldTransform.getOrigin();
                var q = worldTransform.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    };
    return PhysicsHandler;
}()); // END Class
exports.PhysicsHandler = PhysicsHandler;
function generateHeight(width, depth, minHeight, maxHeight) {
    // Generates the height data (a sinus wave)
    var size = width * depth;
    var data = new Float32Array(size);
    var hRange = maxHeight - minHeight;
    var w2 = width / 2;
    var d2 = depth / 2;
    var phaseMult = 12;
    var p = 0;
    for (var j = 0; j < depth; j++) {
        for (var i = 0; i < width; i++) {
            var radius = Math.sqrt(Math.pow((i - w2) / w2, 2.0) + Math.pow((j - d2) / d2, 2.0));
            var height = (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange + minHeight;
            data[p] = height;
            p++;
        }
    }
    return data;
}
function initPhysics(ammo) {
    // Physics configuration
    // collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    // dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
    // broadphase = new Ammo.btDbvtBroadphase();
    // solver = new Ammo.btSequentialImpulseConstraintSolver();
    // physicsWorld = new ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    // physicsWorld.setGravity(new ammo.btVector3(0, -6, 0));
    // Create the terrain body
    var groundShape = createTerrainShape(ammo);
    var groundTransform = new ammo.btTransform();
    groundTransform.setIdentity();
    // Shifts the terrain, since bullet re-centers it on its bounding box.
    groundTransform.setOrigin(new ammo.btVector3(0, (terrainMaxHeight + terrainMinHeight) / 2, 0));
    var groundMass = 0;
    var groundLocalInertia = new ammo.btVector3(0, 0, 0);
    var groundMotionState = new ammo.btDefaultMotionState(groundTransform);
    var groundBody = new ammo.btRigidBody(new ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, groundShape, groundLocalInertia));
    physicsWorld.addRigidBody(groundBody);
    worldTransform = new ammo.btTransform();
}
function generateObject(ammo, scene) {
    var numTypes = 4;
    var objectType = Math.ceil(Math.random() * numTypes);
    var threeObject = null;
    var shape = null;
    var objectSize = 3;
    var margin = 0.05;
    var radius, height;
    switch (objectType) {
        case 1:
            // Sphere
            radius = 1 + Math.random() * objectSize;
            threeObject = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), createObjectMaterial());
            shape = new ammo.btSphereShape(radius);
            shape.setMargin(margin);
            break;
        case 2:
            // Box
            var sx = 1 + Math.random() * objectSize;
            var sy = 1 + Math.random() * objectSize;
            var sz = 1 + Math.random() * objectSize;
            threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), createObjectMaterial());
            shape = new ammo.btBoxShape(new ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
            shape.setMargin(margin);
            break;
        case 3:
            // Cylinder
            radius = 1 + Math.random() * objectSize;
            height = 1 + Math.random() * objectSize;
            threeObject = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 20, 1), createObjectMaterial());
            shape = new ammo.btCylinderShape(new ammo.btVector3(radius, height * 0.5, radius));
            shape.setMargin(margin);
            break;
        default:
            // Cone
            radius = 1 + Math.random() * objectSize;
            height = 2 + Math.random() * objectSize;
            threeObject = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 20, 2), createObjectMaterial());
            shape = new ammo.btConeShape(radius, height);
            break;
    }
    threeObject.position.set((Math.random() - 0.5) * terrainWidthSegmentCount * 0.6, terrainMaxHeight + objectSize + 2, (Math.random() - 0.5) * terrainDepthSegmentCount * 0.6);
    var mass = objectSize * 5;
    var localInertia = new ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);
    var transform = new ammo.btTransform();
    transform.setIdentity();
    var pos = threeObject.position;
    transform.setOrigin(new ammo.btVector3(pos.x, pos.y, pos.z));
    var motionState = new ammo.btDefaultMotionState(transform);
    var rbInfo = new ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    var body = new ammo.btRigidBody(rbInfo);
    threeObject.userData.physicsBody = body;
    threeObject.receiveShadow = true;
    threeObject.castShadow = true;
    scene.add(threeObject);
    dynamicObjects.push(threeObject);
    physicsWorld.addRigidBody(body);
}
function createObjectMaterial() {
    var c = Math.floor(Math.random() * (1 << 24));
    return new THREE.MeshPhongMaterial({ color: c });
}
function createTerrainShape(ammo) {
    // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
    var heightScale = 1;
    // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
    var upAxis = 1;
    // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
    var hdt = "PHY_FLOAT";
    // Set this to your needs (inverts the triangles)
    var flipQuadEdges = false;
    // Creates height data buffer in Ammo heap
    ammoHeightData = ammo._malloc(4 * terrainWidthSegmentCount * terrainDepthSegmentCount);
    // Copy the javascript height data array to the Ammo one.
    var p = 0;
    var p2 = 0;
    for (var j = 0; j < terrainDepthSegmentCount; j++) {
        for (var i = 0; i < terrainWidthSegmentCount; i++) {
            // write 32-bit float data to memory
            ammo.HEAPF32[(ammoHeightData + p2) >> 2] = heightData[p];
            p++;
            // 4 bytes/float
            p2 += 4;
        }
    }
    // Creates the heightfield physics shape
    var heightFieldShape = new ammo.btHeightfieldTerrainShape(terrainWidthSegmentCount, terrainDepthSegmentCount, ammoHeightData, heightScale, terrainMinHeight, terrainMaxHeight, upAxis, hdt, flipQuadEdges);
    // Set horizontal scale
    var scaleX = terrainWidthExtents / (terrainWidthSegmentCount - 1);
    var scaleZ = terrainDepthExtents / (terrainDepthSegmentCount - 1);
    heightFieldShape.setLocalScaling(new ammo.btVector3(scaleX, 1, scaleZ));
    heightFieldShape.setMargin(0.05);
    return heightFieldShape;
}
//# sourceMappingURL=PhysicsHandler.js.map