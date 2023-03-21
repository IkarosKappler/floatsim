/**
 * @author  Ikaros Kappler
 * @date    2023-03-21
 * @version 1.0.0
 */
export declare class AudioPlayer {
    private isPlayRequested;
    private isPlaying;
    private isReady;
    private audioNode;
    constructor(audioPath: string, audioType: string);
    play(): void;
}
