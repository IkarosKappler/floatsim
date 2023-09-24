/**
 * A class to handle the html frontend UI. The frontent
 * is wrapped in a DIV overlay and used for storytelling
 * and text dialogues.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-09
 * @version 1.0.0
 */

import { useState } from "preact/hooks";
import { IGlobalLibs } from "../../components/interfaces";
import { SceneContainer } from "../../components/SceneContainer";
import { JSXInternal } from "preact/src/jsx";
import { ChapterIntro } from "./ChapterIntro";
import { Params } from "../../utils/Params";

export interface IFrontendUIBaseProps {
  sceneContainer: SceneContainer;
  globalLibs: IGlobalLibs;
}

interface IAppProps extends IFrontendUIBaseProps {
  params: Params;
  hideOverlay: () => void;
  showOverlay: () => void;
}

const App = (props: IAppProps): JSXInternal.Element => {
  const skipChapterIntro = props.params.getBoolean("skipChapterIntro", false);

  const [isGameReady, setGameReady] = useState<boolean>(false);
  const [isGameStartedState, setGameStartedState] = useState<boolean>(false);
  const [isGameRunningState, setGameRunningState] = useState<boolean>(false);
  const [isGamePausedState, setGamePausedState] = useState<boolean>(false);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true && !skipChapterIntro);
  // const [isShowMap, setShowMap] = useState<boolean>(false);

  // Enable button as soon as the game is ready.
  props.sceneContainer.gameListeners.gameReadyListenrs.add(() => {
    console.log("[App] Enabling start button.");
    // setButtonDisabled(false);
    setGameReady(true);
  });

  // Enable button as soon as the game is ready.
  props.sceneContainer.gameListeners.gameRunningListeners.add((isGameRunning: boolean, isGamePaused: boolean) => {
    console.log("[App] Pause status changed.", isGamePaused);
    setGamePausedState(isGamePaused);
    setGameRunningState(isGameRunning);
    setGameStartedState(true);
    if (isGamePaused) {
      props.showOverlay();
    } else {
      // TODO: Render PAUSE symbol in overlay
      props.hideOverlay();
    }
  });

  const handleChaperIntroTerminated = () => {
    props.sceneContainer.startGame();
    props.hideOverlay();
  };

  if (!isGameStartedState && !skipChapterIntro) {
    // return <span>X</span>;
    // return <Test testText="Test" globalLibs={props.globalLibs} sceneContainer={props.sceneContainer} />;
    return (
      <ChapterIntro
        globalLibs={props.globalLibs}
        isGameReady={isGameReady}
        onTerminated={handleChaperIntroTerminated}
        resourcePath="resources/chapters/00-north-sea/"
        sceneContainer={props.sceneContainer}
      />
    );
  } else {
    return (
      <button
        id="button-start"
        disabled={isButtonDisabled}
        onClick={() => {
          props.sceneContainer.startGame();
          props.hideOverlay();
        }}
      >
        {isGamePausedState ? "Paused" : "Start"}
      </button>
    );
  }
};

export class FrontendUI {
  constructor(sceneContainer: SceneContainer, globalLibs: IGlobalLibs, params: Params) {
    const overlay = document.querySelector("#overlay");
    const showOverlay = () => {
      overlay.classList.remove("d-none");
    };
    const hideOverlay = () => {
      overlay.classList.add("d-none");
    };

    // globalLibs.preact.render(<App globalLibs={globalLibs} />, document.getElementById("overlay"));
    console.log("[FrontendUI] Rendering frontend App ...", globalLibs.preact.render);
    globalLibs.preact.render(
      <App
        params={params}
        sceneContainer={sceneContainer}
        globalLibs={globalLibs}
        hideOverlay={hideOverlay}
        showOverlay={showOverlay}
      />,
      document.getElementById("overlay")
    );
  }
}
