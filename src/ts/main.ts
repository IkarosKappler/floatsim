/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */

import { SceneContainer } from "./components/SceneContainer";

console.log("Main script starting ...");
globalThis.addEventListener("load", () => {
  console.log("Initializing");

  new SceneContainer();
});
