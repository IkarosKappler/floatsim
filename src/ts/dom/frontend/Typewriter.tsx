/**
 * A UI class that can display text cutscenes.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-24
 * @version 1.0.0
 */

import { useEffect, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { useInterval } from "../customHooks";

interface TypewriterProps {
  // extends IFrontendUIBaseProps {
  isRunning: boolean;
  text: string;
  onTerminated: () => void;
  audio: HTMLAudioElement;
}

export const Typewriter = (props: TypewriterProps): JSXInternal.Element => {
  const [counter, setCounter] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isTerminated, setTerminated] = useState<boolean>(false);
  const [startingTime, setStartingTime] = useState<number>(Date.now());

  if (props.isRunning && hasStarted) {
    props.audio.play();
  }

  const isBeyondDelay = () => {
    return hasStarted && Date.now() - startingTime > 1500;
  };

  const clearInterval = useInterval(() => {
    // console.log("Counter");
    if (props.isRunning && isBeyondDelay()) {
      // Consume n characters per interval step.
      setCounter(counter + 8);
    }
  }, 50);

  // Remember starging time when  triggered
  useEffect(() => {
    if (props.isRunning && !hasStarted) {
      setHasStarted(true);
      setStartingTime(Date.now());
    }
  }, [props.isRunning, hasStarted]);

  // Play/pause audio if requesed.
  useEffect(() => {
    if (props.isRunning && !isTerminated && hasStarted && isBeyondDelay()) {
      props.audio.play();
    } else {
      props.audio.pause();
    }
  }, [props.isRunning, props.audio, isTerminated, hasStarted, startingTime]);

  // Check if end was reached.
  useEffect(() => {
    if (counter > props.text.length) {
      clearInterval();
      props.audio.pause();
      if (!isTerminated) {
        setTerminated(true);
        props.onTerminated();
      }
    }
  }, [counter, clearInterval, props.isRunning, isTerminated]);

  return <div className="jsx-typewriter">{props.text.substring(0, counter)}</div>;
};
