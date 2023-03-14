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
var terrainWidthExtents = 100;
var terrainDepthExtents = 100;
var terrainWidthSegmentCount = 128;
var terrainDepthSegmentCount = 128;
var terrainMaxHeight = 8;
var terrainMinHeight = -2;
var time = 0;
var objectTimePeriod = 3;
var timeNextSpawn = time + 0.5; // objectTimePeriod; // Span first object after one half second
var maxNumObjects = 30;
// interns
// let heightData: Float32Array = null;
// let ammoHeightData: number = null;
// let physicsWorld: Ammo.btDiscreteDynamicsWorld = null;
// const dynamicObjects: Array<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>> = [];
// let worldTransform: Ammo.btTransform;
// var collisionConfiguration: Ammo.btDefaultCollisionConfiguration = null;
// var dispatcher: Ammo.btCollisionDispatcher = null;
// var broadphase: Ammo.btDbvtBroadphase = null;
// var solver: Ammo.btSequentialImpulseConstraintSolver = null;
var PhysicsHandler = /** @class */ (function () {
    function PhysicsHandler(sceneContainer, terrain) {
        this.ammoIsReady = false;
        this.heightData = null;
        this.ammoHeightData = null;
        this.physicsWorld = null;
        this.dynamicObjects = [];
        this.collisionConfiguration = null;
        this.dispatcher = null;
        this.broadphase = null;
        this.solver = null;
        this.sceneContainer = sceneContainer;
        this.terrain = terrain;
        this.heightData = generateHeight(terrainWidthSegmentCount, terrainDepthSegmentCount, terrainMinHeight, terrainMaxHeight);
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
    /*
    unusedCode(ammo) {
      // ... START ANIM?
  
      const meshes = [];
      const meshMap = new WeakMap();
  
      function addMesh(mesh: THREE.Mesh | THREE.InstancedMesh, mass: number = 0) {
        const shape = getShape(mesh.geometry);
  
        if (shape !== null) {
          if (mesh instanceof THREE.InstancedMesh && mesh.isInstancedMesh) {
            handleInstancedMesh(mesh, mass, shape);
          } else if (mesh.isMesh) {
            handleMesh(ammo, mesh, mass, shape);
          }
        }
      }
  
      function handleInstancedMesh(mesh: THREE.InstancedMesh, mass: number, shape) {
        // const array = mesh.instanceMatrix.array;
        const array = mesh.instanceMatrix.array as Array<number>; // TODO: check
  
        const bodies = [];
  
        for (let i = 0; i < mesh.count; i++) {
          const index = i * 16;
  
          const transform = new ammo.btTransform();
          transform.setFromOpenGLMatrix(array.slice(index, index + 16));
  
          const motionState = new ammo.btDefaultMotionState(transform);
  
          const localInertia = new ammo.btVector3(0, 0, 0);
          shape.calculateLocalInertia(mass, localInertia);
  
          const rbInfo = new ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
  
          const body = new ammo.btRigidBody(rbInfo);
          physicsWorld.addRigidBody(body);
  
          bodies.push(body);
        }
  
        if (mass > 0) {
          meshes.push(mesh);
  
          meshMap.set(mesh, bodies);
        }
      }
  
      function getShape(geometry) {
        const parameters = geometry.parameters;
  
        // TODO change type to is*
  
        if (geometry.type === "BoxGeometry") {
          const sx = parameters.width !== undefined ? parameters.width / 2 : 0.5;
          const sy = parameters.height !== undefined ? parameters.height / 2 : 0.5;
          const sz = parameters.depth !== undefined ? parameters.depth / 2 : 0.5;
  
          const shape = new ammo.btBoxShape(new ammo.btVector3(sx, sy, sz));
          shape.setMargin(0.05);
  
          return shape;
        } else if (geometry.type === "SphereGeometry" || geometry.type === "IcosahedronGeometry") {
          const radius = parameters.radius !== undefined ? parameters.radius : 1;
  
          const shape = new ammo.btSphereShape(radius);
          shape.setMargin(0.05);
  
          return shape;
        }
  
        return null;
      }
  
      function handleMesh(ammo, mesh, mass, shape) {
        const position = mesh.position;
        const quaternion = mesh.quaternion;
  
        const transform = new ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new ammo.btVector3(position.x, position.y, position.z));
        transform.setRotation(new ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
  
        const motionState = new ammo.btDefaultMotionState(transform);
  
        const localInertia = new ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);
  
        const rbInfo = new ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
  
        const body = new ammo.btRigidBody(rbInfo);
        // body.setFriction( 4 );
        physicsWorld.addRigidBody(body);
  
        if (mass > 0) {
          meshes.push(mesh);
          meshMap.set(mesh, body);
        }
      }
  
      //
  
      let lastTime = 0;
  
      function step() {
        const time = performance.now();
  
        if (lastTime > 0) {
          const delta = (time - lastTime) / 1000;
  
          // console.time( 'world.step' );
          physicsWorld.stepSimulation(delta, 10);
          // console.timeEnd( 'world.step' );
        }
  
        lastTime = time;
  
        //
  
        for (let i = 0, l = meshes.length; i < l; i++) {
          const mesh = meshes[i];
  
          if (mesh.isInstancedMesh) {
            const array = mesh.instanceMatrix.array;
            const bodies = meshMap.get(mesh);
  
            for (let j = 0; j < bodies.length; j++) {
              const body = bodies[j];
  
              const motionState = body.getMotionState();
              motionState.getWorldTransform(worldTransform);
  
              const position = worldTransform.getOrigin();
              const quaternion = worldTransform.getRotation();
  
              compose(position, quaternion, array, j * 16);
            }
  
            mesh.instanceMatrix.needsUpdate = true;
          } else if (mesh.isMesh) {
            const body = meshMap.get(mesh);
  
            const motionState = body.getMotionState();
            motionState.getWorldTransform(worldTransform);
  
            const position = worldTransform.getOrigin();
            const quaternion = worldTransform.getRotation();
            mesh.position.set(position.x(), position.y(), position.z());
            mesh.quaternion.set(quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w());
          }
        }
      }
  
      function compose(position, quaternion, array, index) {
        const x = quaternion.x(),
          y = quaternion.y(),
          z = quaternion.z(),
          w = quaternion.w();
        const x2 = x + x,
          y2 = y + y,
          z2 = z + z;
        const xx = x * x2,
          xy = x * y2,
          xz = x * z2;
        const yy = y * y2,
          yz = y * z2,
          zz = z * z2;
        const wx = w * x2,
          wy = w * y2,
          wz = w * z2;
  
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
  
      function setMeshPosition(mesh, position, index = 0) {
        if (mesh.isInstancedMesh) {
          const bodies = meshMap.get(mesh);
          const body = bodies[index];
  
          body.setAngularVelocity(new ammo.btVector3(0, 0, 0));
          body.setLinearVelocity(new ammo.btVector3(0, 0, 0));
  
          worldTransform.setIdentity();
          worldTransform.setOrigin(new ammo.btVector3(position.x, position.y, position.z));
          body.setWorldTransform(worldTransform);
        } else if (mesh.isMesh) {
          const body = meshMap.get(mesh);
  
          body.setAngularVelocity(new ammo.btVector3(0, 0, 0));
          body.setLinearVelocity(new ammo.btVector3(0, 0, 0));
  
          worldTransform.setIdentity();
          worldTransform.setOrigin(new ammo.btVector3(position.x, position.y, position.z));
          body.setWorldTransform(worldTransform);
        }
      }
  
      // ... START FROM THE TERRAIN DEMO
      function createTerrainShape() {
        // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
        const heightScale = 1;
  
        // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
        const upAxis = 1;
  
        // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
        const hdt = "PHY_FLOAT";
  
        // Set this to your needs (inverts the triangles)
        const flipQuadEdges = false;
  
        // Creates height data buffer in Ammo heap
        // console.log("IS NULL?", AmmoLib);
        ammoHeightData = ammo._malloc(4 * terrainWidthSegmentCount * terrainDepthSegmentCount);
  
        // Copy the javascript height data array to the Ammo one.
        let p = 0;
        let p2 = 0;
  
        for (let j = 0; j < terrainDepthSegmentCount; j++) {
          for (let i = 0; i < terrainWidthSegmentCount; i++) {
            // write 32-bit float data to memory
            ammo.HEAPF32[(ammoHeightData + p2) >> 2] = heightData[p];
  
            p++;
  
            // 4 bytes/float
            p2 += 4;
          }
        }
  
        // Creates the heightfield physics shape
        const heightFieldShape = new ammo.btHeightfieldTerrainShape(
          terrainWidthSegmentCount,
          terrainDepthSegmentCount,
          ammoHeightData,
          heightScale,
          terrainMinHeight,
          terrainMaxHeight,
          upAxis,
          hdt,
          flipQuadEdges
        );
  
        // Set horizontal scale
        const scaleX = terrainWidthExtents / (terrainWidthSegmentCount - 1);
        const scaleZ = terrainDepthExtents / (terrainDepthSegmentCount - 1);
        heightFieldShape.setLocalScaling(new ammo.btVector3(scaleX, 1, scaleZ));
  
        heightFieldShape.setMargin(0.05);
  
        return heightFieldShape;
      }
      // ... END FROM THE TERRAIN DEMO
    } */
    PhysicsHandler.prototype.initTestGraphics = function () {
        // const geometry = new THREE.PlaneGeometry(terrainWidthExtents, terrainDepthExtents, terrainWidth - 1, terrainDepth - 1);
        var geometry = new THREE.PlaneGeometry(terrainWidthExtents, terrainDepthExtents, terrainWidthSegmentCount - 1, terrainDepthSegmentCount - 1);
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
        var groundShape = createTerrainShape(this); // }, this.ammo);
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
// function initPhysics(physicsHandler: PhysicsHandler, ammo: TAmmo) {
//   // Physics configuration
//   const groundShape = createTerrainShape(physicsHandler, ammo);
//   const groundTransform = new ammo.btTransform();
//   groundTransform.setIdentity();
//   // Shifts the terrain, since bullet re-centers it on its bounding box.
//   groundTransform.setOrigin(new ammo.btVector3(0, (terrainMaxHeight + terrainMinHeight) / 2, 0));
//   const groundMass = 0;
//   const groundLocalInertia = new ammo.btVector3(0, 0, 0);
//   const groundMotionState = new ammo.btDefaultMotionState(groundTransform);
//   const groundBody = new ammo.btRigidBody(
//     new ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, groundShape, groundLocalInertia)
//   );
//   physicsHandler.physicsWorld.addRigidBody(groundBody);
//   worldTransform = new ammo.btTransform();
// }
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
    threeObject.position.set((Math.random() - 0.5) * terrainWidthSegmentCount * 0.6, terrainMaxHeight + objectSize + 2, (Math.random() - 0.5) * terrainDepthSegmentCount * 0.6);
    var mass = objectSize * 5;
    var localInertia = new physicsHandler.ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);
    var transform = new physicsHandler.ammo.btTransform();
    transform.setIdentity();
    var pos = threeObject.position;
    transform.setOrigin(new physicsHandler.ammo.btVector3(pos.x, pos.y, pos.z));
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
function createObjectMaterial() {
    var c = Math.floor(Math.random() * (1 << 24));
    return new THREE.MeshPhongMaterial({ color: c });
}
function createTerrainShape(physicsHandler) {
    // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
    var heightScale = 1;
    // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
    var upAxis = 1;
    // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
    var hdt = "PHY_FLOAT";
    // Set this to your needs (inverts the triangles)
    var flipQuadEdges = false;
    // Creates height data buffer in Ammo heap
    physicsHandler.ammoHeightData = physicsHandler.ammo._malloc(4 * terrainWidthSegmentCount * terrainDepthSegmentCount);
    // Copy the javascript height data array to the Ammo one.
    var p = 0;
    var p2 = 0;
    for (var j = 0; j < terrainDepthSegmentCount; j++) {
        for (var i = 0; i < terrainWidthSegmentCount; i++) {
            // write 32-bit float data to memory
            physicsHandler.ammo.HEAPF32[(physicsHandler.ammoHeightData + p2) >> 2] = physicsHandler.heightData[p];
            p++;
            // 4 bytes/float
            p2 += 4;
        }
    }
    // Creates the heightfield physics shape
    var heightFieldShape = new physicsHandler.ammo.btHeightfieldTerrainShape(terrainWidthSegmentCount, terrainDepthSegmentCount, physicsHandler.ammoHeightData, heightScale, terrainMinHeight, terrainMaxHeight, upAxis, hdt, flipQuadEdges);
    // Set horizontal scale
    var scaleX = terrainWidthExtents / (terrainWidthSegmentCount - 1);
    var scaleZ = terrainDepthExtents / (terrainDepthSegmentCount - 1);
    heightFieldShape.setLocalScaling(new physicsHandler.ammo.btVector3(scaleX, 1, scaleZ));
    heightFieldShape.setMargin(0.05);
    return heightFieldShape;
}
//# sourceMappingURL=PhysicsHandler.js.map