/**
 * @author  Ikaros Kappler
 * @date    2023-03-11
 * @version 1.0.0
 */

import * as THREE from "three";
import Ammo from "ammojs-typed";
import { generateDemoHeight } from "../utils/generateDemoHeight";

import { PerlinTerrain } from "./environment/PerlinTerrain";
import { SceneContainer } from "./SceneContainer";

type TAmmo = typeof Ammo;
type AmmoShapeType = Ammo.btSphereShape | Ammo.btBoxShape | Ammo.btCylinderShape | Ammo.btConeShape;

// Heightfield parameters
// const terrainWidthExtents = 100;
// const terrainDepthExtents = 100;
// const terrainWidthSegmentCount = 128;
// const terrainDepthSegmentCount = 128;
const terrainMaxHeight = 8;
const terrainMinHeight = -2;

const HEIGHT_SCALE = 5;

let time: number = 0;
const objectTimePeriod: number = 3;
let timeNextSpawn: number = time + 0.5; // objectTimePeriod; // Span first object after one half second
const maxNumObjects: number = 30;

export class PhysicsHandler {
  sceneContainer: SceneContainer;
  terrain: PerlinTerrain;
  ammo: TAmmo;
  private ammoIsReady: boolean = false;
  readonly heightData: Float32Array = null;
  ammoHeightData: number = null;
  physicsWorld: Ammo.btDiscreteDynamicsWorld = null;
  readonly dynamicObjects: Array<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>> = [];
  worldTransform: Ammo.btTransform;

  terrainWidthExtents: number = 100;
  terrainDepthExtents: number = 100;

  // Will be overridden
  terrainWidthSegmentCount: number = 128;
  terrainDepthSegmentCount: number = 128;

  collisionConfiguration: Ammo.btDefaultCollisionConfiguration = null;
  dispatcher: Ammo.btCollisionDispatcher = null;
  broadphase: Ammo.btDbvtBroadphase = null;
  solver: Ammo.btSequentialImpulseConstraintSolver = null;

  constructor(sceneContainer: SceneContainer, terrain: PerlinTerrain) {
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

  start(): Promise<boolean> {
    const _self = this;

    // Ammojs Initialization
    // Sorry, this is really dirty, but I didn't find a more elegant solution
    // to import this weird module, yet.
    const AmmoLib = (globalThis["Ammo"] as any)();

    return new Promise<boolean>((accept, _reject) => {
      AmmoLib.then((ammo: typeof Ammo) => {
        // console.log("THEN", ammo);

        this.ammo = ammo;
        this.ammoIsReady = true;

        _self.collisionConfiguration = new ammo.btDefaultCollisionConfiguration();
        _self.dispatcher = new ammo.btCollisionDispatcher(_self.collisionConfiguration);
        _self.broadphase = new ammo.btDbvtBroadphase();
        _self.solver = new ammo.btSequentialImpulseConstraintSolver();
        _self.physicsWorld = new ammo.btDiscreteDynamicsWorld(
          _self.dispatcher,
          _self.broadphase,
          _self.solver,
          _self.collisionConfiguration
        );
        _self.physicsWorld.setGravity(new ammo.btVector3(0, -9.8, 0));

        _self.worldTransform = new ammo.btTransform();

        this.initPhysics(); //, ammo);

        accept(true);
      });
    });
  }

  initTestGraphics() {
    const geometry = new THREE.PlaneGeometry(
      this.terrainWidthExtents,
      this.terrainDepthExtents,
      this.terrainWidthSegmentCount - 1,
      this.terrainDepthSegmentCount - 1
    );

    geometry.rotateX(-Math.PI / 2);

    // TODO: use setXYZ and count from BufferAttribute

    const vertices = (geometry.attributes.position as any).array;

    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      // j + 1 because it is the y component that we modify
      vertices[j + 1] = this.heightData[i];
      // vertices[j + 1] = this.terrain.data[i]; // heightData[i];
    }

    geometry.computeVertexNormals();

    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xc7c7c7 });
    const terrainMesh = new THREE.Mesh(geometry, groundMaterial);
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = true;

    terrainMesh.scale.y = HEIGHT_SCALE;
    terrainMesh.position.y = -HEIGHT_SCALE - (terrainMaxHeight - terrainMinHeight) + HEIGHT_SCALE * 0.6 - 20;

    this.sceneContainer.scene.add(terrainMesh);
  }

  /**
   * This function must be called on each main render cycle. It
   * will calculate the next frame in the physics simulation.
   */
  render() {
    const deltaTime = this.sceneContainer.clock.getDelta();
    // console.log("time", time, "timeNextSpawn", timeNextSpawn);

    if (this.dynamicObjects.length < maxNumObjects && time > timeNextSpawn) {
      generateObject(this); //, this.ammo, this.sceneContainer.scene);
      timeNextSpawn = time + objectTimePeriod;
    }

    this.updatePhysics(deltaTime);
    time += deltaTime;
  }

  private updatePhysics(deltaTime) {
    if (!this.ammoIsReady) {
      console.log("[updatePhysics] physicsWorld not yet initialized", this.physicsWorld);
      return;
    }
    this.physicsWorld.stepSimulation(deltaTime, 10);

    // Update objects
    for (let i = 0, il = this.dynamicObjects.length; i < il; i++) {
      const objThree = this.dynamicObjects[i];
      const objPhys = objThree.userData.physicsBody;
      const ms = objPhys.getMotionState();
      if (ms) {
        ms.getWorldTransform(this.worldTransform);
        const p = this.worldTransform.getOrigin();
        const q = this.worldTransform.getRotation();
        objThree.position.set(p.x(), p.y(), p.z());
        objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
      }
    }
  } // END updatePhsics

  private initPhysics() {
    // Physics configuration
    const groundShape = createTerrainShape(this);
    const groundTransform = new this.ammo.btTransform();
    groundTransform.setIdentity();
    // Shifts the terrain, since bullet re-centers it on its bounding box.
    groundTransform.setOrigin(new this.ammo.btVector3(0, (terrainMaxHeight + terrainMinHeight) / 2, 0));
    const groundMass = 0;
    const groundLocalInertia = new this.ammo.btVector3(0, 0, 0);
    const groundMotionState = new this.ammo.btDefaultMotionState(groundTransform);
    const groundBody = new this.ammo.btRigidBody(
      new this.ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, groundShape, groundLocalInertia)
    );
    this.physicsWorld.addRigidBody(groundBody);

    this.worldTransform = new this.ammo.btTransform();
  }
} // END Class

