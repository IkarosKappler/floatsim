/**
 * A global class for storing media.
 * Try to avoid loading the same resource multiple times, use this storage.
 *
 * @author Ikaros Kappler
 * @date    2023-09-24
 * @version 1.0.0
 */
import { IGlobalLibs } from "../components/interfaces";
declare class MediaStorageImpl {
    audioResources: Record<string, HTMLAudioElement>;
    globalLibs: IGlobalLibs;
    constructor();
    getText(path: string): Promise<string>;
    getAudio(path: string): Promise<HTMLAudioElement>;
}
export declare const MediaStorage: MediaStorageImpl;
export {};
