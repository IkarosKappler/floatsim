/**
 * A UI class that can display text cutscenes.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-22
 * @version 1.0.0
 */

import { useEffect, useRef, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { IFrontendUIBaseProps } from "./FrontendUI";

/** @jsx h */

interface TextCutsceneUIProps extends IFrontendUIBaseProps {
  text: string;
  onTerminated: () => void;
}

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<Function>();
  const [clearRequested, setClearRequested] = useState<boolean>(false);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    if (clearRequested) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [clearRequested, delay]);

  // Set up the cancel-requester
  const requestClear = () => {
    setClearRequested(true);
  };

  return requestClear;
};

export const TextCutsceneUI = (props: TextCutsceneUIProps): JSXInternal.Element => {
  const [counter, setCounter] = useState<number>(0);
  const [isShowNextButton, setShowNextButton] = useState<boolean>(false);

  const clearInterval = useInterval(() => {
    console.log("Counter");
    setCounter(counter + 20);
  }, 50);

  useEffect(() => {
    if (counter > props.text.length) {
      clearInterval();
      // props.onTerminated();
      setShowNextButton(true);
    }
  }, [counter, clearInterval]);

  return (
    <div className="jsx-textcuscene-ui">
      {/* <div>{props.text.substring(0, counter).replaceAll(/\n/g, "<br>")}</div> */}
      <div>{props.text.substring(0, counter)}</div>
      {isShowNextButton ? (
        <button
          onClick={() => {
            // setShowMap(true);
            props.onTerminated();
          }}
        >
          Next
        </button>
      ) : (
        <span></span>
      )}
    </div>
  );
};