const generateObject = (physicsHandler: PhysicsHandler) => {
  // }, ammo: TAmmo, scene: THREE.Scene) => {
  const numTypes: number = 4;
  const objectType: number = Math.ceil(Math.random() * numTypes);

  let threeObject: THREE.Mesh = null;
  let shape: AmmoShapeType = null;

  const objectSize: number = 3;
  const margin: number = 0.05;

  let radius, height;

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
      const sx = 1 + Math.random() * objectSize;
      const sy = 1 + Math.random() * objectSize;
      const sz = 1 + Math.random() * objectSize;
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

  threeObject.position.set(
    (Math.random() - 0.5) * physicsHandler.terrainWidthSegmentCount * 0.6,
    terrainMaxHeight + objectSize + 2,
    (Math.random() - 0.5) * physicsHandler.terrainDepthSegmentCount * 0.6
  );

  const mass: number = objectSize * 5;
  const localInertia: Ammo.btVector3 = new physicsHandler.ammo.btVector3(0, 0, 0);
  shape.calculateLocalInertia(mass, localInertia);
  const transform: Ammo.btTransform = new physicsHandler.ammo.btTransform();
  transform.setIdentity();
  const pos = threeObject.position;
  transform.setOrigin(new physicsHandler.ammo.btVector3(pos.x, pos.y + 50, pos.z));
  const motionState: Ammo.btDefaultMotionState = new physicsHandler.ammo.btDefaultMotionState(transform);
  const rbInfo: Ammo.btRigidBodyConstructionInfo = new physicsHandler.ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    shape,
    localInertia
  );
  const body: Ammo.btRigidBody = new physicsHandler.ammo.btRigidBody(rbInfo);

  threeObject.userData.physicsBody = body;

  threeObject.receiveShadow = true;
  threeObject.castShadow = true;

  physicsHandler.sceneContainer.scene.add(threeObject);
  physicsHandler.dynamicObjects.push(threeObject);

  physicsHandler.physicsWorld.addRigidBody(body);
};

const createObjectMaterial = () => {
  const c = Math.floor(Math.random() * (1 << 24));
  return new THREE.MeshPhongMaterial({ color: c });
};

const createTerrainShape = (physicsHandler: PhysicsHandler) => {
  // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
  // const heightScale = 10;

  // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
  const upAxis = 1;

  // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
  const hdt = "PHY_FLOAT";

  // Set this to your needs (inverts the triangles)
  const flipQuadEdges = false;

  // Creates height data buffer in Ammo heap
  physicsHandler.ammoHeightData = physicsHandler.ammo._malloc(
    4 * physicsHandler.terrainWidthSegmentCount * physicsHandler.terrainDepthSegmentCount
  );

  // Copy the javascript height data array to the Ammo one.
  let p = 0;
  let p2 = 0;

  for (let j = 0; j < physicsHandler.terrainDepthSegmentCount; j++) {
    for (let i = 0; i < physicsHandler.terrainWidthSegmentCount; i++) {
      // write 32-bit float data to memory
      physicsHandler.ammo.HEAPF32[(physicsHandler.ammoHeightData + p2) >> 2] = physicsHandler.heightData[p];

      p++;

      // 4 bytes/float
      p2 += 4;
    }
  }

  // Creates the heightfield physics shape
  const heightFieldShape = new physicsHandler.ammo.btHeightfieldTerrainShape(
    physicsHandler.terrainWidthSegmentCount,
    physicsHandler.terrainDepthSegmentCount,
    physicsHandler.ammoHeightData,
    HEIGHT_SCALE,
    terrainMinHeight,
    terrainMaxHeight,
    upAxis,
    hdt,
    flipQuadEdges
  );

  // Set horizontal scale
  const scaleX = physicsHandler.terrainWidthExtents / (physicsHandler.terrainWidthSegmentCount - 1);
  const scaleZ = physicsHandler.terrainDepthExtents / (physicsHandler.terrainDepthSegmentCount - 1);
  heightFieldShape.setLocalScaling(new physicsHandler.ammo.btVector3(scaleX, HEIGHT_SCALE, scaleZ));

  heightFieldShape.setMargin(0.05);

  return heightFieldShape;
};
