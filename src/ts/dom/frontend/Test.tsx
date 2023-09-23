/**
 * A component for rendering chapter intros.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-23
 * @version 1.0.0
 */

import { useEffect, useRef, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { IFrontendUIBaseProps } from "./FrontendUI";
import { useInterval } from "../customHooks";
import { TextCutsceneUI } from "./TextCutsceneUI";

interface TestProps extends IFrontendUIBaseProps {
  testText: string;
}

export const Test = (props: TestProps): JSXInternal.Element => {
  return <span>{props.testText}</span>;
};
