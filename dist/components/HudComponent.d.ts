import * as THREE from "three";
import { HUDData } from "./interfaces";
export declare class HudComponent {
    private hudCanvas;
    private hudBitmap;
    private hudCamera;
    private hudScene;
    private hudImage;
    private hudTexture;
    private hudMaterial;
    private plane;
    private compassMesh;
    constructor(width: number, height: number);
    setHudSize(width: number, height: number): void;
    renderHud(renderer: THREE.WebGLRenderer, data: HUDData): void;
}
