/**
 * A component for rendering chapter intros.
 *
 * @author  Ikaros Kappler
 * @date    2023-10-21
 * @version 1.0.0
 */

import { useEffect, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { IFrontendUIBaseProps } from "./FrontendUI";
import { TextCutsceneUI } from "./TextCutsceneUI";
import { MediaStorage } from "../../io/MediaStorage";
import { StationData } from "../../components/interfaces";
import { RPGDialogue } from "rpg-dialogue-js";
import type axios from "axios";
import { IGlobalLibs } from "rpg-dialogue-js/src/ts/interfaces";

interface StationRoomProps extends IFrontendUIBaseProps {
  resourcePath: string;
  onTerminated: () => void;
  isGameReady: boolean;
  station: StationData;
  isDockingInProgress: boolean;
}

export const StationRoom = (props: StationRoomProps): JSXInternal.Element => {
  //   const [isShowMap, setShowMap] = useState<boolean>(false);
  //   const [introText, setIntroText] = useState<string | null>(null);
  //   const [introRequested, setIntroRequested] = useState<boolean>(false);
  //   const [isLoading, setIsLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<any | null>(null);
  //   const [isShowNextButton, setShowNextButton] = useState<boolean>(false);
  const [isJSONRequested, setJSONRequested] = useState<boolean>(false);

  //   const requestTextResource = () => {
  //     setIntroRequested(true);
  //     setIsLoading(true);
  //     MediaStorage.getText(props.resourcePath + "intro-text.txt")
  //       .then(responseText => {
  //         // console.log(response);
  //         setIntroText(responseText);
  //       })
  //       .catch(error => {
  //         // console.log(error);
  //         setError(error);
  //       })
  //       .finally(() => {
  //         // always executed
  //         globalThis.setTimeout(() => {
  //           setIsLoading(false);
  //         }, 2000);
  //       });
  //   };

  var rpgDialogue = RPGDialogue();

  var pathYannick = "resources/chapters/00-north-sea/npc/dialog-config-Yannick.json";
  var pathLuka = "resources/chapters/00-north-sea/npc/dialog-config-Luka.json";
  var paths = {
    yannick: pathYannick,
    luka: pathLuka
  };
  var globalLibs = { axios: props.globalLibs.axios as typeof axios };

  if (!isJSONRequested) {
    setJSONRequested(true);
    rpgDialogue.RPGDialogueLogic.loadAllFromJSON(paths, globalLibs as any as IGlobalLibs).then(dialogueMappings => {
      console.log("dialogues", dialogueMappings.length);

      // +---------------------------------------------------------------------------------
      // | Define a default dialogue renderer.
      // | This one just uses the given DIV tags for input and output.
      // +-------------------------------
      const dialogueRenderer = new rpgDialogue.DefaultDialogueRenderer("rpg-output-question", "rpg-output-options");

      const enableLuka_PartA = () => {
        console.log("Starting Luka's dialogue.");
        sequence.beginConversation(dialogueRenderer, "luka", "intro");
      };

      // +---------------------------------------------------------------------------------
      // | Define a dialogue sequence and add a rule:
      // | Once Yannick's dialigue has ended, allow to click and start Luka's dialogue.
      // +-------------------------------
      const sequence = new rpgDialogue.RPGDialogueSequence(dialogueMappings);
      sequence.addRule("yannick", null, () => {
        console.log("End of yannick's dialogue reached.");
        disableNpc("yannick", undefined);
        enableNpc("luka", enableLuka_PartA);
      });

      const enableLuka_PartB = () => {
        console.log("Starting Luka's second dialogue.");
        sequence.beginConversation(dialogueRenderer, "luka", "intro_2");
      };

      // +---------------------------------------------------------------------------------
      // | Define a dialigue sequence and add a rule:
      // | ...
      // +-------------------------------
      sequence.addRule("luka", null, () => {
        console.log("End of luka's dialogue reached.");
        // Set a new begin-codition: 'intro_2'
        disableNpc("luka", enableLuka_PartA); // Remove the listener
        enableNpc("luka", enableLuka_PartB); // Add the new listener
      });

      sequence.beginConversation(dialogueRenderer, "yannick", "intro");
    });
  }

  const disableNpc = (npcName, oldListener) => {
    const container = document.getElementById(npcName);
    container.classList.remove("active");
    container.removeEventListener("click", oldListener);
  };

  const enableNpc = (npcName, onClick) => {
    const container = document.getElementById(npcName);
    container.classList.add("active");
    container.addEventListener("click", onClick);
  };

  //   const handleYannickClick = (): (() => void) => {
  //     return () => {
  //       // ...
  //     };
  //   };

  return (
    <div className="jsx-stationroom-ui">
      <div className="jsx-stationroom-title">
        {props.isDockingInProgress ? "Docking" : "Docked"} at station: {props.station.name}
      </div>
      <img
        className={`jsx-game-logo spinning ${props.isDockingInProgress ? "" : "d-none"}`}
        src="resources/img/logo-256x256.png"
      />
      <div
        className={`jsx-roomimage-wrapper ${props.isDockingInProgress ? "hide-and-minify" : ""}`}
        style={{ backgroundImage: "url('resources/chapters/00-north-sea/anning-anchorage-1219x830-pixel12.png')" }}
      >
        <div id="rpg-output" class="rpg-output">
          <div id="rpg-output-question" class="rpg-output-question"></div>
          <ul id="rpg-output-options" class="rpg-output-options"></ul>
        </div>

        <div class="room">
          <div class="npc active" id="yannick">
            <div class="npc-name">Yannick</div>
            <img src="resources/chapters/00-north-sea/npc/jannick-static.png" class="pixelate npc-32x64" />
          </div>
          <div class="npc" id="luka">
            <div class="npc-name">Luka</div>
            <img src="resources/chapters/00-north-sea/npc/luka-static.png" class="pixelate npc-32x64" />
          </div>
        </div>
      </div>
    </div>
  );
};
