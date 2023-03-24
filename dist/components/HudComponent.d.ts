import * as THREE from "three";
import { HUDData, TweakParams } from "./interfaces";
export declare class HudComponent {
    private hudCanvas;
    private hudBitmap;
    private hudCamera;
    private hudScene;
    private hudImage;
    private hudDynamicTexture;
    private hudMaterial;
    private plane;
    private compassMesh;
    constructor(width: number, height: number);
    setHudSize(width: number, height: number): void;
    renderHud(renderer: THREE.WebGLRenderer, data: HUDData, tweakParams: TweakParams): void;
}
