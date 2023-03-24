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
  new SceneContainer(params);

  console.log(TweakPane);
  const pane = new window["Tweakpane"].Pane() as TweakPane.Pane;
  const PARAMS = {
    z: 0.5
  };
  pane.addInput(PARAMS, "z", {
    min: -150,
    max: 150
  });
  pane.on("change", (ev: TweakPane.TpChangeEvent<number>) => {
    console.log("changed: " + JSON.stringify(ev.value));
  });
});
