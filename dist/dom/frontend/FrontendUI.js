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
// import { render, h } from "preact";
var hooks_1 = require("preact/hooks");
var App = function (props) {
    var _a = (0, hooks_1.useState)(""), input = _a[0], setInput = _a[1];
    var _b = (0, hooks_1.useState)(true), isButtonDisabled = _b[0], setButtonDisabled = _b[1];
    // Enable button as soon as the game is ready.
    props.sceneContainer.gameListeners.gameReadyListenrs.add(function () {
        console.log("[App] Enabling start button.");
        setButtonDisabled(false);
    });
    // Enable button as soon as the game is ready.
    props.sceneContainer.gameListeners.gameRunningListeners.add(function (isGameRunning, isGamePaused) {
        console.log("[App] Pause status changed.", isGamePaused);
        if (isGamePaused) {
            props.showOverlay();
        }
        else {
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
    (0, jsx_runtime_1.jsx)("button", __assign({ id: "button-start", disabled: isButtonDisabled, onClick: function () {
            props.sceneContainer.startGame();
            props.hideOverlay();
        } }, { children: "Start" })));
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