import * as THREE from "three";
import { SceneContainer } from "../components/SceneContainer";
import { NavigationEventListener, Navpoint } from "../components/interfaces";
import { distance3 } from "../utils/Helpers";

export class NavigationManager {
  private sceneContainer: SceneContainer;
  private navPoints: Array<Navpoint>;
  private listeners: Array<NavigationEventListener>;
  private currentPointInRange: Navpoint | null = null;

  constructor(sceneContainer: SceneContainer) {
    this.sceneContainer = sceneContainer;
    this.navPoints = [];
    this.listeners = [];
  }

  addNavpoint(navpoint: Navpoint) {
    console.log("[NavigationManager] Adding nav point to route", navpoint.label);
    this.navPoints.push(navpoint);
  }

  addNavigationEventListener(listener: NavigationEventListener): boolean {
    for (var i in this.listeners) {
      if (this.listeners[i] === listener) {
        return false;
      }
    }
    this.listeners.push(listener);
    return true;
  }

  update(elapsedTime: number, discreteDetectionTime: number) {
    const curPosition = this.sceneContainer.camera.position;
    for (var i = 0; i < this.navPoints.length; i++) {
      this.handleNavpoint(i, curPosition);
    }
  }

  private handleNavpoint(index: number, curPosition: THREE.Vector3) {
    const routePoint = this.navPoints[index];
    const distance = distance3(curPosition, routePoint.position);
    // console.log("Checking nav point", this.navPoints[index].label, distance);
    if (distance <= routePoint.detectionDistance && !routePoint.userData.isCurrentlyInRange) {
      // Fire navpoint entered
      // console.log("Nav point in range", this.navPoints[index].label);

      this.fireNavpointRangeEntered(routePoint);
    } else if (distance > routePoint.detectionDistance && routePoint.userData.isCurrentlyInRange) {
      this.fireNavpointRangeExited(routePoint);
    }
  }

  private fireNavpointRangeEntered(navpoint: Navpoint) {
    if (this.currentPointInRange !== navpoint && navpoint && navpoint.onEnter) {
      navpoint.onEnter(navpoint);
    }
    this.currentPointInRange = navpoint;
    navpoint.userData.isCurrentlyInRange = true;

    for (var i in this.listeners) {
      this.listeners[i].onNavpointEntered(navpoint);
    }
  }

  private fireNavpointRangeExited(navpoint: Navpoint) {
    console.log("fireNavpointRangeExited", navpoint);
    if (navpoint === this.currentPointInRange && navpoint.onLeave) {
      navpoint.onLeave(navpoint);
    }
    this.currentPointInRange = null;
    navpoint.userData.isCurrentlyInRange = false;

    for (var i in this.listeners) {
      this.listeners[i].onNavpointExited(navpoint);
    }
  }
}
