/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */

import { SceneContainer } from "./components/SceneContainer";
import { gup } from "./utils/gup";
import { Params } from "./utils/Params";

import * as TweakPane from "tweakpane";

console.log("Main script starting ...");
globalThis.addEventListener("load", () => {
  console.log("Initializing");

  const GUP: Record<string, string> = gup();
  const params: Params = new Params(GUP);

  console.log("SceneContainer", SceneContainer);
  const sceneContainer = new SceneContainer(params);

  console.log(TweakPane);
  const pane = new window["Tweakpane"].Pane() as TweakPane.Pane;
  pane.addInput(sceneContainer.tweakParams, "compassZ", {
    min: -150,
    max: 150
  });
  pane.addInput(sceneContainer.tweakParams, "sonarZ", {
    min: -150,
    max: 150
  });
  pane.addInput(sceneContainer.tweakParams, "isRendering");
  pane.addInput(sceneContainer.tweakParams, "highlightHudFragments");
  pane.on("change", (ev: TweakPane.TpChangeEvent<number>) => {
    console.log("changed: " + JSON.stringify(ev.value));
  });
  pane.addInput(sceneContainer.tweakParams, "cutsceneShutterValue", {
    min: 0.0,
    max: 1.0
  });
});
