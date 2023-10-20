/**
 * A global class for storing media.
 * Try to avoid loading the same resource multiple times, use this storage.
 *
 * @author Ikaros Kappler
 * @date    2023-09-24
 * @version 1.0.0
 */
import THREE from "three";
import { IGlobalLibs, Size3Immutable } from "../components/interfaces";
declare class MediaStorageImpl {
    audioResources: Record<string, HTMLAudioElement>;
    objResources: Record<string, THREE.Object3D>;
    globalLibs: IGlobalLibs;
    constructor();
    getText(path: string): Promise<string>;
    getAudio(path: string): Promise<HTMLAudioElement>;
    getObjMesh(basePath: string, objFileName: string, targetBounds: Size3Immutable): Promise<THREE.Object3D>;
}
export declare const MediaStorage: MediaStorageImpl;
export {};
