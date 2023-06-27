import * as THREE from "three";
import { SceneContainer } from "../components/SceneContainer";
import { Navpoint } from "../components/interfaces";
import { NavpointRouter } from "./NavpointRouter";

export class GameLogicManager {
  private sceneContainer: SceneContainer;
  readonly navpointRouter: NavpointRouter;

  constructor(sceneContainer: SceneContainer) {
    this.sceneContainer = sceneContainer;
    this.navpointRouter = new NavpointRouter(sceneContainer);
  }

  update(elapsedTime: number, discreteDetectionTime: number) {
    // console.log("Update distance detection", elapsedTime);
    this.navpointRouter.update(elapsedTime, discreteDetectionTime);
  }
}
