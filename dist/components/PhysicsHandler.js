"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-03-11
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicsHandler = void 0;
// import Ammo from "ammojs-typed";
// import Ammo from "../Ammo";
var Ammo_1 = require("../Ammo");
var PhysicsHandler = /** @class */ (function () {
    function PhysicsHandler(sceneContainer) {
        this.sceneContainer = sceneContainer;
    }
    PhysicsHandler.prototype.start = function () {
        // Variable declaration
        // Heightfield parameters
        var terrainWidthExtents = 100;
        var terrainDepthExtents = 100;
        var terrainWidth = 128;
        var terrainDepth = 128;
        var terrainHalfWidth = terrainWidth / 2;
        var terrainHalfDepth = terrainDepth / 2;
        var terrainMaxHeight = 8;
        var terrainMinHeight = -2;
        // interns
        var heightData = null;
        var ammoHeightData = null;
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
            heightData = generateHeight(terrainWidth, terrainDepth, terrainMinHeight, terrainMaxHeight);
            var frameRate = 60;
            ammo.btDefaultCollisionConfiguration();
            var collisionConfiguration = new ammo.btDefaultCollisionConfiguration();
            var dispatcher = new ammo.btCollisionDispatcher(collisionConfiguration);
            var broadphase = new ammo.btDbvtBroadphase();
            var solver = new ammo.btSequentialImpulseConstraintSolver();
            var physicsWorld = new ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
            physicsWorld.setGravity(new ammo.btVector3(0, -9.8, 0));
            var worldTransform = new ammo.btTransform();
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
                    if (mesh.isInstancedMesh) {
                        handleInstancedMesh(mesh, mass, shape);
                    }
                    else if (mesh.isMesh) {
                        handleMesh(mesh, mass, shape);
                    }
                }
            }
            function handleInstancedMesh(mesh, mass, shape) {
                var array = mesh.instanceMatrix.array;
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
            function handleMesh(mesh, mass, shape) {
                var position = mesh.position;
                var quaternion = mesh.quaternion;
                var transform = new AmmoLib.btTransform();
                transform.setIdentity();
                transform.setOrigin(new AmmoLib.btVector3(position.x, position.y, position.z));
                transform.setRotation(new AmmoLib.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
                var motionState = new AmmoLib.btDefaultMotionState(transform);
                var localInertia = new AmmoLib.btVector3(0, 0, 0);
                shape.calculateLocalInertia(mass, localInertia);
                var rbInfo = new AmmoLib.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
                var body = new AmmoLib.btRigidBody(rbInfo);
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
                ammoHeightData = ammo._malloc(4 * terrainWidth * terrainDepth);
                // Copy the javascript height data array to the Ammo one.
                var p = 0;
                var p2 = 0;
                for (var j = 0; j < terrainDepth; j++) {
                    for (var i = 0; i < terrainWidth; i++) {
                        // write 32-bit float data to memory
                        ammo.HEAPF32[(ammoHeightData + p2) >> 2] = heightData[p];
                        p++;
                        // 4 bytes/float
                        p2 += 4;
                    }
                }
                // Creates the heightfield physics shape
                var heightFieldShape = new ammo.btHeightfieldTerrainShape(terrainWidth, terrainDepth, ammoHeightData, heightScale, terrainMinHeight, terrainMaxHeight, upAxis, hdt, flipQuadEdges);
                // Set horizontal scale
                var scaleX = terrainWidthExtents / (terrainWidth - 1);
                var scaleZ = terrainDepthExtents / (terrainDepth - 1);
                heightFieldShape.setLocalScaling(new ammo.btVector3(scaleX, 1, scaleZ));
                heightFieldShape.setMargin(0.05);
                return heightFieldShape;
            }
            // ... END FROM THE TERRAIN DEMO
        });
    };
    return PhysicsHandler;
}());
exports.PhysicsHandler = PhysicsHandler;
//# sourceMappingURL=PhysicsHandler.js.map