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
// Heightfield parameters
// const terrainWidthExtents = 100;
// const terrainDepthExtents = 100;
// const terrainWidthSegmentCount = 128;
// const terrainDepthSegmentCount = 128;
var terrainMaxHeight = 8;
var terrainMinHeight = -2;
var HEIGHT_SCALE = 5;
var time = 0;
var objectTimePeriod = 3;
var timeNextSpawn = time + 0.5; // objectTimePeriod; // Span first object after one half second
var maxNumObjects = 30;
var PhysicsHandler = /** @class */ (function () {
    function PhysicsHandler(sceneContainer, terrain) {
        this.ammoIsReady = false;
        this.heightData = null;
        this.ammoHeightData = null;
        this.physicsWorld = null;
        this.dynamicObjects = [];
        this.terrainWidthExtents = 100;
        this.terrainDepthExtents = 100;
        // Will be overridden
        this.terrainWidthSegmentCount = 128;
        this.terrainDepthSegmentCount = 128;
        this.collisionConfiguration = null;
        this.dispatcher = null;
        this.broadphase = null;
        this.solver = null;
        this.sceneContainer = sceneContainer;
        this.terrain = terrain;
        // Use demo geometry as terrain?
        // this.heightData = generateDemoHeight(
        //   this.terrainWidthSegmentCount,
        //   this.terrainDepthSegmentCount,
        //   terrainMinHeight,
        //   terrainMaxHeight
        // );
        this.heightData = terrain.heightMap.data;
        this.terrainDepthSegmentCount = terrain.heightMap.depthSegments;
        this.terrainWidthSegmentCount = terrain.heightMap.widthSegments;
        // This will enable the real world settings of the terrain (large)
        this.terrainWidthExtents = terrain.worldSize.width;
        this.terrainDepthExtents = terrain.worldSize.depth;
        this.initTestGraphics();
    }
    PhysicsHandler.prototype.start = function () {
        var _this = this;
        var _self = this;
        // Ammojs Initialization
        // Sorry, this is really dirty, but I didn't find a more elegant solution
        // to import this weird module, yet.
        var AmmoLib = globalThis["Ammo"]();
        return new Promise(function (accept, _reject) {
            AmmoLib.then(function (ammo) {
                // console.log("THEN", ammo);
                _this.ammo = ammo;
                _this.ammoIsReady = true;
                _self.collisionConfiguration = new ammo.btDefaultCollisionConfiguration();
                _self.dispatcher = new ammo.btCollisionDispatcher(_self.collisionConfiguration);
                _self.broadphase = new ammo.btDbvtBroadphase();
                _self.solver = new ammo.btSequentialImpulseConstraintSolver();
                _self.physicsWorld = new ammo.btDiscreteDynamicsWorld(_self.dispatcher, _self.broadphase, _self.solver, _self.collisionConfiguration);
                _self.physicsWorld.setGravity(new ammo.btVector3(0, -9.8, 0));
                _self.worldTransform = new ammo.btTransform();
                _this.initPhysics(); //, ammo);
                accept(true);
            });
        });
    };
    PhysicsHandler.prototype.initTestGraphics = function () {
        var geometry = new THREE.PlaneGeometry(this.terrainWidthExtents, this.terrainDepthExtents, this.terrainWidthSegmentCount - 1, this.terrainDepthSegmentCount - 1);
        geometry.rotateX(-Math.PI / 2);
        // TODO: use setXYZ and count from BufferAttribute
        var vertices = geometry.attributes.position.array;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            // j + 1 because it is the y component that we modify
            vertices[j + 1] = this.heightData[i];
            // vertices[j + 1] = this.terrain.data[i]; // heightData[i];
        }
        geometry.computeVertexNormals();
        var groundMaterial = new THREE.MeshPhongMaterial({ color: 0xc7c7c7 });
        var terrainMesh = new THREE.Mesh(geometry, groundMaterial);
        terrainMesh.receiveShadow = true;
        terrainMesh.castShadow = true;
        terrainMesh.scale.y = HEIGHT_SCALE;
        terrainMesh.position.y = -HEIGHT_SCALE - (terrainMaxHeight - terrainMinHeight) + HEIGHT_SCALE * 0.6 - 20;
        this.sceneContainer.scene.add(terrainMesh);
    };
    /**
     * This function must be called on each main render cycle. It
     * will calculate the next frame in the physics simulation.
     */
    PhysicsHandler.prototype.render = function () {
        var deltaTime = this.sceneContainer.clock.getDelta();
        // console.log("time", time, "timeNextSpawn", timeNextSpawn);
        if (this.dynamicObjects.length < maxNumObjects && time > timeNextSpawn) {
            generateObject(this); //, this.ammo, this.sceneContainer.scene);
            timeNextSpawn = time + objectTimePeriod;
        }
        this.updatePhysics(deltaTime);
        time += deltaTime;
    };
    PhysicsHandler.prototype.updatePhysics = function (deltaTime) {
        if (!this.ammoIsReady) {
            console.log("[updatePhysics] physicsWorld not yet initialized", this.physicsWorld);
            return;
        }
        this.physicsWorld.stepSimulation(deltaTime, 10);
        // Update objects
        for (var i = 0, il = this.dynamicObjects.length; i < il; i++) {
            var objThree = this.dynamicObjects[i];
            var objPhys = objThree.userData.physicsBody;
            var ms = objPhys.getMotionState();
            if (ms) {
                ms.getWorldTransform(this.worldTransform);
                var p = this.worldTransform.getOrigin();
                var q = this.worldTransform.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }; // END updatePhsics
    PhysicsHandler.prototype.initPhysics = function () {
        // Physics configuration
        var groundShape = createTerrainShape(this);
        var groundTransform = new this.ammo.btTransform();
        groundTransform.setIdentity();
        // Shifts the terrain, since bullet re-centers it on its bounding box.
        groundTransform.setOrigin(new this.ammo.btVector3(0, (terrainMaxHeight + terrainMinHeight) / 2, 0));
        var groundMass = 0;
        var groundLocalInertia = new this.ammo.btVector3(0, 0, 0);
        var groundMotionState = new this.ammo.btDefaultMotionState(groundTransform);
        var groundBody = new this.ammo.btRigidBody(new this.ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, groundShape, groundLocalInertia));
        this.physicsWorld.addRigidBody(groundBody);
        this.worldTransform = new this.ammo.btTransform();
    };
    return PhysicsHandler;
}()); // END Class
exports.PhysicsHandler = PhysicsHandler;
var generateObject = function (physicsHandler) {
    // }, ammo: TAmmo, scene: THREE.Scene) => {
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
            shape = new physicsHandler.ammo.btSphereShape(radius);
            shape.setMargin(margin);
            break;
        case 2:
            // Box
            var sx = 1 + Math.random() * objectSize;
            var sy = 1 + Math.random() * objectSize;
            var sz = 1 + Math.random() * objectSize;
            threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), createObjectMaterial());
            shape = new physicsHandler.ammo.btBoxShape(new physicsHandler.ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
            shape.setMargin(margin);
            break;
        case 3:
            // Cylinder
            radius = 1 + Math.random() * objectSize;
            height = 1 + Math.random() * objectSize;
            threeObject = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 20, 1), createObjectMaterial());
            shape = new physicsHandler.ammo.btCylinderShape(new physicsHandler.ammo.btVector3(radius, height * 0.5, radius));
            shape.setMargin(margin);
            break;
        default:
            // Cone
            radius = 1 + Math.random() * objectSize;
            height = 2 + Math.random() * objectSize;
            threeObject = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 20, 2), createObjectMaterial());
            shape = new physicsHandler.ammo.btConeShape(radius, height);
            break;
    }
    threeObject.position.set((Math.random() - 0.5) * physicsHandler.terrainWidthSegmentCount * 0.6, terrainMaxHeight + objectSize + 2, (Math.random() - 0.5) * physicsHandler.terrainDepthSegmentCount * 0.6);
    var mass = objectSize * 5;
    var localInertia = new physicsHandler.ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);
    var transform = new physicsHandler.ammo.btTransform();
    transform.setIdentity();
    var pos = threeObject.position;
    transform.setOrigin(new physicsHandler.ammo.btVector3(pos.x, pos.y + 50, pos.z));
    var motionState = new physicsHandler.ammo.btDefaultMotionState(transform);
    var rbInfo = new physicsHandler.ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    var body = new physicsHandler.ammo.btRigidBody(rbInfo);
    threeObject.userData.physicsBody = body;
    threeObject.receiveShadow = true;
    threeObject.castShadow = true;
    physicsHandler.sceneContainer.scene.add(threeObject);
    physicsHandler.dynamicObjects.push(threeObject);
    physicsHandler.physicsWorld.addRigidBody(body);
};
var createObjectMaterial = function () {
    var c = Math.floor(Math.random() * (1 << 24));
    return new THREE.MeshPhongMaterial({ color: c });
};
var createTerrainShape = function (physicsHandler) {
    // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
    // const heightScale = 10;
    // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
    var upAxis = 1;
    // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
    var hdt = "PHY_FLOAT";
    // Set this to your needs (inverts the triangles)
    var flipQuadEdges = false;
    // Creates height data buffer in Ammo heap
    physicsHandler.ammoHeightData = physicsHandler.ammo._malloc(4 * physicsHandler.terrainWidthSegmentCount * physicsHandler.terrainDepthSegmentCount);
    // Copy the javascript height data array to the Ammo one.
    var p = 0;
    var p2 = 0;
    for (var j = 0; j < physicsHandler.terrainDepthSegmentCount; j++) {
        for (var i = 0; i < physicsHandler.terrainWidthSegmentCount; i++) {
            // write 32-bit float data to memory
            physicsHandler.ammo.HEAPF32[(physicsHandler.ammoHeightData + p2) >> 2] = physicsHandler.heightData[p];
            p++;
            // 4 bytes/float
            p2 += 4;
        }
    }
    // Creates the heightfield physics shape
    var heightFieldShape = new physicsHandler.ammo.btHeightfieldTerrainShape(physicsHandler.terrainWidthSegmentCount, physicsHandler.terrainDepthSegmentCount, physicsHandler.ammoHeightData, HEIGHT_SCALE, terrainMinHeight, terrainMaxHeight, upAxis, hdt, flipQuadEdges);
    // Set horizontal scale
    var scaleX = physicsHandler.terrainWidthExtents / (physicsHandler.terrainWidthSegmentCount - 1);
    var scaleZ = physicsHandler.terrainDepthExtents / (physicsHandler.terrainDepthSegmentCount - 1);
    heightFieldShape.setLocalScaling(new physicsHandler.ammo.btVector3(scaleX, HEIGHT_SCALE, scaleZ));
    heightFieldShape.setMargin(0.05);
    return heightFieldShape;
};
//# sourceMappingURL=PhysicsHandler.js.map