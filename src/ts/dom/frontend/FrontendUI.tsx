/**
 * A class to handle the html frontend UI. The frontent
 * is wrapped in a DIV overlay and used for storytelling
 * and text dialogues.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-09
 * @version 1.0.0
 */

import { render, h } from "preact";
import { useState } from "preact/hooks";
import { IGlobalLibs } from "../../components/interfaces";
import { SceneContainer } from "../../components/SceneContainer";
import { JSXInternal } from "preact/src/jsx";
import { TextCutsceneUI } from "./TextCutsceneUI";

/** @jsx h */

const introText = `
Year: 2663          

You are financially bankrupt.          
After making several losses in your energy business, developing a
next generation of enhanced nuclear reactors, you stay left incapacitatded. Your
tech partners have already disappeared and two handful of clients demand
their investments back. Well, those 1.7 million won't gain from nowhere and
your private accounts have already been seized. Before the authorities of
the Clans Union would accuse you of fraudulent activities it's better to disappear
for a while. Using jump ships
would cause a lot of beaurocratic waves so you make your way and bribe
some freighter captain with your last credits.          

After spending weeks in a dirty cabin and ear pinching humming
noise of the main engine you try to make your way.          

Before entering the Skagerrak the captain dedicates an old cockle boat to you.
This is all you get to make the rest of your way on your own. At least there is
enough oxygen in your tanks to reach your destination:          
Lagertha Electrolyte Research Base in the cold waters of the Barents Sea. It should
only be a journey of a few more days ...`;

export interface IFrontendUIBaseProps {
  sceneContainer: SceneContainer;
  globalLibs: IGlobalLibs;
}

interface IAppProps extends IFrontendUIBaseProps {
  hideOverlay: () => void;
  showOverlay: () => void;
}

const App = (props: IAppProps): JSXInternal.Element => {
  const [isGameStartedState, setGameStartedState] = useState<boolean>(false);
  const [isGameRunningState, setGameRunningState] = useState<boolean>(false);
  const [isGamePausedState, setGamePausedState] = useState<boolean>(false);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [isShowMap, setShowMap] = useState<boolean>(false);

  // Enable button as soon as the game is ready.
  props.sceneContainer.gameListeners.gameReadyListenrs.add(() => {
    console.log("[App] Enabling start button.");
    setButtonDisabled(false);
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

  if (!isGameStartedState) {
    if (isShowMap) {
      return (
        <div className="jsx-textcuscene-ui">
          <img src="resources/img/map-images/00-north-sea/north-sea.png" />
          <button
            id="button-start"
            disabled={isButtonDisabled}
            onClick={() => {
              props.sceneContainer.startGame();
              props.hideOverlay();
            }}
          >
            Start
          </button>
        </div>
      );
    } else {
      return (
        <div className="fullsize">
          <TextCutsceneUI
            globalLibs={props.globalLibs}
            onTerminated={() => {
              console.log("Intro terminated");
              // setShowNextButton(true);
              setShowMap(true);
            }}
            sceneContainer={props.sceneContainer}
            text={introText}
          />
        </div>
      );
    }
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
  // return (
  //   <button
  //     id="button-start"
  //     disabled={isButtonDisabled}
  //     onClick={() => {
  //       props.sceneContainer.startGame();
  //       props.hideOverlay();
  //     }}
  //   >
  //     {isGamePausedState ? "Paused" : "Start"}
  //   </button>
  // );
};

export class FrontendUI {
  constructor(sceneContainer: SceneContainer, globalLibs: IGlobalLibs) {
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
      <App sceneContainer={sceneContainer} globalLibs={globalLibs} hideOverlay={hideOverlay} showOverlay={showOverlay} />,
      document.getElementById("overlay")
    );
  }
}
