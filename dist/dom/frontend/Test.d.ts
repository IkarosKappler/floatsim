/**
 * A component for rendering chapter intros.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-23
 * @version 1.0.0
 */
import { JSXInternal } from "preact/src/jsx";
import { IFrontendUIBaseProps } from "./FrontendUI";
interface TestProps extends IFrontendUIBaseProps {
    testText: string;
}
export declare const Test: (props: TestProps) => JSXInternal.Element;
export {};
