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
exports.FrontendUI = void 0;
var jsx_runtime_1 = require("preact/jsx-runtime");
var hooks_1 = require("preact/hooks");
var TextCutsceneUI_1 = require("./TextCutsceneUI");
/** @jsx h */
var introText = "\nYear: 2663          \n\nYou are financially bankrupt.          \nAfter making several losses in your energy business, developing a\nnext generation of enhanced nuclear reactors, you stay left incapacitatded. Your\ntech partners have already disappeared and two handful of clients demand\ntheir investments back. Well, those 1.7 million won't gain from nowhere and\nyour private accounts have already been seized. Before the authorities of\nthe Clans Union would accuse you of fraudulent activities it's better to disappear\nfor a while. Using jump ships\nwould cause a lot of beaurocratic waves so you make your way and bribe\nsome freighter captain with your last credits.          \n\nAfter spending weeks in a dirty cabin and ear pinching humming\nnoise of the main engine you try to make your way.          \n\nBefore entering the Skagerrak the captain dedicates an old cockle boat to you.\nThis is all you get to make the rest of your way on your own. At least there is\nenough oxygen in your tanks to reach your destination:          \nLagertha Electrolyte Research Base in the cold waters of the Barents Sea. It should\nonly be a journey of a few more days ...";
var App = function (props) {
    var _a = (0, hooks_1.useState)(false), isGameStartedState = _a[0], setGameStartedState = _a[1];
    var _b = (0, hooks_1.useState)(false), isGameRunningState = _b[0], setGameRunningState = _b[1];
    var _c = (0, hooks_1.useState)(false), isGamePausedState = _c[0], setGamePausedState = _c[1];
    var _d = (0, hooks_1.useState)(true), isButtonDisabled = _d[0], setButtonDisabled = _d[1];
    var _e = (0, hooks_1.useState)(false), isShowMap = _e[0], setShowMap = _e[1];
    // Enable button as soon as the game is ready.
    props.sceneContainer.gameListeners.gameReadyListenrs.add(function () {
        console.log("[App] Enabling start button.");
        setButtonDisabled(false);
    });
    // Enable button as soon as the game is ready.
    props.sceneContainer.gameListeners.gameRunningListeners.add(function (isGameRunning, isGamePaused) {
        console.log("[App] Pause status changed.", isGamePaused);
        setGamePausedState(isGamePaused);
        setGameRunningState(isGameRunning);
        setGameStartedState(true);
        if (isGamePaused) {
            props.showOverlay();
        }
        else {
            // TODO: Render PAUSE symbol in overlay
            props.hideOverlay();
        }
    });
    if (!isGameStartedState) {
        if (isShowMap) {
            return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "jsx-textcuscene-ui" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: "resources/img/map-images/00-north-sea/north-sea.png" }), (0, jsx_runtime_1.jsx)("button", __assign({ id: "button-start", disabled: isButtonDisabled, onClick: function () {
                            props.sceneContainer.startGame();
                            props.hideOverlay();
                        } }, { children: "Start" }))] })));
        }
        else {
            return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "fullsize" }, { children: (0, jsx_runtime_1.jsx)(TextCutsceneUI_1.TextCutsceneUI, { globalLibs: props.globalLibs, onTerminated: function () {
                        console.log("Intro terminated");
                        // setShowNextButton(true);
                        setShowMap(true);
                    }, sceneContainer: props.sceneContainer, text: introText }) })));
        }
    }
    else {
        return ((0, jsx_runtime_1.jsx)("button", __assign({ id: "button-start", disabled: isButtonDisabled, onClick: function () {
                props.sceneContainer.startGame();
                props.hideOverlay();
            } }, { children: isGamePausedState ? "Paused" : "Start" })));
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
var FrontendUI = /** @class */ (function () {
    function FrontendUI(sceneContainer, globalLibs) {
        var overlay = document.querySelector("#overlay");
        var showOverlay = function () {
            overlay.classList.remove("d-none");
        };
        var hideOverlay = function () {
            overlay.classList.add("d-none");
        };
        // globalLibs.preact.render(<App globalLibs={globalLibs} />, document.getElementById("overlay"));
        console.log("[FrontendUI] Rendering frontend App ...", globalLibs.preact.render);
        globalLibs.preact.render((0, jsx_runtime_1.jsx)(App, { sceneContainer: sceneContainer, globalLibs: globalLibs, hideOverlay: hideOverlay, showOverlay: showOverlay }), document.getElementById("overlay"));
    }
    return FrontendUI;
}());
exports.FrontendUI = FrontendUI;
//# sourceMappingURL=FrontendUI.js.map