import * as THREE from "three";
import { SceneContainer } from "../components/SceneContainer";
import { NavigationEventListener, Navpoint } from "../components/interfaces";
import { distance3 } from "../utils/Helpers";
import { GameLogicManager } from "./GameLogicManager";

export class NavpointRouter implements NavigationEventListener {
  private sceneContainer: SceneContainer;
  private routePoints: Array<Navpoint>;
  private activeNavpointIndex: number;

  constructor(sceneContainer: SceneContainer, gameLogicManager: GameLogicManager) {
    this.sceneContainer = sceneContainer;
    this.routePoints = [];
    this.activeNavpointIndex = 0;
    gameLogicManager.navigationManager.addNavigationEventListener(this);
  }

  addToRoute(navpoint: Navpoint) {
    this.routePoints.push(navpoint);
    // Activate the first point
    if (this.activeNavpointIndex < this.routePoints.length) {
      this.routePoints[this.activeNavpointIndex].isDisabled = false;
    }
  }

  // BEGIN NavigationEventListener
  onNavpointEntered(navpoint: Navpoint) {
    const routePoint = this.routePoints[this.activeNavpointIndex];
    if (navpoint === routePoint) {
      this.routePoints[this.activeNavpointIndex].isDisabled = true;
      this.activeNavpointIndex++;
      if (this.activeNavpointIndex < this.routePoints.length) {
        this.routePoints[this.activeNavpointIndex].isDisabled = false;
        // console.log("label", this.routePoints[this.activeNavpointIndex].label);
        this.sceneContainer.messageBox.showMessage(
          `Nav point reached! Next nav point is ${this.routePoints[this.activeNavpointIndex].label}.`
        );
      } else {
        // console.log("You reached the final Nav point!");
        this.sceneContainer.messageBox.showMessage("You reached the final Nav point!");
      }
    }
  }

  onNavpointExited(navpoint: Navpoint) {
    // NOOP?
  }
  // BEGIN NavigationEventListener

  // update(elapsedTime: number, discreteDetectionTime: number) {
  //   // Check position
  //   if (this.activeNavpointIndex >= this.routePoints.length) {
  //     return;
  //   }
  //   const curPosition = this.sceneContainer.camera.position;
  //   const routePoint = this.routePoints[this.activeNavpointIndex];
  //   const distance = distance3(curPosition, routePoint.position);
  //   // console.log("Distance to nav point ", this.activeNavpointIndex, " is ", distance);
  //   if (distance <= routePoint.detectionDistance) {
  //     this.routePoints[this.activeNavpointIndex].isDisabled = true;
  //     this.activeNavpointIndex++;
  //     if (this.activeNavpointIndex < this.routePoints.length) {
  //       this.routePoints[this.activeNavpointIndex].isDisabled = false;
  //       // console.log("label", this.routePoints[this.activeNavpointIndex].label);
  //       this.sceneContainer.messageBox.showMessage(
  //         `Nav point reached! Next nav point is ${this.routePoints[this.activeNavpointIndex].label}.`
  //       );
  //     } else {
  //       // console.log("You reached the final Nav point!");
  //       this.sceneContainer.messageBox.showMessage("You reached the final Nav point!");
  //     }
  //   }
  // }

  getCurrentNavpoint(): Navpoint | null {
    return this.routePoints[this.activeNavpointIndex];
  }
}
