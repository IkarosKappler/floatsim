import * as THREE from "three";
import { MinMax } from "../interfaces";
import { SceneContainer } from "../SceneContainer";

/**
 * Fog is measured this way:
 *
 * ----- highGogDepth.max
 *   |
 *   | (greenish color)
 *   |
 * ----- highFogDepth.min
 *   |
 *   | (normal blue color )
 *   |
 * ----- deepFogDepdth.max
 *   |
 *   | (dark blackish blue color)
 *   |
 * ----- deepFogDeath.min
 */
export class FogHandler {
  private sceneContainer: SceneContainer;

  readonly fogNormalColor: THREE.Color;
  readonly fogUpperColor: THREE.Color;
  readonly fogLowerColor: THREE.Color;

  constructor(sceneContainer: SceneContainer) {
    this.sceneContainer = sceneContainer;

    this.fogNormalColor = new THREE.Color(0x021a38); // = (0.0078, 9.8007, 4.5536) per cent
    this.fogUpperColor = new THREE.Color(0x004001);
    this.fogLowerColor = new THREE.Color(0x000000);
  }

  updateFogColor() {
    let curOffset = this.sceneContainer.camera.position.y;
    // var pct = (THREE.MathUtils.clamp(curOffset, zStartOffset, zMaxOffset) - zStartOffset) / (zMaxOffset - zStartOffset);
    if (
      curOffset >= this.sceneContainer.sceneData.deepFogDepth.max &&
      curOffset < this.sceneContainer.sceneData.highFogDepth.min
    ) {
      // Use normal fog color
      this.sceneContainer.scene.fog.color.set(this.fogNormalColor);
      (this.sceneContainer.scene.background as THREE.Color).set(this.sceneContainer.scene.fog.color);
    } else if (curOffset >= this.sceneContainer.sceneData.highFogDepth.min) {
      // Use high sea color
      this.applyFogColor(curOffset, this.sceneContainer.sceneData.highFogDepth, this.fogNormalColor, this.fogUpperColor);
    } else {
      // Use deep sea color
      this.applyFogColor(curOffset, this.sceneContainer.sceneData.deepFogDepth, this.fogLowerColor, this.fogNormalColor);
    }
  }

  private applyFogColor(curValue: number, range: MinMax, minColor: THREE.Color, maxColor: THREE.Color) {
    let pct = (THREE.MathUtils.clamp(curValue, range.min, range.max) - range.min) / (range.max - range.min);
    // console.log("[upper] pct", pct, "curOffset", curValue);
    this.sceneContainer.scene.fog.color.lerpColors(minColor, maxColor, pct);
    (this.sceneContainer.scene.background as THREE.Color).set(this.sceneContainer.scene.fog.color);
  }
}
