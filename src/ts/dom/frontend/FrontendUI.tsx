/**
 * A class to handle the html frontend UI. The frontent
 * is wrapped in a DIV overlay and used for storytelling
 * and text dialogues.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-09
 * @version 1.0.0
 */

// import { render, h } from "preact";
import { useState } from "preact/hooks";
import { IGlobalLibs } from "../../components/interfaces";
import { SceneContainer } from "../../components/SceneContainer";

/** @jsx h */

interface IAppProps {
  sceneContainer: SceneContainer;
  globalLibs: IGlobalLibs;
  hideOverlay: () => void;
  showOverlay: () => void;
}

const App = (props: IAppProps) => {
  const [input, setInput] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);

  // Enable button as soon as the game is ready.
  props.sceneContainer.gameListeners.gameReadyListenrs.add(() => {
    console.log("[App] Enabling start button.");
    setButtonDisabled(false);
  });

  // Enable button as soon as the game is ready.
  props.sceneContainer.gameListeners.gameRunningListeners.add((isGameRunning: boolean, isGamePaused: boolean) => {
    console.log("[App] Pause status changed.", isGamePaused);
    if (isGamePaused) {
      props.showOverlay();
    } else {
      // TODO: Render PAUSE symbol in overlay
      props.hideOverlay();
    }
  });

  return (
    // <div>
    //   <p>Do you agree to the statement: "Preact is awesome"?</p>
    //   <input value={input} onInput={e => setInput((e.target as HTMLInputElement).value)} />
    //   <span>{input}</span>
    // </div>
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
  );
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
