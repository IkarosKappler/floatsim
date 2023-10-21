"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationRoom = void 0;
var jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * A component for rendering chapter intros.
 *
 * @author  Ikaros Kappler
 * @date    2023-10-21
 * @version 1.0.0
 */
var hooks_1 = require("preact/hooks");
var rpg_dialogue_js_1 = require("rpg-dialogue-js");
var StationRoom = function (props) {
    //   const [isShowMap, setShowMap] = useState<boolean>(false);
    //   const [introText, setIntroText] = useState<string | null>(null);
    //   const [introRequested, setIntroRequested] = useState<boolean>(false);
    //   const [isLoading, setIsLoading] = useState<boolean>(false);
    //   const [error, setError] = useState<any | null>(null);
    //   const [isShowNextButton, setShowNextButton] = useState<boolean>(false);
    var _a = (0, hooks_1.useState)(false), isJSONRequested = _a[0], setJSONRequested = _a[1];
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
    var rpgDialogue = (0, rpg_dialogue_js_1.RPGDialogue)();
    var pathYannick = "resources/chapters/00-north-sea/npc/dialog-config-Yannick.json";
    var pathLuka = "resources/chapters/00-north-sea/npc/dialog-config-Luka.json";
    var paths = {
        yannick: pathYannick,
        luka: pathLuka
    };
    var globalLibs = { axios: props.globalLibs.axios };
    if (!isJSONRequested) {
        setJSONRequested(true);
        rpgDialogue.RPGDialogueLogic.loadAllFromJSON(paths, globalLibs).then(function (dialogueMappings) {
            console.log("dialogues", dialogueMappings.length);
            // +---------------------------------------------------------------------------------
            // | Define a default dialogue renderer.
            // | This one just uses the given DIV tags for input and output.
            // +-------------------------------
            var dialogueRenderer = new rpgDialogue.DefaultDialogueRenderer("rpg-output-question", "rpg-output-options");
            var enableLuka_PartA = function () {
                console.log("Starting Luka's dialogue.");
                sequence.beginConversation(dialogueRenderer, "luka", "intro");
            };
            // +---------------------------------------------------------------------------------
            // | Define a dialogue sequence and add a rule:
            // | Once Yannick's dialigue has ended, allow to click and start Luka's dialogue.
            // +-------------------------------
            var sequence = new rpgDialogue.RPGDialogueSequence(dialogueMappings);
            sequence.addRule("yannick", null, function () {
                console.log("End of yannick's dialogue reached.");
                disableNpc("yannick", undefined);
                enableNpc("luka", enableLuka_PartA);
            });
            var enableLuka_PartB = function () {
                console.log("Starting Luka's second dialogue.");
                sequence.beginConversation(dialogueRenderer, "luka", "intro_2");
            };
            // +---------------------------------------------------------------------------------
            // | Define a dialigue sequence and add a rule:
            // | ...
            // +-------------------------------
            sequence.addRule("luka", null, function () {
                console.log("End of luka's dialogue reached.");
                // Set a new begin-codition: 'intro_2'
                disableNpc("luka", enableLuka_PartA); // Remove the listener
                enableNpc("luka", enableLuka_PartB); // Add the new listener
            });
            sequence.beginConversation(dialogueRenderer, "yannick", "intro");
        });
    }
    var disableNpc = function (npcName, oldListener) {
        var container = document.getElementById(npcName);
        container.classList.remove("active");
        container.removeEventListener("click", oldListener);
    };
    var enableNpc = function (npcName, onClick) {
        var container = document.getElementById(npcName);
        container.classList.add("active");
        container.addEventListener("click", onClick);
    };
    //   const handleYannickClick = (): (() => void) => {
    //     return () => {
    //       // ...
    //     };
    //   };
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "jsx-stationroom-ui" }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ className: "jsx-stationroom-title" }, { children: [props.isDockingInProgress ? "Docking" : "Docked", " at station: ", props.station.name] })), (0, jsx_runtime_1.jsx)("img", { className: "jsx-game-logo spinning ".concat(props.isDockingInProgress ? "" : "d-none"), src: "resources/img/logo-256x256.png" }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "jsx-roomimage-wrapper ".concat(props.isDockingInProgress ? "hide-and-minify" : ""), style: { backgroundImage: "url('resources/chapters/00-north-sea/anning-anchorage-1219x830-pixel12.png')" } }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ id: "rpg-output", class: "rpg-output" }, { children: [(0, jsx_runtime_1.jsx)("div", { id: "rpg-output-question", class: "rpg-output-question" }), (0, jsx_runtime_1.jsx)("ul", { id: "rpg-output-options", class: "rpg-output-options" })] })), (0, jsx_runtime_1.jsxs)("div", __assign({ class: "room" }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ class: "npc active", id: "yannick" }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ class: "npc-name" }, { children: "Yannick" })), (0, jsx_runtime_1.jsx)("img", { src: "resources/chapters/00-north-sea/npc/jannick-static.png", class: "pixelate npc-32x64" })] })), (0, jsx_runtime_1.jsxs)("div", __assign({ class: "npc", id: "luka" }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ class: "npc-name" }, { children: "Luka" })), (0, jsx_runtime_1.jsx)("img", { src: "resources/chapters/00-north-sea/npc/luka-static.png", class: "pixelate npc-32x64" })] }))] }))] }))] })));
};
exports.StationRoom = StationRoom;
//# sourceMappingURL=StationRoom.js.map