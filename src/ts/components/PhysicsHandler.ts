/**
 * @author  Ikaros Kappler
 * @date    2023-03-11
 * @version 1.0.0
 */

import * as THREE from "three";
// import Ammo from "ammojs-typed";
// import Ammo from "../Ammo";
import { Ammo as AmmoImport } from "../Ammo";
import { SceneContainer } from "./SceneContainer";

export class PhysicsHandler {
  sceneContainer: SceneContainer;
  constructor(sceneContainer: SceneContainer) {
    this.sceneContainer = sceneContainer;
  }

  start() {
    // Variable declaration

    // Heightfield parameters
    const terrainWidthExtents = 100;
    const terrainDepthExtents = 100;
    const terrainWidth = 128;
    const terrainDepth = 128;
    const terrainHalfWidth = terrainWidth / 2;
    const terrainHalfDepth = terrainDepth / 2;
    const terrainMaxHeight = 8;
    const terrainMinHeight = -2;

    // interns
    let heightData = null;
    let ammoHeightData = null;

    // Ammojs Initialization
    // Ammo().then(start);
    // const ammo = Ammo();
    // console.log("tmp", ammo, typeof ammo.then);
    // (ammo as any).then(start);

    // Take a look at lib/jsm/phyrics/AmmoPhysics.js

    console.log("AmmoImport", AmmoImport);
    const AmmoLib: any = new AmmoImport(); // eslint-disable-line no-undef
    console.log("AmmoLib", AmmoLib);
    AmmoLib.then(ammo => {
      console.log("THEN", ammo);

      heightData = generateHeight(terrainWidth, terrainDepth, terrainMinHeight, terrainMaxHeight);

      const frameRate = 60;

      ammo.btDefaultCollisionConfiguration();

      const collisionConfiguration = new ammo.btDefaultCollisionConfiguration();
      const dispatcher = new ammo.btCollisionDispatcher(collisionConfiguration);
      const broadphase = new ammo.btDbvtBroadphase();
      const solver = new ammo.btSequentialImpulseConstraintSolver();
      const physicsWorld = new ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
      physicsWorld.setGravity(new ammo.btVector3(0, -9.8, 0));

      const worldTransform = new ammo.btTransform();

      // Create the terrain body

      const groundShape = createTerrainShape();
      const groundTransform = new ammo.btTransform();
      groundTransform.setIdentity();
      // Shifts the terrain, since bullet re-centers it on its bounding box.
      groundTransform.setOrigin(new ammo.btVector3(0, (terrainMaxHeight + terrainMinHeight) / 2, 0));
      const groundMass = 0;
      const groundLocalInertia = new ammo.btVector3(0, 0, 0);
      const groundMotionState = new ammo.btDefaultMotionState(groundTransform);
      const groundBody = new ammo.btRigidBody(
        new ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, groundShape, groundLocalInertia)
      );
      physicsWorld.addRigidBody(groundBody);

      const transformAux1 = new ammo.btTransform();

      // ... START ANIM?

      const meshes = [];
      const meshMap = new WeakMap();

      function addMesh(mesh, mass = 0) {
        const shape = getShape(mesh.geometry);

        if (shape !== null) {
          if (mesh.isInstancedMesh) {
            handleInstancedMesh(mesh, mass, shape);
          } else if (mesh.isMesh) {
            handleMesh(mesh, mass, shape);
          }
        }
      }

      function handleInstancedMesh(mesh, mass, shape) {
        const array = mesh.instanceMatrix.array;

        const bodies = [];

        for (let i = 0; i < mesh.count; i++) {
          const index = i * 16;

          const transform = new AmmoLib.btTransform();
          transform.setFromOpenGLMatrix(array.slice(index, index + 16));

          const motionState = new AmmoLib.btDefaultMotionState(transform);

          const localInertia = new AmmoLib.btVector3(0, 0, 0);
          shape.calculateLocalInertia(mass, localInertia);

          const rbInfo = new AmmoLib.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);

          const body = new AmmoLib.btRigidBody(rbInfo);
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

          const shape = new AmmoLib.btBoxShape(new AmmoLib.btVector3(sx, sy, sz));
          shape.setMargin(0.05);

          return shape;
        } else if (geometry.type === "SphereGeometry" || geometry.type === "IcosahedronGeometry") {
          const radius = parameters.radius !== undefined ? parameters.radius : 1;

          const shape = new AmmoLib.btSphereShape(radius);
          shape.setMargin(0.05);

          return shape;
        }

        return null;
      }

      function handleMesh(mesh, mass, shape) {
        const position = mesh.position;
        const quaternion = mesh.quaternion;

        const transform = new AmmoLib.btTransform();
        transform.setIdentity();
        transform.setOrigin(new AmmoLib.btVector3(position.x, position.y, position.z));
        transform.setRotation(new AmmoLib.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

        const motionState = new AmmoLib.btDefaultMotionState(transform);

        const localInertia = new AmmoLib.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);

        const rbInfo = new AmmoLib.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);

        const body = new AmmoLib.btRigidBody(rbInfo);
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

          body.setAngularVelocity(new AmmoLib.btVector3(0, 0, 0));
          body.setLinearVelocity(new AmmoLib.btVector3(0, 0, 0));

          worldTransform.setIdentity();
          worldTransform.setOrigin(new AmmoLib.btVector3(position.x, position.y, position.z));
          body.setWorldTransform(worldTransform);
        } else if (mesh.isMesh) {
          const body = meshMap.get(mesh);

          body.setAngularVelocity(new AmmoLib.btVector3(0, 0, 0));
          body.setLinearVelocity(new AmmoLib.btVector3(0, 0, 0));

          worldTransform.setIdentity();
          worldTransform.setOrigin(new AmmoLib.btVector3(position.x, position.y, position.z));
          body.setWorldTransform(worldTransform);
        }
      }

      function generateHeight(width, depth, minHeight, maxHeight) {
        // Generates the height data (a sinus wave)

        const size = width * depth;
        const data = new Float32Array(size);

        const hRange = maxHeight - minHeight;
        const w2 = width / 2;
        const d2 = depth / 2;
        const phaseMult = 12;

        let p = 0;

        for (let j = 0; j < depth; j++) {
          for (let i = 0; i < width; i++) {
            const radius = Math.sqrt(Math.pow((i - w2) / w2, 2.0) + Math.pow((j - d2) / d2, 2.0));

            const height = (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange + minHeight;

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
        const heightScale = 1;

        // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
        const upAxis = 1;

        // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
        const hdt = "PHY_FLOAT";

        // Set this to your needs (inverts the triangles)
        const flipQuadEdges = false;

        // Creates height data buffer in Ammo heap
        console.log("IS NULL?", AmmoLib);
        ammoHeightData = ammo._malloc(4 * terrainWidth * terrainDepth);

        // Copy the javascript height data array to the Ammo one.
        let p = 0;
        let p2 = 0;

        for (let j = 0; j < terrainDepth; j++) {
          for (let i = 0; i < terrainWidth; i++) {
            // write 32-bit float data to memory
            ammo.HEAPF32[(ammoHeightData + p2) >> 2] = heightData[p];

            p++;

            // 4 bytes/float
            p2 += 4;
          }
        }

        // Creates the heightfield physics shape
        const heightFieldShape = new ammo.btHeightfieldTerrainShape(
          terrainWidth,
          terrainDepth,
          ammoHeightData,
          heightScale,
          terrainMinHeight,
          terrainMaxHeight,
          upAxis,
          hdt,
          flipQuadEdges
        );

        // Set horizontal scale
        const scaleX = terrainWidthExtents / (terrainWidth - 1);
        const scaleZ = terrainDepthExtents / (terrainDepth - 1);
        heightFieldShape.setLocalScaling(new ammo.btVector3(scaleX, 1, scaleZ));

        heightFieldShape.setMargin(0.05);

        return heightFieldShape;
      }
      // ... END FROM THE TERRAIN DEMO
    });
  }
}
