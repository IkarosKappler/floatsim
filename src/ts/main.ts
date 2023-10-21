/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */

import type preact from "preact";
import type axios from "axios";
import { SceneContainer } from "./components/SceneContainer";
import { FrontendUI } from "./dom/frontend/FrontendUI";
import { KeyHandler } from "./io/KeyHandler";
import { gup } from "./utils/gup";
import { Params } from "./utils/Params";

import * as TweakPane from "tweakpane";
import { IGlobalLibs } from "./components/interfaces";
import { MediaStorage } from "./io/MediaStorage";

console.log("Main script starting ...");
globalThis.addEventListener("load", () => {
  console.log("[main] Initializing");

  const preactLib = globalThis["preact"] as typeof preact;
  const axiosLib = globalThis["axios"] as typeof axios;

  console.log("[main] preact", preactLib);
  const globalLibs: IGlobalLibs = {
    preact: preactLib,
    axios: axiosLib
  };
  // The globalLibs will be used by the MediaStorage singleton
  MediaStorage.globalLibs = globalLibs;
  console.log("[main] globalLibs", globalLibs);

  const GUP: Record<string, string> = gup();
  const params: Params = new Params(GUP);

  console.log("SceneContainer", SceneContainer);
  const sceneContainer = new SceneContainer(params);

  const frontendUI = new FrontendUI(sceneContainer, globalLibs, params);
  console.log("frontendUI", frontendUI);

  console.log(TweakPane);
  const pane = new window["Tweakpane"].Pane({ title: "Params" }) as TweakPane.Pane;
  pane.addInput(sceneContainer.tweakParams, "compassZ", {
    min: -150,
    max: 150
  });
  const sonar = pane.addFolder({ title: "Sonar" });
  sonar.addInput(sceneContainer.tweakParams, "sonarX", {
    min: -350,
    max: 350
  });
  sonar.addInput(sceneContainer.tweakParams, "sonarY", {
    min: -350,
    max: 350
  });
  sonar.addInput(sceneContainer.tweakParams, "sonarZ", {
    min: -150,
    max: 150
  });
  pane.addInput(sceneContainer.tweakParams, "isRendering");
  pane.addInput(sceneContainer.tweakParams, "highlightHudFragments");
  pane.addInput(sceneContainer.tweakParams, "cutsceneShutterValue", {
    min: 0.0,
    max: 1.0
  });
  pane.addInput(sceneContainer.tweakParams, "fontSize", {
    min: 7.0,
    max: 22.0
  });
  pane.addInput(sceneContainer.tweakParams, "lineHeight", {
    min: 7.0,
    max: 22.0
  });
  pane
    .addInput(sceneContainer.tweakParams, "cameraFov", {
      min: 10.0,
      max: 90.0
    })
    .on("change", (ev: TweakPane.TpChangeEvent<number>) => {
      sceneContainer.camera.fov = ev.value;
      sceneContainer.camera.updateProjectionMatrix();
    });
  pane
    .addInput(sceneContainer.tweakParams, "fogDensity", {
      min: 0.0,
      max: 0.015
    })
    .on("change", (ev: TweakPane.TpChangeEvent<number>) => {
      (sceneContainer.scene.fog as THREE.FogExp2).density = ev.value;
    });
  pane
    .addInput(sceneContainer.hudData, "batteryCharge", {
      min: 0.0,
      max: 1.0
    })
    .on("change", (ev: TweakPane.TpChangeEvent<number>) => {
      // console.log(" batteryCharge changed: " + JSON.stringify(ev.value));
    });
  pane.addInput(sceneContainer.hudData, "isBatteryDamaged");
  pane.addInput(sceneContainer.hudData, "isThermometerDamaged");
  pane.addInput(sceneContainer.hudData, "isDockingPossible");

  pane.expanded = false;

  const keyHandler = new KeyHandler({ element: document.body, trackAll: false });
  keyHandler
    .down("h", (e: KeyboardEvent) => {
      const curNavPoint = sceneContainer.gameLogicManager.navpointRouter.getCurrentNavpoint();
      if (curNavPoint) {
        sceneContainer.messageBox.showMessage(`Your next nav point is ${curNavPoint.label}.`);
      } else {
        sceneContainer.messageBox.showMessage(`There is no next nav point.`);
      }
    })
    .down("p", (e: KeyboardEvent) => {
      console.log("[main] Pausing/unpausing game");
      sceneContainer.togglePause();
    })
    .down("n", (e: KeyboardEvent) => {
      console.log("[main] Toggle next nav point");
      sceneContainer.gameLogicManager.navpointRouter.toggleNextRoutePoint();
    })
    .down("k", (e: KeyboardEvent) => {
      console.log("[main] Trying to dock");
      if (sceneContainer.hudData.isDockingPossible) {
        sceneContainer.messageBox.showMessage(`Initializing docking sequence ...`);
        sceneContainer.initializDockingSequence();
      } else {
        sceneContainer.messageBox.showMessage(`Docking is currently not possible.`);
      }
    });

  sceneContainer.gameListeners.gameRunningListeners.add((isGameRunning: boolean, isGamePaused: boolean) => {
    console.log("[main] Game paused?", isGamePaused);
  });

  sceneContainer.initializGame().then(() => {
    if (params.getBoolean("isDocked", false)) {
      console.log("Docking as requested by params.");
      sceneContainer.initializDockingSequence();
    }
  });
});
