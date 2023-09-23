/**
 * A component for rendering chapter intros.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-23
 * @version 1.0.0
 */
import { JSXInternal } from "preact/src/jsx";
import { IFrontendUIBaseProps } from "./FrontendUI";
interface ChapterIntroProps extends IFrontendUIBaseProps {
    resourcePath: string;
    onTerminated: () => void;
    isGameReady: boolean;
}
export declare const ChapterIntro: (props: ChapterIntroProps) => JSXInternal.Element;
export {};
