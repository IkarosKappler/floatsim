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
import { Typewriter } from "./Typewriter";
import { MediaStorage } from "../../io/MediaStorage";

interface TextCutsceneUIProps extends IFrontendUIBaseProps {
  text: string;
  onTerminated: () => void;
}

export const TextCutsceneUI = (props: TextCutsceneUIProps): JSXInternal.Element => {
  const [textSegmentCounter, setCounter] = useState<number>(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // const audio = MediaStorage.getAudio("resources/audio/custom-sounds/typewriter-01.wav");
  // audio.loop = true;
  MediaStorage.getAudio("resources/audio/custom-sounds/typewriter-01.wav")
    .then(fetchedAudio => {
      console.log("audio fetched");
      fetchedAudio.loop = true;
      setAudio(fetchedAudio);
    })
    .catch(error => {
      console.error("[TextCutsceneUI] Failed to load typewriter audio effect.", error);
    });

  // Split text into paragraphs
  const textSegments = props.text.split(/\n(\n+)/g).filter((text: string) => text.trim().length > 0);
  console.log("textSegments", textSegments.length);

  const increaseTextSegmentCounter = () => {
    const hasTerminated = textSegmentCounter + 1 === textSegments.length;
    setCounter(textSegmentCounter + 1);
    if (hasTerminated) {
      globalThis.setTimeout(props.onTerminated, 1500);
    }
  };

  // return <div>{props.text}</div>;
  // console.log("textSegmentCounter", textSegmentCounter);
  return audio ? (
    <div className="jsx-typewriter-wrapper">
      {textSegments.map((text: string, index: number) => {
        return (
          <Typewriter
            audio={audio}
            text={text}
            onTerminated={increaseTextSegmentCounter}
            isRunning={textSegmentCounter === index}
          />
        );
      })}
    </div>
  ) : null;
};
