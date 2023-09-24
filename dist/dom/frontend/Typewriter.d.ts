/**
 * A UI class that can display text cutscenes.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-24
 * @version 1.0.0
 */
import { JSXInternal } from "preact/src/jsx";
interface TypewriterProps {
    isRunning: boolean;
    text: string;
    onTerminated: () => void;
    audio: HTMLAudioElement;
}
export declare const Typewriter: (props: TypewriterProps) => JSXInternal.Element;
export {};
