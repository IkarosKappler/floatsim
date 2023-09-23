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

interface ChapterIntroProps extends IFrontendUIBaseProps {
  resourcePath: string;
  onTerminated: () => void;
  isGameReady: boolean;
}

// export const ChapterIntro = (props: ChapterIntroProps): JSXInternal.Element => {
//   return <span>A</span>;
// };

export const ChapterIntro = (props: ChapterIntroProps): JSXInternal.Element => {
  const [isShowMap, setShowMap] = useState<boolean>(false);
  const [introText, setIntroText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);
  const [isShowNextButton, setShowNextButton] = useState<boolean>(false);

  props.globalLibs.axios
    .get(props.resourcePath + "intro-text.txt")
    .then(response => {
      // handle success
      console.log(response);
      // Validate response data?
      // accept(response.data);
      setIntroText(response.data);
    })
    .catch(error => {
      // handle error
      console.log(error);
      // reject();
      setError(error);
    })
    .finally(() => {
      // always executed
      globalThis.setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });

  //   return <span>Y</span>;

  if (isLoading) {
    return (
      <div className="jsx-textcuscene-ui">
        <span>Loading ...</span>
      </div>
    );
  } else if (error) {
    return (
      <div className="jsx-textcuscene-ui">
        <span className="jsx-error">{error}</span>
      </div>
    );
  } else if (introText) {
    if (isShowMap) {
      return (
        <div className="jsx-textcuscene-ui">
          <img src="resources/chapters/00-north-sea/map-base.png" />
          <button
            id="button-start"
            disabled={!props.isGameReady}
            onClick={() => {
              // TODO: pass function directly
              //   props.sceneContainer.startGame();
              props.onTerminated();
            }}
          >
            Start
          </button>
        </div>
      );
    } else {
      return (
        <div className="jsx-textcuscene-ui">
          <TextCutsceneUI
            globalLibs={props.globalLibs}
            onTerminated={() => {
              console.log("Intro terminated");
              // setShowNextButton(true);
              setShowNextButton(true);
              //   setShowMap(true);
            }}
            sceneContainer={props.sceneContainer}
            text={introText}
          />
          {isShowNextButton ? (
            <button
              onClick={() => {
                // globalThis.setTimeout(() => {
                //   setShowMap(true);
                // }, 2000);
                setShowMap(true);
                // props.onTerminated();
              }}
            >
              Next
            </button>
          ) : (
            <span></span>
          )}
        </div>
      );
    }
  }
};
