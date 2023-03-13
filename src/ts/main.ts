/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */

import { SceneContainer } from "./components/SceneContainer";
import { gup } from "./utils/gup";
import { Params } from "./utils/Params";

console.log("Main script starting ...");
globalThis.addEventListener("load", () => {
  console.log("Initializing");

  const GUP: Record<string, string> = gup();
  const params: Params = new Params(GUP);

  console.log("SceneContainer", SceneContainer);
  new SceneContainer(params);
});
