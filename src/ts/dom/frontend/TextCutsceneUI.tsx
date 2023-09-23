/**
 * A UI class that can display text cutscenes.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-22
 * @version 1.0.0
 */

import { useEffect, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { IFrontendUIBaseProps } from "./FrontendUI";
import { useInterval } from "../customHooks";

interface TextCutsceneUIProps extends IFrontendUIBaseProps {
  text: string;
  onTerminated: () => void;
}

export const TextCutsceneUI = (props: TextCutsceneUIProps): JSXInternal.Element => {
  const [counter, setCounter] = useState<number>(0);

  const clearInterval = useInterval(() => {
    console.log("Counter");
    setCounter(counter + 20);
  }, 50);

  useEffect(() => {
    if (counter > props.text.length) {
      clearInterval();
      props.onTerminated();
    }
  }, [counter, clearInterval]);

  return <div>{props.text.substring(0, counter)}</div>;
};
