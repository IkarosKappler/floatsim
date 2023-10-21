/**
 * A component for rendering chapter intros.
 *
 * @author  Ikaros Kappler
 * @date    2023-09-23
 * @version 1.0.0
 */

import { useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { IFrontendUIBaseProps } from "./FrontendUI";
import { TextCutsceneUI } from "./TextCutsceneUI";
import { MediaStorage } from "../../io/MediaStorage";

interface ChapterIntroProps extends IFrontendUIBaseProps {
  resourcePath: string;
  onTerminated: () => void;
  isGameReady: boolean;
}

export const ChapterIntro = (props: ChapterIntroProps): JSXInternal.Element => {
  const [isShowMap, setShowMap] = useState<boolean>(false);
  const [introText, setIntroText] = useState<string | null>(null);
  const [introRequested, setIntroRequested] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);
  const [isShowNextButton, setShowNextButton] = useState<boolean>(false);

  const requestTextResource = () => {
    setIntroRequested(true);
    setIsLoading(true);
    MediaStorage.getText(props.resourcePath + "intro-text.txt")
      .then(responseText => {
        // console.log(response);
        setIntroText(responseText);
      })
      .catch(error => {
        // console.log(error);
        setError(error);
      })
      .finally(() => {
        // always executed
        globalThis.setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });
  };

  if (!introRequested) {
    return (
      <div className="jsx-textcuscene-ui">
        <img className="jsx-game-logo spinning" src="resources/img/logo-256x256.png" />
        <button
          onClick={() => {
            requestTextResource();
          }}
        >
          Request location
        </button>
        <span>Please click</span>
      </div>
    );
  } else if (isLoading) {
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
          <div className="jsx-textcutscene-mapwrapper">
            <div
              className="jsx-chapterintro-map-base"
              style={{ backgroundImage: "url('resources/chapters/00-north-sea/map-base.png')" }}
            />
            <div
              className="jsx-chapterintro-map-objectives blinking"
              style={{ backgroundImage: "url('resources/chapters/00-north-sea/map-objectives.png')" }}
            />
          </div>
          <button id="button-start" disabled={!props.isGameReady} onClick={props.onTerminated}>
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
              setShowNextButton(true);
            }}
            sceneContainer={props.sceneContainer}
            text={introText}
          />
          {isShowNextButton ? (
            <button
              onClick={() => {
                setShowMap(true);
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
