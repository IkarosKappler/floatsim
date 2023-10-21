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
/**
 * A class to handle the html frontend UI. The frontent
 * is wrapped in a DIV overlay and used for storytelling
 * and text dialogues.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-09
 * @version 1.0.0
 */
var hooks_1 = require("preact/hooks");
var ChapterIntro_1 = require("./ChapterIntro");
var StationRoom_1 = require("./StationRoom");
var App = function (props) {
    var skipChapterIntro = props.params.getBoolean("skipChapterIntro", false);
    var _a = (0, hooks_1.useState)(false), isGameReady = _a[0], setGameReady = _a[1];
    var _b = (0, hooks_1.useState)(false), isGameStartedState = _b[0], setGameStartedState = _b[1];
    var _c = (0, hooks_1.useState)(false), isGameRunningState = _c[0], setGameRunningState = _c[1];
    var _d = (0, hooks_1.useState)(false), isGamePausedState = _d[0], setGamePausedState = _d[1];
    var _e = (0, hooks_1.useState)(true && !skipChapterIntro), isButtonDisabled = _e[0], setButtonDisabled = _e[1];
    // const [isShowMap, setShowMap] = useState<boolean>(false);
    var _f = (0, hooks_1.useState)(false), isDockingInProgress = _f[0], setDokingInProgress = _f[1];
    var _g = (0, hooks_1.useState)(null), currentStation = _g[0], setCurrentStation = _g[1];
    // Enable button as soon as the game is ready.
    props.sceneContainer.gameListeners.gameReadyListenrs.add(function () {
        console.log("[App] Enabling start button.");
        // setButtonDisabled(false);
        setGameReady(true);
    });
    // Enable button as soon as the game is ready.
    props.sceneContainer.gameListeners.gameRunningListeners.add(function (isGameRunning, isGamePaused) {
        console.log("[App] Pause status changed.", isGamePaused);
        setGamePausedState(isGamePaused);
        setGameRunningState(isGameRunning);
        setGameStartedState(true);
        props.showOverlay();
    });
    // DockedAtStationListener
    // Enable button as soon as the game is ready.
    props.sceneContainer.gameListeners.dockedAtStationListeners.add(function (station, dockingInProgress) {
        if (dockingInProgress) {
            console.log("[App] Docking at station ....", station, dockingInProgress);
        }
        else {
            console.log("[App] Docked at station.", station, dockingInProgress);
        }
        setDokingInProgress(dockingInProgress);
        setCurrentStation(station);
    });
    var handleChaperIntroTerminated = function () {
        props.sceneContainer.startGame();
        props.hideOverlay();
    };
    if (!isGameStartedState && !skipChapterIntro) {
        return ((0, jsx_runtime_1.jsx)(ChapterIntro_1.ChapterIntro, { globalLibs: props.globalLibs, isGameReady: isGameReady, onTerminated: handleChaperIntroTerminated, resourcePath: "resources/chapters/00-north-sea/", sceneContainer: props.sceneContainer }));
    }
    else if (currentStation !== null) {
        return ((0, jsx_runtime_1.jsx)(StationRoom_1.StationRoom, { globalLibs: props.globalLibs, isGameReady: isGameReady, onTerminated: handleChaperIntroTerminated, resourcePath: "resources/chapters/00-north-sea/", sceneContainer: props.sceneContainer, station: currentStation, isDockingInProgress: isDockingInProgress }));
    }
    else {
        return ((0, jsx_runtime_1.jsx)("button", __assign({ id: "button-start", disabled: isButtonDisabled, onClick: function () {
                props.sceneContainer.startGame();
                props.hideOverlay();
            } }, { children: isGamePausedState ? "Paused" : "Start" })));
    }
};
var FrontendUI = /** @class */ (function () {
    function FrontendUI(sceneContainer, globalLibs, params) {
        var overlay = document.querySelector("#overlay");
        var showOverlay = function () {
            overlay.classList.remove("d-none");
        };
        var hideOverlay = function () {
            overlay.classList.add("d-none");
        };
        // globalLibs.preact.render(<App globalLibs={globalLibs} />, document.getElementById("overlay"));
        console.log("[FrontendUI] Rendering frontend App ...", globalLibs.preact.render);
        globalLibs.preact.render((0, jsx_runtime_1.jsx)(App, { params: params, sceneContainer: sceneContainer, globalLibs: globalLibs, hideOverlay: hideOverlay, showOverlay: showOverlay }), document.getElementById("overlay"));
    }
    return FrontendUI;
}());
exports.FrontendUI = FrontendUI;
//# sourceMappingURL=FrontendUI.js.map