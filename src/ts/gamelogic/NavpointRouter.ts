import * as THREE from "three";
import { SceneContainer } from "../components/SceneContainer";
import { NavigationEventListener, Navpoint } from "../components/interfaces";
import { distance3 } from "../utils/Helpers";
import { GameLogicManager } from "./GameLogicManager";

export class NavpointRouter implements NavigationEventListener {
  private sceneContainer: SceneContainer;
  private routePoints: Array<Navpoint>;
  private activeNavpointIndex: number;
  // private currentPointInRange: Navpoint | null = null;

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

  isCurrentRoutePoint(navpoint: Navpoint) {
    return this.getCurrentNavpoint() === navpoint;
  }

  isRouteComplete() {
    return this.activeNavpointIndex >= this.routePoints.length;
  }

  toggleNextRoutePoint() {
    this.activeNavpointIndex = (this.activeNavpointIndex + 1) % (this.routePoints.length + 1); // Include one null-point at the end
    this.showRoutpointMessage();
  }

  // BEGIN NavigationEventListener
  onNavpointEntered(navpoint: Navpoint) {
    // console.log("Navpoint entered", navpoint);
    const routePoint = this.routePoints[this.activeNavpointIndex];
    // if (this.currentPointInRange !== navpoint && navpoint && navpoint.onEnter) {
    //   navpoint.onEnter(navpoint, navpoint === routePoint);
    // }
    if (navpoint === routePoint) {
      routePoint.isDisabled = true;
      this.activeNavpointIndex++;
      if (this.activeNavpointIndex < this.routePoints.length) {
        this.routePoints[this.activeNavpointIndex].isDisabled = false;
        // console.log("label", this.routePoints[this.activeNavpointIndex].label);
        // this.sceneContainer.messageBox.showMessage(
        //   `Nav point reached! Next nav point is ${this.routePoints[this.activeNavpointIndex].label}.`
        // );
      } else {
        // console.log("You reached the final Nav point!");
        // this.sceneContainer.messageBox.showMessage("You reached the final Nav point!");
      }
      this.showRoutpointMessage();
    }
  }

  private showRoutpointMessage() {
    if (this.activeNavpointIndex < this.routePoints.length) {
      this.sceneContainer.messageBox.showMessage(
        `Nav point reached! Next nav point is ${this.routePoints[this.activeNavpointIndex].label}.`
      );
    } else {
      this.sceneContainer.messageBox.showMessage("You reached the final Nav point!");
    }
  }

  onNavpointExited(navpoint: Navpoint) {
    // NOOP
  }
  // END NavigationEventListener

  getCurrentNavpoint(): Navpoint | null {
    return this.routePoints[this.activeNavpointIndex];
  }
}
