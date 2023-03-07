/**
 * @author  Ikaros Kappler
 * @date    2023-03-07
 * @version 1.0.0
 */

import { SceneContainer } from "./components/SceneContainer";

globalThis.addEventListener("load", () => {
  console.log("Initializing");

  new SceneContainer();
});
