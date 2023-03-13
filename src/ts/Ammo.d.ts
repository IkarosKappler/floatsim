export declare class Ammo {
  then(AmmoThen): void;
}

// export declare class AmmoInit {
//   constructor();
//   btDefaultCollisionConfiguration();
// }

type AmmoThen = (ammo: Ammo) => void;

// export default function AmmoConstr(): Ammo;

// Found this at
//    https://componenthouse.com/2016/11/08/having-fun-with-typescript-threejs-and-ammo-js/

export declare namespace AmmoNS {
  export class btDefaultCollisionConfiguration {}

  export class btCollisionDispatcher {
    constructor(c: btDefaultCollisionConfiguration);
  }

  export class btVector3 {
    x(): number;
    y(): number;
    z(): number;
    constructor(x: number, y: number, z: number);
  }

  export class btAxisSweep3 {
    constructor(min: btVector3, max: btVector3);
  }

  export class btSequentialImpulseConstraintSolver {}

  export class btDiscreteDynamicsWorld {
    constructor(
      a: btCollisionDispatcher,
      b: btAxisSweep3,
      c: btSequentialImpulseConstraintSolver,
      d: btDefaultCollisionConfiguration
    );
    setGravity(v: btVector3);
    addRigidBody(b: btRigidBody);
    stepSimulation(n1: number, n2: number);
  }

  export class btConvexShape {
    calculateLocalInertia(n: number, v: btVector3);
    setMargin(n: number);
  }

  export class btBoxShape extends btConvexShape {
    constructor(v: btVector3);
  }

  export class btSphereShape extends btConvexShape {
    constructor(radius: number);
  }

  export class btRigidBody {
    constructor(info: btRigidBodyConstructionInfo);
    setActivationState(s: number);
  }

  export class btQuaternion {
    x(): number;
    y(): number;
    z(): number;
    w(): number;
    constructor(x: number, y: number, z: number, w: number);
  }

  export class btTransform {
    setIdentity();
    setOrigin(v: btVector3);
    getOrigin(): btVector3;
    setRotation(q: btQuaternion);
    getRotation(): btQuaternion;
  }

  export class btRigidBodyConstructionInfo {
    constructor(mass: number, motionState: btDefaultMotionState, shape: btConvexShape, inertia: btVector3);
  }

  export class btDefaultMotionState {
    constructor(t: btTransform);
  }
}
