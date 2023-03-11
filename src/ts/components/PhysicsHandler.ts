/**
 * @author  Ikaros Kappler
 * @date    2023-03-11
 * @version 1.0.0
 */

import * as THREE from "three";
import Ammo from "ammojs-typed";
// import Ammo from "../Ammo";
import { SceneContainer } from "./SceneContainer";

export class PhysicsHandler {
  sceneContainer: SceneContainer;
  constructor(sceneContainer: SceneContainer) {
    this.sceneContainer = sceneContainer;
  }

  start() {
    // Variable declaration

    function start() {
      // code goes here
      // ... huh?
    }

    // Ammojs Initialization
    // Ammo().then(start);
    // const ammo = Ammo();
    // console.log("tmp", ammo, typeof ammo.then);
    // (ammo as any).then(start);

    const AmmoLib = Ammo();
    const ammo = new AmmoLib();
  }
}
