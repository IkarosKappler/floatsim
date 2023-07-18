import * as THREE from "three";
import { SceneContainer } from "../components/SceneContainer";
import { Navpoint } from "../components/interfaces";
import { NavpointRouter } from "./NavpointRouter";
import { NavigationManager } from "./NavigationManager";

export class GameLogicManager {
  private sceneContainer: SceneContainer;
  readonly navpointRouter: NavpointRouter;
  readonly navigationManager: NavigationManager;

  constructor(sceneContainer: SceneContainer) {
    this.sceneContainer = sceneContainer;
    this.navigationManager = new NavigationManager(sceneContainer);
    this.navpointRouter = new NavpointRouter(sceneContainer, this);
  }

  update(elapsedTime: number, discreteDetectionTime: number) {
    // console.log("Update distance detection", elapsedTime);
    // this.navpointRouter.update(elapsedTime, discreteDetectionTime);
    this.navigationManager.update(elapsedTime, discreteDetectionTime);
  }
}
