/**
 * A UI class that can display text cutscenes.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-22
 * @version 1.0.0
 */
import { JSXInternal } from "preact/src/jsx";
import { IFrontendUIBaseProps } from "./FrontendUI";
interface TextCutsceneUIProps extends IFrontendUIBaseProps {
    text: string;
    onTerminated: () => void;
}
export declare const TextCutsceneUI: (props: TextCutsceneUIProps) => JSXInternal.Element;
export {};
