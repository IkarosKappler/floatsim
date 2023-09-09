/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */

import type preact from "preact";
import { SceneContainer } from "./components/SceneContainer";
import { FrontendUI } from "./dom/frontend/FrontendUI";
import { KeyHandler } from "./io/KeyHandler";
import { gup } from "./utils/gup";
import { Params } from "./utils/Params";

import * as TweakPane from "tweakpane";
import { IGlobalLibs } from "./components/interfaces";

console.log("Main script starting ...");
globalThis.addEventListener("load", () => {
  console.log("[main] Initializing");

  const preactLib = globalThis["preact"] as typeof preact;
  console.log("[main] preact", preactLib);
  const globalLibs: IGlobalLibs = {
    preact: preactLib
  };

  const GUP: Record<string, string> = gup();
  const params: Params = new Params(GUP);

  console.log("SceneContainer", SceneContainer);
  const sceneContainer = new SceneContainer(params);

  const frontendUI = new FrontendUI(sceneContainer, globalLibs);
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
      console.log(" cameraFovchanged: " + JSON.stringify(ev.value));
      sceneContainer.camera.fov = ev.value;
      sceneContainer.camera.updateProjectionMatrix();
    });
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
    });

  sceneContainer.gameListeners.gameRunningListeners.add((isGameRunning: boolean, isGamePaused: boolean) => {
    console.log("[main] Game paused?", isGamePaused);
  });

  sceneContainer.initializGame();
});
